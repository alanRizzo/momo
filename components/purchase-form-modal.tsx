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
import { Package, User, Trash2, Edit, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { AuthModal } from "@/components/auth-modal";
import { useModal } from "@/hooks/use-modal";
import { useEditableField } from "@/hooks/use-editable-field";
import { calculateCartTotals, type CartItem } from "@/utils/price-calculator";
import { getGrindLabel, getPresentationLabel } from "@/constants/labels";

interface PurchaseFormModalProps {
	cartItems: CartItem[];
	isOpen: boolean;
	onClose: () => void;
	onRemoveItem: (cartId: string) => void;
}

function useCartCalculations(cartItems: CartItem[]) {
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
						label: getPresentationLabel(item.options.presentation),
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

	const totals = useMemo(() => calculateCartTotals(cartItems), [cartItems]);
	const grandTotal = `$${totals.formattedTotal}`;

	return { groupedItems, grandTotal, totals };
}

export function PurchaseFormModal({
	cartItems,
	isOpen,
	onClose,
	onRemoveItem,
}: PurchaseFormModalProps) {
	const { user, updateUserData } = useAuth();
	const [customerData, setCustomerData] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
	});
	const authModal = useModal();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const phoneField = useEditableField(user?.phone || "");
	const addressField = useEditableField(user?.address || "");

	const { groupedItems, grandTotal, totals } = useCartCalculations(cartItems);

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			toast({
				title: "¡Pedido realizado!",
				description: "Te contactaremos pronto para confirmar tu pedido.",
				duration: 5000,
			});
			onClose();
		} catch (error) {
			console.error("Error al enviar pedido:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (user) {
			setCustomerData((prev) => ({
				...prev,
				name: user.first_name || "",
				email: user.email || "",
				phone: user.phone || "",
				address: user.address || "",
			}));
			phoneField.setTempValue(user.phone || "");
			addressField.setTempValue(user.address || "");
		}
	}, [user]);

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
											${group.product.price} base
										</p>
										<p className="text-sm text-muted-foreground">
											{getGrindLabel(group.product.options.grind)}
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

						<div className="space-y-3 p-4 bg-muted/50 rounded-lg">
							<div className="flex justify-between text-sm">
								<span>Subtotal:</span>
								<span>${totals.formattedSubtotal}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>IVA (21%):</span>
								<span>${totals.formattedIvaAmount}</span>
							</div>
							<Separator />
							<div className="flex justify-between font-semibold text-lg">
								<span>Total:</span>
								<span className="text-accent">${totals.formattedTotal}</span>
							</div>
						</div>

						{user ? (
							<div className="space-y-4">
								<div className="flex items-center gap-2 p-4 bg-accent/10 rounded-lg">
									<User className="h-5 w-5 text-accent" />
									<div>
										<p className="font-medium">Comprando como:</p>
										<p className="text-sm text-muted-foreground">
											{user.first_name} ({user.email})
										</p>
									</div>
								</div>

								<div className="space-y-3">
									<div>
										<Label htmlFor="phone">Teléfono</Label>
										<div className="flex items-center gap-2">
											{phoneField.isEditing ? (
												<>
													<Input
														id="phone"
														type="tel"
														value={phoneField.tempValue}
														onChange={(e) =>
															phoneField.setTempValue(e.target.value)
														}
														placeholder="+54 9 11 1234-5678"
														className="flex-1"
													/>
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															phoneField.confirmEdit(async (newPhone) => {
																if (user && updateUserData) {
																	await updateUserData({ phone: newPhone });
																	setCustomerData((prev) => ({
																		...prev,
																		phone: newPhone,
																	}));
																	toast({
																		title: "Teléfono actualizado",
																		description:
																			"Tu número de teléfono ha sido actualizado correctamente.",
																	});
																}
															})
														}
														className="text-green-600 hover:text-green-700"
													>
														<Check className="h-4 w-4" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														onClick={phoneField.cancelEditing}
														className="text-red-600 hover:text-red-700"
													>
														<X className="h-4 w-4" />
													</Button>
												</>
											) : (
												<>
													<Input
														id="phone"
														type="tel"
														value={customerData.phone}
														readOnly
														className="flex-1 bg-muted cursor-default"
													/>
													<Button
														size="sm"
														variant="ghost"
														onClick={phoneField.startEditing}
														className="text-muted-foreground hover:text-foreground"
													>
														<Edit className="h-4 w-4" />
													</Button>
												</>
											)}
										</div>
									</div>

									<div>
										<Label htmlFor="address">Dirección de entrega</Label>
										<div className="flex items-start gap-2">
											{addressField.isEditing ? (
												<>
													<Textarea
														id="address"
														value={addressField.tempValue}
														onChange={(e) =>
															addressField.setTempValue(e.target.value)
														}
														placeholder="Ej: Av. Siempre Viva 123, Piso 4, Depto B"
														rows={3}
														className="flex-1"
													/>
													<div className="flex flex-col gap-1 mt-1">
														<Button
															size="sm"
															variant="ghost"
															onClick={() =>
																addressField.confirmEdit(async (newAddress) => {
																	if (user && updateUserData) {
																		await updateUserData({
																			address: newAddress,
																		});
																		setCustomerData((prev) => ({
																			...prev,
																			address: newAddress,
																		}));
																		toast({
																			title: "Dirección actualizada",
																			description:
																				"Tu dirección ha sido actualizada correctamente.",
																		});
																	}
																})
															}
															className="text-green-600 hover:text-green-700"
														>
															<Check className="h-4 w-4" />
														</Button>
														<Button
															size="sm"
															variant="ghost"
															onClick={addressField.cancelEditing}
															className="text-red-600 hover:text-red-700"
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												</>
											) : (
												<>
													<Textarea
														id="address"
														value={customerData.address}
														readOnly
														rows={3}
														className="flex-1 bg-muted cursor-default resize-none"
													/>
													<Button
														size="sm"
														variant="ghost"
														onClick={addressField.startEditing}
														className="text-muted-foreground hover:text-foreground mt-1"
													>
														<Edit className="h-4 w-4" />
													</Button>
												</>
											)}
										</div>
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
							onClick={() => (user ? handleSubmit() : authModal.open())}
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
				isOpen={authModal.isOpen}
				onClose={authModal.close}
				initialMode="login"
			/>
		</>
	);
}
