"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GRIND_OPTIONS } from "@/constants/products"

interface ProductGrindSelectorProps {
  productId: string | number
  value: string
  onChange: (value: string) => void
}

export function ProductGrindSelector({ productId, value, onChange }: ProductGrindSelectorProps) {
  return (
    <div>
      <Label htmlFor={`grind-${productId}`} className="text-sm">
        Molienda
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Selecciona" />
        </SelectTrigger>
        <SelectContent>
          {GRIND_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
