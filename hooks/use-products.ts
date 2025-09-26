"use client"

import { useState, useEffect } from "react"
import { ProductService } from "@/services/product-service"
import type { Product } from "@/types/product"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ProductService.getProducts()
      setProducts(data)
    } catch (err) {
      setError("Error al cargar los productos")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const refetch = async () => {
    await fetchProducts()
  }

  return { products, loading, error, refetch }
}
