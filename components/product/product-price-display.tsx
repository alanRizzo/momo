"use client"

import type { WholesaleQuantities } from "@/types/product"
import { PRESENTATION_OPTIONS } from "@/constants/products"

interface ProductPriceDisplayProps {
  basePrice: string
  originalPrice?: string
  isWholesale: boolean
  selectedSize?: string
  wholesaleQuantities?: WholesaleQuantities
}

export function ProductPriceDisplay({
  basePrice,
  originalPrice,
  isWholesale,
  selectedSize,
  wholesaleQuantities,
}: ProductPriceDisplayProps) {
  const calculatePrice = (basePrice: string, sizeMultiplier: number, quantity = 1) => {
    const price = Number.parseFloat(basePrice.replace("$", ""))
    return `$${(price * sizeMultiplier * quantity).toFixed(2)}`
  }

  const calculateWholesaleTotal = () => {
    if (!wholesaleQuantities) return basePrice

    const price = Number.parseFloat(basePrice.replace("$", ""))
    const quarterTotal = price * 1 * wholesaleQuantities.quarter
    const fullTotal = price * 3.5 * wholesaleQuantities.full
    return `$${(quarterTotal + fullTotal).toFixed(2)}`
  }

  const getDisplayPrice = () => {
    if (isWholesale) {
      return calculateWholesaleTotal()
    }

    if (selectedSize) {
      const sizeOption = PRESENTATION_OPTIONS.find((s) => s.value === selectedSize)
      return calculatePrice(basePrice, sizeOption?.price || 1)
    }

    return basePrice
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-2xl font-bold text-accent">{getDisplayPrice()}</span>
      {originalPrice && <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>}
    </div>
  )
}
