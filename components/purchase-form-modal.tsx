"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Package, User, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { AuthModal } from "@/components/auth-modal";
import type { ProductSelection } from "@/types/product";

interface Product {
	id: number;
	name: string;
	image: string;
	price: string;
}

interface CartItem extends Product {
	options: ProductSelection;
	cartId: number;
}

interface PurchaseFormModalProps {
	cartItems: CartItem[];
	isOpen: boolean;
	onClose: () => void;
	onRemoveItem: (cartId: string) => void;
}

const grindLabels = {
	whole: "Granos Enteros",
	coarse: "Gruesa",
	medium: "Media",
	fine: "Fina",
	espresso: "Espresso",
	nespresso: "Nespresso",
};

const presentationLabels = {
	quarter: "1/4 kg",
	half: "1/2 kg",
	full: "1 kg",
};

const presentationMultipliers = {
	quarter: 1,
	half: 1.8,
	full: 3.5,
};

// 🔹 Hook local para cálculos de carrito
function useCartCalculations(cartItems: CartItem[]) {
	const calculateItemTotal = (item: CartItem) => {
		const basePrice =
			typeof item.price === "string"
				? Number.parseFloat(item.price.replace("$", ""))
				: Number(item.price);

		if (
			item.options.quarterQuantity !== undefined ||
			item.options.fullQuantity !== undefined
		) {
			const quarterTotal = basePrice * 1 * (item.options.quarterQuantity || 0);
			const fullTotal = basePrice * 3.5 * (item.options.fullQuantity || 0);
			return quarterTotal + fullTotal;
		}

		const multiplier =
			presentationMultipliers[
				item.options.presentation as keyof typeof presentationMultipliers
			] || 1;
		const quantity = item.options.quantity || 1;
		return basePrice * multiplier * quantity;
	};

	const groupedItems = useMemo(() => {
		const grouped = cartItems.reduce(
			(acc, item) => {
				const key = `${item.id}-${item.options.grind}`;

				if (!acc[key]) {
					acc[key] = {
						product: item,
						presentations: [],
					};
				}

				if (
					item.options.quarterQuantity !== undefined ||
					item.options.fullQuantity !== undefined
				) {
					if (
						item.options.quarterQuantity &&
						item.options.quarterQuantity > 0
					) {
						acc[key].presentations.push({
							type: "quarter",
							quantity: item.options.quarterQuantity,
							label: "1/4 kg",
							cartId: `${item.cartId}-quarter`,
						});
					}
					if (item.options.fullQuantity && item.options.fullQuantity > 0) {
						acc[key].presentations.push({
							type: "full",
							quantity: item.options.fullQuantity,
							label: "1 kg",
							cartId: `${item.cartId}-full`,
						});
					}
				} else {
					acc[key].presentations.push({
						type: item.options.presentation,
						quantity: item.options.quantity || 1,
						label:
							presentationLabels[
								item.options.presentation as keyof typeof presentationLabels
							],
						cartId: item.cartId.toString(),
					});
				}

				return acc;
			},
			{} as Record<
				string,
				{
					product: CartItem;
					presentations: Array<{
						type: string;
						quantity: number;
						label: string;
						cartId: string;
					}>;
				}
			>,
		);

		return Object.values(grouped);
	}, [cartItems]);

	const grandTotal = useMemo(() => {
		const total = cartItems.reduce(
			(sum, item) => sum + calculateItemTotal(item),
			0,
		);
		return `$${total.toFixed(2)}`;
	}, [cartItems]);

	return { groupedItems, grandTotal, calculateItemTotal };
}

