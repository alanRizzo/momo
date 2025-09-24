"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthContextType } from "@/types/auth"
import { AuthService } from "@/services/auth-service"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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
      // Try FastAPI first
      try {
        const user = await AuthService.login(email, password)
        setUser(user)
        return true
      } catch (apiError) {
        console.warn("FastAPI login failed, falling back to mock:", apiError)

        // Fallback to mock for development
        await AuthService.simulateApiCall()

        let mockUser: User

        // Check test wholesale user
        if (email === "mayorista@test.com" && password === "test123") {
          mockUser = {
            id: "wholesale-1",
            email: "mayorista@test.com",
            name: "Juan Pérez",
            firstName: "Juan",
            lastName: "Pérez",
            phone: "+1234567890",
            address: "Calle Principal 123, Ciudad",
            userType: "wholesale",
          }
        } else {
          mockUser = AuthService.createMockUser(email)
        }

        setUser(mockUser)
        AuthService.storeUser(mockUser)
        return true
      }
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
      // Try FastAPI first
      try {
        const user = await AuthService.register(email, password, firstName, lastName, phone, address)
        setUser(user)
        return true
      } catch (apiError) {
        console.warn("FastAPI register failed, falling back to mock:", apiError)

        // Fallback to mock for development
        await AuthService.simulateApiCall()

        const mockUser = AuthService.createMockUser(email, firstName, lastName, phone, address)
        setUser(mockUser)
        AuthService.storeUser(mockUser)
        return true
      }
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const createWholesaleUser = async (
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    address: string,
  ) => {
    try {
      // Try FastAPI first for wholesale user creation
      try {
        const user = await AuthService.register(
          email,
          "defaultPassword123",
          firstName,
          lastName,
          phone,
          address,
          "wholesale",
        )
        console.log("Created wholesale user via API:", user)
        setUser(user)
        return user
      } catch (apiError) {
        console.warn("FastAPI wholesale user creation failed, falling back to mock:", apiError)

        // Fallback to mock
        const wholesaleUser = AuthService.createMockUser(email, firstName, lastName, phone, address)
        wholesaleUser.userType = "wholesale"
        wholesaleUser.id = `wholesale-${Date.now()}`

        console.log("Created wholesale user (mock):", wholesaleUser)
        setUser(wholesaleUser)
        AuthService.storeUser(wholesaleUser)
        return wholesaleUser
      }
    } catch (error) {
      console.error("Error creating wholesale user:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
    }
  }

  const updateUserData = async (updates: Partial<Pick<User, "phone" | "address" | "firstName" | "lastName">>) => {
    if (!user) return

    try {
      // Try FastAPI first
      try {
        const updatedUser = await AuthService.updateUser(user.id, updates)
        setUser(updatedUser)
        return updatedUser
      } catch (apiError) {
        console.warn("FastAPI update failed, falling back to mock:", apiError)

        // Fallback to mock for development
        await AuthService.simulateApiCall()

        const updatedUser = { ...user, ...updates }
        setUser(updatedUser)
        AuthService.storeUser(updatedUser)
        return updatedUser
      }
    } catch (error) {
      console.error("Update user data error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        createWholesaleUser,
        updateUserData,
      }}
    >
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
