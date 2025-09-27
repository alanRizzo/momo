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
import { useAuth } from "@/contexts/auth-context";
import { ApiClient } from "@/lib/api-client";

interface Order {
	id: number;
	date: string;
	total: number;
	status: string;
}

export function OrdersHistoryModal() {
	const { user } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const openModal = () => setIsOpen(true);
		window.addEventListener("openOrdersHistory", openModal);
		return () => window.removeEventListener("openOrdersHistory", openModal);
	}, []);

	useEffect(() => {
		if (isOpen && user) {
			fetchOrders();
		}
	}, [isOpen, user]);

	const fetchOrders = async () => {
		if (!user) return;
		setLoading(true);
		try {
			const data = await ApiClient.get<Order[]>(`/users/${user.id}/orders`);
			setOrders(data);
		} catch (err) {
			console.error("Error obteniendo pedidos:", err);
		} finally {
			setLoading(false);
		}
	};

	const openOrderDetail = (orderId: number) => {
		window.dispatchEvent(
			new CustomEvent("openOrderDetail", { detail: { orderId } }),
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Historial de pedidos</DialogTitle>
				</DialogHeader>

				<div className="space-y-3">
					{loading ? (
						<p className="text-center">Cargando pedidos...</p>
					) : orders.length > 0 ? (
						orders.map((order) => (
							<div
								key={order.id}
								className="flex justify-between items-center border rounded-lg p-3 cursor-pointer hover:bg-muted"
								onClick={() => openOrderDetail(order.id)}
							>
								<div>
									<p className="font-semibold">Pedido #{order.id}</p>
									<p className="text-sm text-muted-foreground">
										{new Date(order.date).toLocaleDateString()}
									</p>
								</div>
								<div className="text-right">
									<p className="font-bold">${order.total}</p>
									<p className="text-xs">{order.status}</p>
								</div>
							</div>
						))
					) : (
						<p className="text-center text-muted-foreground">
							No tienes pedidos aún.
						</p>
					)}
				</div>

				<DialogFooter>
					<Button onClick={() => setIsOpen(false)}>Cerrar</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
