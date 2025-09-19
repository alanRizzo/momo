import type { Product, ProductSelection } from "@/types/product"

export interface CartItem extends Product {
  options: ProductSelection
  cartId: number
}

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.options.quantity, 0)
}

export const calculateCartValue = (items: CartItem[]): number => {
  return items.reduce((sum, item) => {
    const basePrice = item.price
    let itemTotal = basePrice

    if (item.options.quarterQuantity && item.options.fullQuantity) {
      // Wholesale calculation
      itemTotal = basePrice * 1 * item.options.quarterQuantity + basePrice * 3.5 * item.options.fullQuantity
    } else {
      // Regular calculation
      const presentationMultiplier = getPresentationMultiplier(item.options.presentation)
      itemTotal = basePrice * presentationMultiplier * item.options.quantity
    }

    return sum + itemTotal
  }, 0)
}

const getPresentationMultiplier = (presentation: string): number => {
  switch (presentation) {
    case "quarter":
      return 1
    case "half":
      return 1.8
    case "full":
      return 3.5
    default:
      return 1
  }
}

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}
