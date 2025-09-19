export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category?: string
}

export interface ProductSelection {
  productId: string
  presentation: "quarter" | "half" | "full"
  grind: "whole" | "coarse" | "medium" | "fine" | "espresso" | "nespresso"
  quantity: number
  quarterQuantity?: number
  fullQuantity?: number
}

export interface WholesaleQuantities {
  quarter: number
  full: number
}
