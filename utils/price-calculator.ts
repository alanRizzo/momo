import { PRESENTATION_MULTIPLIERS, IVA_RATE } from "@/constants/labels"
import type { Product, ProductSelection } from "@/types/product"

export interface CartItem extends Product {
  options: ProductSelection
  cartId: number
}

export function calculateItemTotal(item: CartItem): number {
  let basePrice: number

  if (typeof item.price === "string") {
    basePrice = Number.parseFloat(item.price.replace("$", "").replace(",", ""))
  } else if (typeof item.price === "number") {
    basePrice = item.price
  } else {
    // Precio por defecto si no está definido
    basePrice = 12000
  }

  // Validar que el precio sea un número válido
  if (isNaN(basePrice) || basePrice <= 0) {
    basePrice = 12000
  }

  // Para usuarios mayoristas con cantidades específicas
  if (item.options.quarterQuantity !== undefined || item.options.fullQuantity !== undefined) {
    const quarterTotal = basePrice * 1 * (item.options.quarterQuantity || 0)
    const fullTotal = basePrice * 3.5 * (item.options.fullQuantity || 0)
    return quarterTotal + fullTotal
  }

  // Para usuarios regulares
  const multiplier = PRESENTATION_MULTIPLIERS[item.options.presentation] || 1
  const quantity = item.options.quantity || 1
  return basePrice * multiplier * quantity
}

export function calculateCartTotals(cartItems: CartItem[]) {
  const subtotal = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0)
  const ivaAmount = subtotal * IVA_RATE
  const total = subtotal + ivaAmount

  return {
    subtotal: Number(subtotal.toFixed(2)),
    ivaAmount: Number(ivaAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
    formattedSubtotal: subtotal.toFixed(2),
    formattedIvaAmount: ivaAmount.toFixed(2),
    formattedTotal: total.toFixed(2),
  }
}
