"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminPanel() {
  const { createWholesaleUser } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createWholesaleUser(formData.email, formData.firstName, formData.lastName, formData.phone, formData.address)
    // Reset form
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
    })
    alert("Usuario mayorista creado exitosamente")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const loginTestUser = () => {
    // This will trigger the test wholesale user login
    window.location.reload()
    setTimeout(() => {
      const loginButton = document.querySelector('[data-testid="login-button"]') as HTMLButtonElement
      if (loginButton) {
        loginButton.click()
      }
    }, 100)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Panel de Administración</CardTitle>
          <CardDescription>Crear usuarios mayoristas y probar el sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test User Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Usuario de Prueba</h3>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Usuario mayorista de prueba ya creado:</p>
              <p>
                <strong>Email:</strong> mayorista@test.com
              </p>
              <p>
                <strong>Contraseña:</strong> test123
              </p>
              <p>
                <strong>Nombre:</strong> Juan Pérez
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Usa estas credenciales para probar el sistema mayorista
              </p>
            </div>
          </div>

          {/* Create New Wholesale User */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Crear Nuevo Usuario Mayorista</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
              </div>

              <Button type="submit" className="w-full">
                Crear Usuario Mayorista
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
