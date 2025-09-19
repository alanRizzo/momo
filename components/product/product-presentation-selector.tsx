"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PRESENTATION_OPTIONS } from "@/constants/products"

interface ProductPresentationSelectorProps {
  productId: string | number
  value: string
  onChange: (value: string) => void
}

export function ProductPresentationSelector({ productId, value, onChange }: ProductPresentationSelectorProps) {
  return (
    <div>
      <Label className="text-sm mb-3 block">Presentación</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex flex-row gap-4">
        {PRESENTATION_OPTIONS.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`size-${productId}-${option.value}`}
              className="border-2 border-foreground data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
            />
            <Label
              htmlFor={`size-${productId}-${option.value}`}
              className="text-sm cursor-pointer font-medium text-foreground"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
