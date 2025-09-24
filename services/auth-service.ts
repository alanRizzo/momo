import { ApiClient } from "@/lib/api-client"
import type { User } from "@/types/auth"

export interface RegisterRequest {
  email: string
  first_name: string
  last_name: string
  phone: string
  user_type: "retail" | "wholesale"
  address: {
    street: string
    city: string
    state: string
    postal_code: string
    country: string
    is_default: boolean
  }
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    phone: string
    user_type: "retail" | "wholesale"
    address: {
      street: string
      city: string
      state: string
      postal_code: string
      country: string
      is_default: boolean
    }
  }
  access_token?: string
  token_type?: string
}

export interface UpdateUserRequest {
  first_name?: string
  last_name?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    postal_code: string
    country: string
    is_default: boolean
  }
}

export class AuthService {
  private static readonly STORAGE_KEY = "user"
  private static readonly TOKEN_KEY = "auth_token"

  static getStoredUser(): User | null {
    if (typeof window === "undefined") return null
    const savedUser = localStorage.getItem(this.STORAGE_KEY)
    return savedUser ? JSON.parse(savedUser) : null
  }

  static getStoredToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static storeUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
    }
  }

  static storeToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token)
    }
  }

  static removeUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.TOKEN_KEY)
    }
  }

  static transformBackendUser(backendUser: AuthResponse["user"]): User {
    return {
      id: backendUser.id,
      email: backendUser.email,
      name: `${backendUser.first_name} ${backendUser.last_name}`,
      firstName: backendUser.first_name,
      lastName: backendUser.last_name,
      phone: backendUser.phone,
      address: `${backendUser.address.street}, ${backendUser.address.city}, ${backendUser.address.state}, ${backendUser.address.postal_code}`,
      userType: backendUser.user_type === "wholesale" ? "wholesale" : "regular",
    }
  }

  static async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    address: string,
    userType: "retail" | "wholesale" = "retail",
  ): Promise<User> {
    // Parse address string into components (basic parsing)
    const addressParts = address.split(",").map((part) => part.trim())
    const street = addressParts[0] || address
    const city = addressParts[1] || ""
    const state = addressParts[2] || ""
    const postalCode = addressParts[3] || ""

    const registerData: RegisterRequest = {
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      user_type: userType,
      address: {
        street,
        city,
        state,
        postal_code: postalCode,
        country: "Argentina",
        is_default: false,
      },
      password,
    }

    const response = await ApiClient.post<AuthResponse>("/user/register", registerData)

    const user = this.transformBackendUser(response.user)
    this.storeUser(user)

    if (response.access_token) {
      this.storeToken(response.access_token)
    }

    return user
  }

  static async login(email: string, password: string): Promise<User> {
    const loginData: LoginRequest = {
      email,
      password,
    }

    const response = await ApiClient.post<AuthResponse>("/user/login", loginData)

    const user = this.transformBackendUser(response.user)
    this.storeUser(user)

    if (response.access_token) {
      this.storeToken(response.access_token)
    }

    return user
  }

  static async logout(): Promise<void> {
    // If you have a logout endpoint in FastAPI, call it here
    // await ApiClient.post('/user/logout')
    this.removeUser()
  }

  static async updateUser(
    userId: string,
    updates: Partial<Pick<User, "phone" | "address" | "firstName" | "lastName">>,
  ): Promise<User> {
    const updateData: UpdateUserRequest = {}

    if (updates.firstName) updateData.first_name = updates.firstName
    if (updates.lastName) updateData.last_name = updates.lastName
    if (updates.phone) updateData.phone = updates.phone

    if (updates.address) {
      // Parse address string into components
      const addressParts = updates.address.split(",").map((part) => part.trim())
      const street = addressParts[0] || updates.address
      const city = addressParts[1] || ""
      const state = addressParts[2] || ""
      const postalCode = addressParts[3] || ""

      updateData.address = {
        street,
        city,
        state,
        postal_code: postalCode,
        country: "Argentina",
        is_default: false,
      }
    }

    const response = await ApiClient.put<AuthResponse>(`/user/${userId}`, updateData)

    const user = this.transformBackendUser(response.user)
    this.storeUser(user)

    return user
  }

  // Fallback methods for development/testing
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
