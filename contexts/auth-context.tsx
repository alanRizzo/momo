"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthContextType } from "@/types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

class AuthService {
  private static readonly STORAGE_KEY = "user"
  private static readonly TEST_WHOLESALE_USER = {
    email: "mayorista@test.com",
    password: "test123",
    userData: {
      id: "wholesale-1",
      email: "mayorista@test.com",
      name: "Juan Pérez",
      firstName: "Juan",
      lastName: "Pérez",
      phone: "+1234567890",
      address: "Calle Principal 123, Ciudad",
      userType: "wholesale" as const,
    },
  }

  static getStoredUser(): User | null {
    if (typeof window === "undefined") return null
    const savedUser = localStorage.getItem(this.STORAGE_KEY)
    return savedUser ? JSON.parse(savedUser) : null
  }

  static storeUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
    }
  }

  static removeUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY)
    }
  }

  static async simulateApiCall(delay = 1000): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, delay))
  }

  static isWholesaleEmail(email: string): boolean {
    return email.includes("mayorista") || email.includes("wholesale")
  }

  static createMockUser(email: string, firstName?: string, lastName?: string, phone?: string, address?: string): User {
    const isWholesale = this.isWholesaleEmail(email)

    return {
      id: isWholesale ? `wholesale-${Date.now()}` : "1",
      email,
      name: firstName && lastName ? `${firstName} ${lastName}` : email.split("@")[0],
      firstName: firstName || email.split("@")[0],
      lastName: lastName || "Usuario",
      phone: phone || "",
      address: address || "",
      userType: isWholesale ? "wholesale" : "regular",
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = AuthService.getStoredUser()
    if (savedUser) {
      setUser(savedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      await AuthService.simulateApiCall()

      let mockUser: User

      // Check test wholesale user
      if (email === AuthService.TEST_WHOLESALE_USER.email && password === AuthService.TEST_WHOLESALE_USER.password) {
        mockUser = AuthService.TEST_WHOLESALE_USER.userData
      } else {
        mockUser = AuthService.createMockUser(email)
      }

      setUser(mockUser)
      AuthService.storeUser(mockUser)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    address: string,
  ): Promise<boolean> => {
    setIsLoading(true)
    try {
      await AuthService.simulateApiCall()

      const mockUser = AuthService.createMockUser(email, firstName, lastName, phone, address)
      setUser(mockUser)
      AuthService.storeUser(mockUser)
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const createWholesaleUser = (email: string, firstName: string, lastName: string, phone: string, address: string) => {
    const wholesaleUser = AuthService.createMockUser(email, firstName, lastName, phone, address)
    wholesaleUser.userType = "wholesale"
    wholesaleUser.id = `wholesale-${Date.now()}`

    console.log("Created wholesale user:", wholesaleUser)
    setUser(wholesaleUser)
    AuthService.storeUser(wholesaleUser)
  }

  const logout = () => {
    setUser(null)
    AuthService.removeUser()
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, createWholesaleUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
