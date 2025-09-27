import { ApiClient } from "@/lib/api-client";
import type { Product } from "@/types/product";

interface BackendProduct {
	id: number;
	name: string;
	image: string;
	badge?: string;
	rating?: number;
	description: string;
	region?: string;
	varietal?: string;
	altitude?: string;
	notes?: string;
	process?: string;
}

function mapBackendProduct(backendProduct: BackendProduct): Product {
	return {
		id: backendProduct.id.toString(), // Convertir id numérico a string
		name: backendProduct.name,
		description: backendProduct.description,
		price: 12000, // Precio base por defecto ya que el backend no lo incluye
		image: backendProduct.image,
		badge: backendProduct.badge,
		rating: backendProduct.rating,
		region: backendProduct.region,
		varietal: backendProduct.varietal,
		altitude: backendProduct.altitude,
		notes: backendProduct.notes,
		process: backendProduct.process,
	};
}

export const ProductService = {
	async getProducts(): Promise<Product[]> {
		const backendProducts = await ApiClient.get<BackendProduct[]>("/products");
		return backendProducts.map(mapBackendProduct);
	},

	async getProductById(id: string): Promise<Product | null> {
		const backendProduct = await ApiClient.get<BackendProduct>(
			`/products/${id}`,
		);
		return mapBackendProduct(backendProduct);
	},
};
