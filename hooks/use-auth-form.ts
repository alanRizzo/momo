"use client"

import { useState } from "react"

export interface AuthFormData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  address: string
}

export const useAuthForm = () => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  })

  const updateField = (field: keyof AuthFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
    })
  }

  return { formData, updateField, resetForm }
}
