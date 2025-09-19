"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

const validateForm = (mode: "login" | "register", formData: Record<string, string>) => {
  const { email, password, firstName, lastName, phone, address } = formData

  if (!email || !password) {
    return "Por favor completa todos los campos"
  }

  if (mode === "register" && (!firstName || !lastName || !phone || !address)) {
    return "Por favor completa todos los campos"
  }

  return null
}

const useAuthForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  })

  const updateField = (field: string, value: string) => {
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

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [error, setError] = useState("")
  const { formData, updateField, resetForm } = useAuthForm()
  const { login, register, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm(mode, formData)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      let success = false
      if (mode === "login") {
        success = await login(formData.email, formData.password)
      } else {
        success = await register(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName,
          formData.phone,
          formData.address,
        )
      }

      if (success) {
        onClose()
        resetForm()
      } else {
        setError("Error en la autenticación. Intenta nuevamente.")
      }
    } catch (err) {
      setError("Error inesperado. Intenta nuevamente.")
    }
  }

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login")
    setError("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="Nombre"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Apellido"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="Número de teléfono"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Dirección completa"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="tu@email.com"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-sm text-destructive text-center">{error}</div>}

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "login" ? "Iniciando..." : "Creando..."}
              </>
            ) : mode === "login" ? (
              "Iniciar Sesión"
            ) : (
              "Crear Cuenta"
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            </span>{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-accent hover:underline font-medium"
              disabled={isLoading}
            >
              {mode === "login" ? "Crear cuenta" : "Iniciar sesión"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
