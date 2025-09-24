"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialMode?: "login" | "register";
}

interface NominatimResult {
	place_id: number;
	display_name: string;
}

// ---------------------- HOOK DE FORM ----------------------
const useAuthForm = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
		phone: "",
		address: "",
	});

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const resetForm = () => {
		setFormData({
			email: "",
			password: "",
			firstName: "",
			lastName: "",
			phone: "",
			address: "",
		});
	};

	return { formData, updateField, resetForm };
};

// ---------------------- VALIDACIÓN DE CAMPOS ----------------------
const validateField = (field: string, value: string) => {
	if (!value) return ""; // <- no validamos si está vacío

	switch (field) {
		case "email":
			if (!value) return "El email es obligatorio";
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email inválido";
			break;

		case "password":
			if (!value) return "La contraseña es obligatoria";
			if (value.length < 6) return "Debe tener al menos 6 caracteres";
			break;

		case "firstName":
			if (!value) return "El nombre es obligatorio";
			break;

		case "lastName":
			if (!value) return "El apellido es obligatorio";
			break;

		case "phone":
			if (!value) return "El teléfono es obligatorio";
			if (!/^\d+$/.test(value)) return "Sólo números";
			break;

		case "address":
			if (!value) return "La dirección es obligatoria";
			break;
	}
	return "";
};

// ---------------------- AUTOCOMPLETE DIRECCIONES ----------------------
async function fetchAddressSuggestions(query: string) {
	if (!query || query.length < 3) return [];
	const res = await fetch(
		`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
			query,
		)}&format=json&addressdetails=1&limit=5`,
	);
	const data: NominatimResult[] = await res.json();
	return data;
}

