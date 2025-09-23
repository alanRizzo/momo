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
      if (item?.options?.quarterQuantity !== undefined || item?.options?.fullQuantity !== undefined) {
        const quarterQty = item?.options?.quarterQuantity || 0
        const fullQty = item?.options?.fullQuantity || 0
        return sum + quarterQty + fullQty
      }
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

  const handleAddToCart = useCallback(
    (product: Product, options: ProductSelection) => {
      const safeOptions = {
        productId: options?.productId || product.id,
        grind: options?.grind || "whole",
        presentation: options?.presentation || "quarter",
        quantity: options?.quantity || 1,
        quarterQuantity: options?.quarterQuantity,
        fullQuantity: options?.fullQuantity,
      }

      // Buscar si ya existe un item con el mismo producto y molienda
      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product.id && item.options.grind === safeOptions.grind,
      )

      if (existingItemIndex !== -1) {
        // Si existe, actualizar las cantidades
        setCartItems((prev) => {
          const updated = [...prev]
          const existingItem = updated[existingItemIndex]

          if (safeOptions.quarterQuantity !== undefined || safeOptions.fullQuantity !== undefined) {
            // Para mayoristas, sumar las cantidades
            updated[existingItemIndex] = {
              ...existingItem,
              options: {
                ...existingItem.options,
                quarterQuantity: (existingItem.options.quarterQuantity || 0) + (safeOptions.quarterQuantity || 0),
                fullQuantity: (existingItem.options.fullQuantity || 0) + (safeOptions.fullQuantity || 0),
              },
            }
          } else {
            // Para usuarios regulares, sumar la cantidad
            updated[existingItemIndex] = {
              ...existingItem,
              options: {
                ...existingItem.options,
                quantity: (existingItem.options.quantity || 0) + (safeOptions.quantity || 0),
              },
            }
          }

          return updated
        })
      } else {
        // Si no existe, crear nuevo item
        const newItem: CartItem = {
          ...product,
          options: safeOptions,
          cartId: Date.now() + Math.random(),
        }
        setCartItems((prev) => [...prev, newItem])
      }

      const isMayorista = options?.quarterQuantity !== undefined || options?.fullQuantity !== undefined
      const message = isMayorista
        ? `${product.name} agregado al pedido mayorista.`
        : `${product.name} se agregó exitosamente al carrito.`

      toast({
        title: "¡Producto agregado!",
        description: message,
        duration: 3000,
      })
    },
    [cartItems],
  )

  const handleRemoveFromCart = useCallback((cartId: string | number) => {
    if (typeof cartId === "string" && cartId.includes("-")) {
      // Manejar IDs de presentación como "123-quarter" o "123-full"
      const [baseCartId, presentationType] = cartId.split("-")
      const numericCartId = Number.parseFloat(baseCartId)

      setCartItems(
        (prev) =>
          prev
            .map((item) => {
              if (Math.floor(item.cartId) === Math.floor(numericCartId)) {
                const updatedOptions = { ...item.options }

                if (presentationType === "quarter") {
                  updatedOptions.quarterQuantity = 0
                } else if (presentationType === "full") {
                  updatedOptions.fullQuantity = 0
                }

                // Si ambas cantidades son 0, remover el item completamente
                if ((updatedOptions.quarterQuantity || 0) === 0 && (updatedOptions.fullQuantity || 0) === 0) {
                  return null
                }

                return { ...item, options: updatedOptions }
              }
              return item
            })
            .filter(Boolean) as CartItem[],
      )
    } else {
      // Manejar IDs normales (usuarios regulares)
      const numericCartId = typeof cartId === "string" ? Number.parseFloat(cartId) : cartId
      setCartItems((prev) => prev.filter((item) => item.cartId !== numericCartId))
    }

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
