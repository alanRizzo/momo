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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { ApiClient } from "@/lib/api-client";
import {
	useAddressSuggestions,
	type NominatimResult,
} from "@/hooks/use-address-search";

export interface Address {
	street: string;
	city: string;
	state: string;
	postal_code: string;
	country: string;
	is_default: boolean;
}

export function UserInfoModal() {
	const { user, setUser } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		first_name: user?.first_name || "",
		last_name: user?.last_name || "",
		phone: user?.phone || "",
		addresses: (user?.addresses as Address[]) || [],
	});

	const [addressInputs, setAddressInputs] = useState<string[]>(
		formData.addresses.map((addr) => addr.street || ""),
	);

	const {
		suggestions,
		loading: suggestionsLoading,
		clearSuggestions,
	} = useAddressSuggestions(addressInputs.join(" "), {
		countryCodes: "ar",
		limit: 5,
		debounceMs: 400,
	});

	useEffect(() => {
		if (user) {
			const addresses = (user.addresses as Address[]) || [];
			setFormData({
				first_name: user.first_name,
				last_name: user.last_name,
				phone: user.phone,
				addresses,
			});
			setAddressInputs(
				(user.addresses as Address[]).map((addr) => addr.street || ""),
			);
		}
	}, [user]);

	useEffect(() => {
		const openModal = () => setIsOpen(true);
		window.addEventListener("openUserInfo", openModal);
		return () => window.removeEventListener("openUserInfo", openModal);
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleAddressChange = (
		index: number,
		field: keyof Address,
		value: string | boolean,
	) => {
		const updated = [...formData.addresses];
		updated[index] = { ...updated[index], [field]: value };
		setFormData({ ...formData, addresses: updated });
	};

	const handleAddressInputChange = (index: number, value: string) => {
		const inputs = [...addressInputs];
		inputs[index] = value;
		setAddressInputs(inputs);
		handleAddressChange(index, "street", value);
	};

	const addAddress = () => {
		setFormData({
			...formData,
			addresses: [
				...formData.addresses,
				{
					street: "",
					city: "",
					state: "",
					postal_code: "",
					country: "Argentina",
					is_default: false,
				},
			],
		});
		setAddressInputs([...addressInputs, ""]);
	};

	const removeAddress = (index: number) => {
		const updated = [...formData.addresses];
		updated.splice(index, 1);
		setFormData({ ...formData, addresses: updated });

		const updatedInputs = [...addressInputs];
		updatedInputs.splice(index, 1);
		setAddressInputs(updatedInputs);
	};

	const setDefaultAddress = (index: number) => {
		const updated = formData.addresses.map((addr, i) => ({
			...addr,
			is_default: i === index,
		}));
		setFormData({ ...formData, addresses: updated });
	};

	const applySuggestion = (index: number, suggestion: NominatimResult) => {
		handleAddressChange(index, "street", suggestion.address.road || "");
		handleAddressChange(index, "city", suggestion.address.city || "");
		handleAddressChange(index, "state", suggestion.address.state || "");
		handleAddressChange(
			index,
			"postal_code",
			suggestion.address.postcode || "",
		);
		handleAddressChange(
			index,
			"country",
			suggestion.address.country || "Argentina",
		);

		const inputs = [...addressInputs];
		inputs[index] = suggestion.display_name;
		setAddressInputs(inputs);

		clearSuggestions();
	};

	const handleSave = async () => {
		if (!user) return;
		setLoading(true);
		try {
			const updatedUser = await ApiClient.patch("/users/me", formData);
			setUser(updatedUser);
			setIsOpen(false);
		} catch (err) {
			console.error("Error actualizando usuario:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar Información</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{/* Datos básicos */}
					<div>
						<Label>Nombre</Label>
						<Input
							name="first_name"
							value={formData.first_name}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label>Apellido</Label>
						<Input
							name="last_name"
							value={formData.last_name}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label>Teléfono</Label>
						<Input
							name="phone"
							value={formData.phone}
							onChange={handleChange}
						/>
					</div>

					{/* Direcciones */}
					<div>
						<Label>Direcciones</Label>
						{formData.addresses.map((addr, i) => (
							<div
								key={i}
								className="border p-2 rounded mt-2 space-y-2 relative"
							>
								<Input
									placeholder="Calle"
									value={addressInputs[i]}
									onChange={(e) => handleAddressInputChange(i, e.target.value)}
								/>

								{/* Sugerencias */}
								{suggestionsLoading && <p>Buscando...</p>}
								{suggestions.length > 0 && (
									<ul className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-y-auto w-full">
										{suggestions.map((sug, idx) => (
											<li
												key={idx}
												className="p-2 cursor-pointer hover:bg-gray-100"
												onClick={() => applySuggestion(i, sug)}
											>
												{sug.display_name}
											</li>
										))}
									</ul>
								)}

								<Input
									placeholder="Ciudad"
									value={addr.city}
									onChange={(e) =>
										handleAddressChange(i, "city", e.target.value)
									}
								/>
								<Input
									placeholder="Provincia/Estado"
									value={addr.state}
									onChange={(e) =>
										handleAddressChange(i, "state", e.target.value)
									}
								/>
								<Input
									placeholder="Código Postal"
									value={addr.postal_code}
									onChange={(e) =>
										handleAddressChange(i, "postal_code", e.target.value)
									}
								/>

								<div className="flex items-center justify-between mt-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => removeAddress(i)}
									>
										Eliminar
									</Button>
									<Button
										type="button"
										variant={addr.is_default ? "default" : "outline"}
										onClick={() => setDefaultAddress(i)}
									>
										{addr.is_default
											? "Dirección Principal"
											: "Usar como principal"}
									</Button>
								</div>
							</div>
						))}

						<Button type="button" className="mt-2" onClick={addAddress}>
							Agregar Dirección
						</Button>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setIsOpen(false)}>
						Cancelar
					</Button>
					<Button onClick={handleSave} disabled={loading}>
						{loading ? "Guardando..." : "Guardar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