// ---------------------- COMPONENTE ----------------------
export function AuthModal({
	isOpen,
	onClose,
	initialMode = "login",
}: AuthModalProps) {
	const [mode, setMode] = useState<"login" | "register">(initialMode);
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const { formData, updateField, resetForm } = useAuthForm();
	const { login, register, isLoading } = useAuth();

	const isFormValid = () => {
		// Campos requeridos según modo
		const requiredFields =
			mode === "login"
				? ["email", "password"]
				: ["email", "password", "firstName", "lastName", "phone", "address"];

		// Todos completos y sin errores
		return requiredFields.every(
			(field) =>
				formData[field as keyof typeof formData] &&
				!validateField(field, formData[field as keyof typeof formData]),
		);
	};

	// Sugerencias de direcciones
	const [addressSuggestions, setAddressSuggestions] = useState<
		NominatimResult[]
	>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			if (formData.address.length >= 3) {
				fetchAddressSuggestions(formData.address).then(setAddressSuggestions);
			}
		}, 400);
		return () => clearTimeout(delayDebounce);
	}, [formData.address]);

	const handleBlur = (field: string, value: string) => {
		const errorMsg = validateField(field, value);
		setFormErrors((prev) => ({ ...prev, [field]: errorMsg }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validar todos los campos antes de enviar
		const newErrors: Record<string, string> = {};
		Object.entries(formData).forEach(([key, value]) => {
			const msg = validateField(key, value);
			if (msg) newErrors[key] = msg;
		});

		if (Object.keys(newErrors).length > 0) {
			setFormErrors(newErrors);
			return;
		}

		try {
			let success = false;
			if (mode === "login") {
				success = await login(formData.email, formData.password);
			} else {
				success = await register(
					formData.email,
					formData.password,
					formData.firstName,
					formData.lastName,
					formData.phone,
					formData.address,
				);
			}

			if (success) {
				onClose();
				resetForm();
				setFormErrors({});
			} else {
				setFormErrors({
					general: "Error en la autenticación. Intenta nuevamente.",
				});
			}
		} catch (err) {
			setFormErrors({ general: "Error inesperado. Intenta nuevamente." });
		}
	};

	const toggleMode = () => {
		setMode(mode === "login" ? "register" : "login");
		setFormErrors({});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center">
						{mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{mode === "register" && (
						<>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="firstName">Nombre</Label>
									<Input
										id="firstName"
										type="text"
										value={formData.firstName}
										onChange={(e) => updateField("firstName", e.target.value)}
										onBlur={() => handleBlur("firstName", formData.firstName)}
										placeholder="Nombre"
										disabled={isLoading}
									/>
									{formErrors.firstName && (
										<p className="text-xs text-red-500">
											{formErrors.firstName}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="lastName">Apellido</Label>
									<Input
										id="lastName"
										type="text"
										value={formData.lastName}
										onChange={(e) => updateField("lastName", e.target.value)}
										onBlur={() => handleBlur("lastName", formData.lastName)}
										placeholder="Apellido"
										disabled={isLoading}
									/>
									{formErrors.lastName && (
										<p className="text-xs text-red-500">
											{formErrors.lastName}
										</p>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phone">Teléfono</Label>
								<Input
									id="phone"
									type="tel"
									value={formData.phone}
									onChange={(e) => updateField("phone", e.target.value)}
									onBlur={() => handleBlur("phone", formData.phone)}
									placeholder="Número de teléfono"
									disabled={isLoading}
								/>
								{formErrors.phone && (
									<p className="text-xs text-red-500">{formErrors.phone}</p>
								)}
							</div>

							<div className="space-y-2 relative">
								<Label htmlFor="address">Dirección</Label>
								<Input
									id="address"
									type="text"
									value={formData.address}
									onChange={(e) => {
										updateField("address", e.target.value);
										setShowSuggestions(true);
									}}
									onBlur={() => handleBlur("address", formData.address)}
									placeholder="Dirección completa"
									disabled={isLoading}
								/>
								{formErrors.address && (
									<p className="text-xs text-red-500">{formErrors.address}</p>
								)}
								{showSuggestions && addressSuggestions.length > 0 && (
									<ul className="absolute z-10 bg-white border rounded-md shadow-md w-full mt-1 max-h-40 overflow-auto">
										{addressSuggestions.map((suggestion) => (
											<li
												key={suggestion.place_id}
												tabIndex={0}
												className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
												onClick={() => {
													updateField("address", suggestion.display_name);
													setShowSuggestions(false);
												}}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														updateField("address", suggestion.display_name);
														setShowSuggestions(false);
													}
												}}
											>
												{suggestion.display_name}
											</li>
										))}
									</ul>
								)}
							</div>
						</>
					)}

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={formData.email}
							onChange={(e) => updateField("email", e.target.value)}
							onBlur={() => handleBlur("email", formData.email)}
							placeholder="tu@email.com"
							disabled={isLoading}
						/>
						{formErrors.email && (
							<p className="text-xs text-red-500">{formErrors.email}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Contraseña</Label>
						<Input
							id="password"
							type="password"
							value={formData.password}
							onChange={(e) => updateField("password", e.target.value)}
							onBlur={() => handleBlur("password", formData.password)}
							placeholder="••••••••"
							disabled={isLoading}
						/>
						{formErrors.password && (
							<p className="text-xs text-red-500">{formErrors.password}</p>
						)}
					</div>

					{formErrors.general && (
						<div className="text-sm text-destructive text-center">
							{formErrors.general}
						</div>
					)}

					<Button
						type="submit"
						className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
						disabled={isLoading || !isFormValid()}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{mode === "login" ? "Iniciando..." : "Creando..."}
							</>
						) : mode === "login" ? (
							"Iniciar Sesión"
						) : (
							"Crear Cuenta"
						)}
					</Button>

					<div className="text-center text-sm">
						<span className="text-muted-foreground">
							{mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
						</span>{" "}
						<button
							type="button"
							onClick={toggleMode}
							className="text-accent hover:underline font-medium"
							disabled={isLoading}
						>
							{mode === "login" ? "Crear cuenta" : "Iniciar sesión"}
						</button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
