"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Minus } from "lucide-react"
import { WHOLESALE_PRESENTATIONS } from "@/constants/products"
import type { WholesaleQuantities } from "@/types/product"

interface WholesaleQuantitySelectorProps {
  quantities: WholesaleQuantities
  onQuantityChange: (size: keyof WholesaleQuantities, increment: boolean) => void
  basePrice: string
}

export function WholesaleQuantitySelector({ quantities, onQuantityChange, basePrice }: WholesaleQuantitySelectorProps) {
  const calculatePrice = (basePrice: string, sizeMultiplier: number) => {
    const price = Number.parseFloat(basePrice.replace("$", ""))
    return `$${(price * sizeMultiplier).toFixed(2)}`
  }

  return (
    <div>
      <Label className="text-sm mb-3 block">Cantidades por Presentación</Label>
      <div className="space-y-3">
        {WHOLESALE_PRESENTATIONS.map((option) => (
          <div key={option.value} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex flex-col">
              <span className="font-medium">{option.label}</span>
              <span className="text-sm text-muted-foreground">{calculatePrice(basePrice, option.price)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(option.value as keyof WholesaleQuantities, false)}
                disabled={quantities[option.value as keyof WholesaleQuantities] <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-16 text-center font-medium">
                {quantities[option.value as keyof WholesaleQuantities]}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(option.value as keyof WholesaleQuantities, true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
