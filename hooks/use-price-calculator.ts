"use client"
import { PRESENTATION_OPTIONS } from "@/constants/products"
import type { WholesaleQuantities } from "@/types/product"

export function usePriceCalculator(basePrice: number) {
  const calculatePrice = (sizeMultiplier: number, quantity = 1) => {
    return basePrice * sizeMultiplier * quantity
  }

  const calculateWholesaleTotal = (quantities: WholesaleQuantities) => {
    const quarterTotal = basePrice * 1 * quantities.quarter
    const fullTotal = basePrice * 3.5 * quantities.full
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

    return basePrice
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  return {
    calculatePrice,
    calculateWholesaleTotal,
    getDisplayPrice,
    formatPrice,
  }
}
