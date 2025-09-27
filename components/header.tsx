"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	ShoppingCart,
	Coffee,
	User,
	LogOut,
	Settings,
	History,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { AuthModal } from "@/components/auth-modal";
import { UserInfoModal } from "./info-user-modal";
import { OrdersHistoryModal } from "./orders-history-modal";
import { OrderDetailModal } from "./order-detail-modal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
	const authContext = useAuth();
	const [cartCount, setCartCount] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [authModalOpen, setAuthModalOpen] = useState(false);

	const user = authContext.user;
	const logout = authContext.logout;

	useEffect(() => {
		const handleCartUpdate = (event: CustomEvent<{ count: number }>) => {
			setCartCount(event.detail.count);
			setIsAnimating(true);
			setTimeout(() => setIsAnimating(false), 300);
		};

		window.addEventListener("cartUpdated", handleCartUpdate as EventListener);
		return () =>
			window.removeEventListener(
				"cartUpdated",
				handleCartUpdate as EventListener,
			);
	}, []);

	const handleBuyNow = () => {
		window.dispatchEvent(new CustomEvent("openPurchaseForm"));
	};

	const openLoginModal = () => {
		setAuthModalOpen(true);
	};

	return (
		<>
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					{/* Logo */}
					<div className="flex items-center space-x-2">
						<Coffee className="h-8 w-8 text-accent" />
						<span className="text-2xl font-bold text-foreground">MOMO</span>
					</div>

					<div className="flex items-center space-x-4">
						{/* Carrito */}
						<Button
							variant="ghost"
							size="icon"
							className="relative"
							onClick={handleBuyNow}
						>
							<ShoppingCart
								className={`h-5 w-5 transition-transform duration-300 ${
									isAnimating ? "scale-110" : ""
								}`}
							/>
							{cartCount > 0 && (
								<span
									className={`absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold transition-all duration-300 ${
										isAnimating ? "scale-125 bg-accent/80" : ""
									}`}
								>
									{cartCount}
								</span>
							)}
						</Button>

						{/* Usuario */}
						{user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="flex items-center space-x-2"
									>
										<span>Hola, {user.first_name}!</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuLabel className="inline-flex items-center gap-2">
										<User className="h-4 w-4" />
										{user.first_name} {user.last_name}
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() =>
											window.dispatchEvent(new CustomEvent("openUserInfo"))
										}
									>
										<Settings className="mr-2 h-4 w-4" />
										<span>Editar información</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											window.dispatchEvent(new CustomEvent("openOrdersHistory"))
										}
									>
										<History className="mr-2 h-4 w-4" />
										<span>Historial de pedidos</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={logout}>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Cerrar sesión</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button variant="ghost" onClick={openLoginModal}>
								Iniciar Sesión
							</Button>
						)}
					</div>
				</div>
			</header>

			<AuthModal
				isOpen={authModalOpen}
				onClose={() => setAuthModalOpen(false)}
			/>
			<UserInfoModal />
			<OrdersHistoryModal />
			<OrderDetailModal />
		</>
	);
}