export function PurchaseFormModal({
	cartItems,
	isOpen,
	onClose,
	onRemoveItem,
}: PurchaseFormModalProps) {
	const { user } = useAuth();
	const [customerData, setCustomerData] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
	});
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { groupedItems, grandTotal, calculateItemTotal } =
		useCartCalculations(cartItems);

	// Autocompletar con datos del user
	useEffect(() => {
		if (user) {
			setCustomerData((prev) => ({
				...prev,
				name: user.name || "",
				email: user.email || "",
				phone: user.phone || "",
				address: user.address || "",
			}));
		}
	}, [user]);

	const resetForm = () => {
		setCustomerData({
			name: user?.name || "",
			email: user?.email || "",
			phone: user?.phone || "",
			address: user?.address || "",
		});
		onClose();
	};

	const isFormValid = () => {
		if (!user) return false;
		return Boolean(customerData.phone && customerData.address);
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			toast({
				title: "¡Pedido realizado!",
				description: "Te contactaremos pronto para confirmar tu pedido.",
				duration: 5000,
			});
			resetForm();
		} catch (error) {
			console.error("Error al enviar pedido:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePurchaseClick = () => {
		if (!user) {
			setAuthModalOpen(true);
			return;
		}
		handleSubmit();
	};

	if (cartItems.length === 0) {
		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Carrito Vacío</DialogTitle>
					</DialogHeader>
					<div className="text-center py-8">
						<p className="text-muted-foreground">
							No tienes productos en tu carrito.
						</p>
						<p className="text-sm text-muted-foreground mt-2">
							Agrega algunos productos para continuar con tu compra.
						</p>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Resumen de Compra</DialogTitle>
					</DialogHeader>

					<div className="space-y-6">
						{groupedItems.map((group, groupIndex) => (
							<div key={`group-${groupIndex}`} className="space-y-3">
								<div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
									<img
										src={group.product.image || "/placeholder.svg"}
										alt={group.product.name}
										className="w-20 h-20 object-cover rounded"
									/>
									<div className="flex-1">
										<h4 className="font-semibold text-lg">
											{group.product.name}
										</h4>
										<p className="text-sm text-muted-foreground">
											{group.product.price} base
										</p>
										<p className="text-sm text-muted-foreground">
											{
												grindLabels[
													group.product.options
														.grind as keyof typeof grindLabels
												]
											}
										</p>
									</div>
									<div className="text-right">
										<p className="font-semibold text-accent">
											${calculateItemTotal(group.product).toFixed(2)}
										</p>
									</div>
								</div>

								<div className="space-y-2 px-4">
									{group.presentations.map((presentation, presIndex) => (
										<div
											key={`pres-${presIndex}`}
											className="flex items-center justify-between p-3 bg-background border rounded"
										>
											<div className="flex items-center gap-3">
												<Package className="h-4 w-4 text-accent" />
												<span className="font-medium">
													{presentation.label}
												</span>
												<span className="text-sm text-muted-foreground">
													x{presentation.quantity}
												</span>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onRemoveItem(presentation.cartId)}
												className="text-destructive hover:text-destructive hover:bg-destructive/10"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>

								{groupIndex < groupedItems.length - 1 && <Separator />}
							</div>
						))}

						<Separator />

						{user ? (
							<div className="space-y-4">
								<div className="flex items-center gap-2 p-4 bg-accent/10 rounded-lg">
									<User className="h-5 w-5 text-accent" />
									<div>
										<p className="font-medium">Comprando como:</p>
										<p className="text-sm text-muted-foreground">
											{user.name} ({user.email})
										</p>
									</div>
								</div>

								<div className="space-y-3">
									<div>
										<Label htmlFor="phone">Teléfono</Label>
										<Input
											id="phone"
											type="tel"
											autoComplete="tel"
											required
											value={customerData.phone}
											onChange={(e) =>
												setCustomerData((prev) => ({
													...prev,
													phone: e.target.value,
												}))
											}
											placeholder="+54 9 11 1234-5678"
										/>
									</div>

									<div>
										<Label htmlFor="address">Dirección de entrega</Label>
										<Textarea
											id="address"
											autoComplete="street-address"
											required
											value={customerData.address}
											onChange={(e) =>
												setCustomerData((prev) => ({
													...prev,
													address: e.target.value,
												}))
											}
											placeholder="Ej: Av. Siempre Viva 123, Piso 4, Depto B"
											rows={3}
										/>
									</div>
								</div>
							</div>
						) : (
							<div className="space-y-4">
								<div className="text-center p-6 bg-muted rounded-lg">
									<User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
									<h4 className="font-semibold text-lg mb-2">
										Inicia sesión para continuar
									</h4>
									<p className="text-sm text-muted-foreground mb-4">
										Necesitas una cuenta para realizar tu compra y recibir
										actualizaciones sobre tu pedido.
									</p>
								</div>
							</div>
						)}

						<Button
							className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
							disabled={isSubmitting}
							onClick={handlePurchaseClick}
						>
							{isSubmitting
								? "Procesando..."
								: user
									? `Confirmar Pedido - ${grandTotal}`
									: "Iniciar Sesión para Comprar"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<AuthModal
				isOpen={authModalOpen}
				onClose={() => setAuthModalOpen(false)}
				initialMode="login"
			/>
		</>
	);
}
