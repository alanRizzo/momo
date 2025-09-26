"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import { useProductSelection } from "@/hooks/use-product-selection"
import { usePriceCalculator } from "@/hooks/use-price-calculator"
import { ProductGrindSelector } from "@/components/product/product-grind-selector"
import { ProductPresentationSelector } from "@/components/product/product-presentation-selector"
import { WholesaleQuantitySelector } from "@/components/product/wholesale-quantity-selector"
import { ProductPriceDisplay } from "@/components/product/product-price-display"
import type { Product, ProductSelection } from "@/types/product"

interface ProductCardProps {
  product: Product
  onImageClick: (product: Product) => void
  onAddToCart: (product: Product, options: ProductSelection) => void
}

export const ProductCard = memo(function ProductCard({ product, onImageClick, onAddToCart }: ProductCardProps) {
  const {
    isWholesale,
    selectedGrind,
    setSelectedGrind,
    selectedPresentation,
    setSelectedPresentation,
    wholesaleQuantities,
    handleQuantityChange,
    isSelectionValid,
  } = useProductSelection()

  const basePrice = product.price || 25000 // precio por defecto
  const { formatPrice } = usePriceCalculator(basePrice)

  const handleAddToCart = () => {
    if (!isSelectionValid()) return

    if (isWholesale) {
      if (wholesaleQuantities.quarter > 0 || wholesaleQuantities.full > 0) {
        onAddToCart(product, {
          productId: product.id,
          presentation: "quarter", // Default for wholesale
          grind: selectedGrind,
          quantity: 1,
          quarterQuantity: wholesaleQuantities.quarter,
          fullQuantity: wholesaleQuantities.full,
        })
      }
    } else {
      onAddToCart(product, {
        productId: product.id,
        presentation: selectedPresentation as "quarter" | "half" | "full",
        grind: selectedGrind,
        quantity: 1,
      })
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => onImageClick(product)}
            loading="lazy"
          />
          {product.badge && (
            <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">{product.badge}</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  product.rating
                    ? i < Math.floor(product.rating)
                      ? "text-accent fill-current"
                      : "text-muted-foreground"
                    : i < 4
                      ? "text-accent fill-current"
                      : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({product.rating ? product.rating.toFixed(1) : "4.8"})</span>
        </div>

        <CardTitle className="text-xl mb-3 text-balance">{product.name}</CardTitle>
        <p className="text-muted-foreground text-sm mb-4 text-pretty flex-grow min-h-[3rem] leading-relaxed">
          {product.description}
        </p>

        <ProductPriceDisplay
          basePrice={formatPrice(basePrice)}
          isWholesale={isWholesale}
          selectedSize={selectedPresentation}
          wholesaleQuantities={wholesaleQuantities}
        />

        <div className="space-y-4 mt-auto">
          <ProductGrindSelector productId={product.id} value={selectedGrind} onChange={setSelectedGrind} />

          {isWholesale ? (
            <WholesaleQuantitySelector
              quantities={wholesaleQuantities}
              onQuantityChange={handleQuantityChange}
              basePrice={formatPrice(basePrice)}
            />
          ) : (
            <ProductPresentationSelector
              productId={product.id}
              value={selectedPresentation}
              onChange={setSelectedPresentation}
            />
          )}
        </div>
      </CardContent>

      <div className="p-6 pt-0">
        <Button
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={handleAddToCart}
          disabled={!isSelectionValid()}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isWholesale ? "Agregar Pedido" : "Agregar al Carrito"}
        </Button>
      </div>
    </Card>
  )
})
