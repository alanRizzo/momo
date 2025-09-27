import { useState, useEffect } from "react";

export interface AddressType {
	street: string;
	city: string;
	state: string;
	postal_code: string;
	country: string;
	is_default: boolean;
}

export interface NominatimResult {
	place_id: number;
	display_name: string;
	address: {
		road?: string;
		house_number?: string;
		city?: string;
		town?: string;
		village?: string;
		state?: string;
		postcode?: string;
		country?: string;
	};
}

export function useAddressSuggestions(
	query: string,
	options?: { countryCodes?: string; limit?: number; debounceMs?: number },
) {
	const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
	const [loading, setLoading] = useState(false);

	const clearSuggestions = () => setSuggestions([]);

	useEffect(() => {
		if (!query || query.length < 3) return;

		const controller = new AbortController();
		const fetchSuggestions = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
						query,
					)}&format=json&addressdetails=1&limit=5&countrycodes=ar`,
					{ signal: controller.signal },
				);
				const data: NominatimResult[] = await res.json();
				setSuggestions(data);
			} catch (err) {
				if (!(err instanceof DOMException && err.name === "AbortError")) {
					console.error("Error fetching suggestions", err);
				}
			} finally {
				setLoading(false);
			}
		};

		const debounce = setTimeout(fetchSuggestions, 400);
		return () => {
			controller.abort();
			clearTimeout(debounce);
		};
	}, [query]);

	return { suggestions, loading, clearSuggestions };
}

export function mapNominatimToAddress(n: NominatimResult): AddressType {
	return {
		street: [n.address.road, n.address.house_number].filter(Boolean).join(" "),
		city: n.address.city || n.address.town || n.address.village || "",
		state: n.address.state || "",
		postal_code: n.address.postcode || "",
		country: n.address.country || "Argentina",
		is_default: false,
	};
}
