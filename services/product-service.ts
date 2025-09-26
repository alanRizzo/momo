import { apiClient } from "@/lib/api-client"
import type { Product } from "@/types/product"

interface BackendProduct {
  id: number
  name: string
  image: string
  badge?: string
  rating?: number
  description: string
  region?: string
  varietal?: string
  altitude?: string
  notes?: string
  process?: string
}

export class ProductService {
  private static mapBackendProduct(backendProduct: BackendProduct): Product {
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
    }
  }

  static async getProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<BackendProduct[]>("/products")
      return response.data.map(this.mapBackendProduct)
    } catch (error) {
      console.error("Error fetching products:", error)
      // Fallback a productos mock si el backend no está disponible
      const { PRODUCTS } = await import("@/constants/products")
      return PRODUCTS
    }
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<BackendProduct>(`/products/${id}`)
      return this.mapBackendProduct(response.data)
    } catch (error) {
      console.error("Error fetching product:", error)
      // Fallback a productos mock
      const { PRODUCTS } = await import("@/constants/products")
      return PRODUCTS.find((p) => p.id === id) || null
    }
  }
}
