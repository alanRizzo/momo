"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, ShoppingCart } from "lucide-react"

interface Product {
  id: number
  name: string
  image: string
  badge?: string
  rating: number
  description: string
  price: string
  originalPrice?: string
  region: string
  varietal: string
  altitude: string
  notes: string
  process: string
}

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Product) => void
  onBuyNow: (product: Product) => void
}

export function ProductDetailModal({ product, isOpen, onClose, onAddToCart, onBuyNow }: ProductDetailModalProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "text-accent fill-current" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.rating})</span>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Descripción:</h4>
              <p className="text-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Región:</h4>
                <p className="text-sm text-muted-foreground">{product.region}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm">Varietal:</h4>
                <p className="text-sm text-muted-foreground">{product.varietal}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm">Altura:</h4>
                <p className="text-sm text-muted-foreground">{product.altitude}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm">Notas de Cata:</h4>
                <p className="text-sm text-muted-foreground">{product.notes}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm">Proceso:</h4>
                <p className="text-sm text-muted-foreground">{product.process}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={() => onAddToCart(product)} variant="outline" className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar al Carrito
              </Button>
              <Button onClick={() => onBuyNow(product)} className="flex-1">
                Comprar Ahora
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
