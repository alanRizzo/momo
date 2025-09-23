"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { WholesaleQuantities } from "@/types/product"

export function useProductSelection() {
  const { user } = useAuth()
  const isWholesale = user?.userType === "wholesale"

  const [selectedGrind, setSelectedGrind] = useState("nespresso")
  const [selectedPresentation, setSelectedPresentation] = useState("quarter")
  const [wholesaleQuantities, setWholesaleQuantities] = useState<WholesaleQuantities>({
    quarter: 0,
    full: 0,
  })

  // Reset selections when user type changes
  useEffect(() => {
    if (user) {
      setSelectedGrind(user.userType === "wholesale" ? "whole" : "nespresso")
      if (user.userType === "wholesale") {
        setWholesaleQuantities({ quarter: 0, full: 0 })
      }
    } else {
      // Reset to default values when user logs out
      setSelectedGrind("nespresso")
      setSelectedPresentation("quarter")
      setWholesaleQuantities({ quarter: 0, full: 0 })
    }
  }, [user])

  const handleQuantityChange = (size: keyof WholesaleQuantities, increment: boolean) => {
    setWholesaleQuantities((prev) => ({
      ...prev,
      [size]: Math.max(0, prev[size] + (increment ? 1 : -1)),
    }))
  }

  const isSelectionValid = () => {
    if (!selectedGrind) return false
    if (!isWholesale && !selectedPresentation) return false
    if (isWholesale && wholesaleQuantities.quarter === 0 && wholesaleQuantities.full === 0) return false
    return true
  }

  return {
    isWholesale,
    selectedGrind,
    setSelectedGrind,
    selectedPresentation,
    setSelectedPresentation,
    wholesaleQuantities,
    handleQuantityChange,
    isSelectionValid,
  }
}
