export interface Product {
  id: string // cambiado de string a coincidir con backend que devuelve int pero lo manejamos como string
  name: string
  description: string
  price: number // este campo no viene del backend, lo mantenemos para compatibilidad local
  image: string
  badge?: string
  rating?: number // ahora viene como float del backend
  originalPrice?: number // campo local, no del backend
  region?: string
  varietal?: string
  altitude?: string
  notes?: string
  process?: string
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

export type ProductSummary = Pick<Product, "id" | "name" | "image" | "price">
export type ProductCardData = Product & {
  options?: ProductSelection
  cartId?: number
}

export interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export interface ProductSelectorProps {
  productId: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}
