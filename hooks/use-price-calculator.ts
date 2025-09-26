"use client"
import { PRESENTATION_OPTIONS } from "@/constants/products"
import type { WholesaleQuantities } from "@/types/product"

export function usePriceCalculator(basePrice: number) {
  const normalizedPrice = typeof basePrice === "number" && !isNaN(basePrice) && basePrice > 0 ? basePrice : 12000

  const calculatePrice = (sizeMultiplier: number, quantity = 1) => {
    return normalizedPrice * sizeMultiplier * quantity
  }

  const calculateWholesaleTotal = (quantities: WholesaleQuantities) => {
    const quarterTotal = normalizedPrice * 1 * quantities.quarter
    const fullTotal = normalizedPrice * 3.5 * quantities.full
    return quarterTotal + fullTotal
  }

  const getDisplayPrice = (isWholesale: boolean, selectedSize?: string, wholesaleQuantities?: WholesaleQuantities) => {
    if (isWholesale && wholesaleQuantities) {
      return calculateWholesaleTotal(wholesaleQuantities)
    }

    if (selectedSize) {
      const sizeOption = PRESENTATION_OPTIONS.find((s) => s.value === selectedSize)
      return calculatePrice(sizeOption?.price || 1)
    }

    return normalizedPrice
  }

  const formatPrice = (price: number) =>
    `$${price.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  return {
    calculatePrice,
    calculateWholesaleTotal,
    getDisplayPrice,
    formatPrice,
  }
}
