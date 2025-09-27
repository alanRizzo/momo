"use client";

import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ApiClient } from "@/lib/api-client";

interface OrderItem {
	id: number;
	product_name: string;
	quantity: number;
	price: number;
}

interface OrderDetail {
	id: number;
	date: string;
	total: number;
	status: string;
	items: OrderItem[];
}

export function OrderDetailModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [order, setOrder] = useState<OrderDetail | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const openModal = (e: CustomEvent<{ orderId: number }>) => {
			setIsOpen(true);
			fetchOrderDetail(e.detail.orderId);
		};
		window.addEventListener("openOrderDetail", openModal as EventListener);
		return () =>
			window.removeEventListener("openOrderDetail", openModal as EventListener);
	}, []);

	const fetchOrderDetail = async (orderId: number) => {
		setLoading(true);
		try {
			const data = await ApiClient.get<OrderDetail>(`/orders/${orderId}`);
			setOrder(data);
		} catch (err) {
			console.error("Error obteniendo detalle del pedido:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Detalle del Pedido</DialogTitle>
				</DialogHeader>

				{loading ? (
					<p className="text-center">Cargando detalle...</p>
				) : order ? (
					<div className="space-y-4">
						<div>
							<p className="font-semibold">Pedido #{order.id}</p>
							<p className="text-sm text-muted-foreground">
								{new Date(order.date).toLocaleDateString()} - {order.status}
							</p>
							<p className="font-bold mt-1">Total: ${order.total}</p>
						</div>

						<div className="border-t pt-3 space-y-2">
							{order.items.map((item) => (
								<div
									key={item.id}
									className="flex justify-between text-sm border-b pb-2"
								>
									<span>
										{item.product_name} × {item.quantity}
									</span>
									<span>${item.price * item.quantity}</span>
								</div>
							))}
						</div>
					</div>
				) : (
					<p className="text-center text-muted-foreground">
						No se encontró el pedido.
					</p>
				)}

				<DialogFooter>
					<Button onClick={() => setIsOpen(false)}>Cerrar</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
