"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { ProductModalProps } from "@/types/product"

export function ProductDetailModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">{product.badge}</Badge>
              )}
            </div>

            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating!) ? "text-accent fill-current" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.rating.toFixed(1)})</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Descripción:</h4>
              <p className="text-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-3">
              {product.region && (
                <div>
                  <h4 className="font-semibold text-sm">Región:</h4>
                  <p className="text-sm text-muted-foreground">{product.region}</p>
                </div>
              )}

              {product.varietal && (
                <div>
                  <h4 className="font-semibold text-sm">Varietal:</h4>
                  <p className="text-sm text-muted-foreground">{product.varietal}</p>
                </div>
              )}

              {product.altitude && (
                <div>
                  <h4 className="font-semibold text-sm">Altura:</h4>
                  <p className="text-sm text-muted-foreground">{product.altitude}</p>
                </div>
              )}

              {product.notes && (
                <div>
                  <h4 className="font-semibold text-sm">Notas de Cata:</h4>
                  <p className="text-sm text-muted-foreground">{product.notes}</p>
                </div>
              )}

              {product.process && (
                <div>
                  <h4 className="font-semibold text-sm">Proceso:</h4>
                  <p className="text-sm text-muted-foreground">{product.process}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
