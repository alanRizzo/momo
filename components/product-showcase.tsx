"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ProductCard } from "./product-card"
import { ProductDetailModal } from "./product-detail-modal"
import { PurchaseFormModal } from "./purchase-form-modal"
import { toast } from "@/hooks/use-toast"
import type { Product, ProductSelection } from "@/types/product"
import { PRODUCTS } from "@/constants/products"

interface CartItem extends Product {
  options: ProductSelection
  cartId: number
}

export function ProductShowcase() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const quantity = item?.options?.quantity || 0
      return sum + quantity
    }, 0)
  }, [cartItems])

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { count: cartTotal },
      }),
    )
  }, [cartTotal])

  const handleImageClick = useCallback((product: Product) => {
    setSelectedProduct(product)
    setShowDetailModal(true)
  }, [])

  const handleAddToCart = useCallback((product: Product, options: ProductSelection) => {
    const safeOptions = {
      grind: options?.grind || "molido",
      presentation: options?.presentation || "250g",
      quantity: options?.quantity || 1,
      isWholesale: options?.isWholesale || false,
      wholesaleQuantity: options?.wholesaleQuantity || 1,
    }

    const newItem: CartItem = {
      ...product,
      options: safeOptions,
      cartId: Date.now() + Math.random(), // Ensure unique ID
    }

    setCartItems((prev) => [...prev, newItem])

    toast({
      title: "¡Producto agregado!",
      description: `${product.name} se agregó exitosamente al carrito.`,
      duration: 3000,
    })
  }, [])

  const handleRemoveFromCart = useCallback((cartId: number) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId))

    toast({
      title: "Producto removido",
      description: "El producto fue removido del carrito.",
      duration: 2000,
    })
  }, [])

  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false)
    setSelectedProduct(null)
  }, [])

  const handleClosePurchaseForm = useCallback(() => {
    setShowPurchaseForm(false)
  }, [])

  useEffect(() => {
    const handleOpenPurchaseForm = () => setShowPurchaseForm(true)
    window.addEventListener("openPurchaseForm", handleOpenPurchaseForm)
    return () => window.removeEventListener("openPurchaseForm", handleOpenPurchaseForm)
  }, [])

  return (
    <section id="productos" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Nuestros Cafés Selectos</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Cada grano es cuidadosamente seleccionado y tostado para ofrecerte una experiencia única en cada taza.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onImageClick={handleImageClick}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        onAddToCart={handleAddToCart}
      />

      <PurchaseFormModal
        cartItems={cartItems}
        isOpen={showPurchaseForm}
        onClose={handleClosePurchaseForm}
        onRemoveItem={handleRemoveFromCart}
      />
    </section>
  )
}
