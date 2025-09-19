export interface User {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  phone: string
  address: string
  userType: "regular" | "wholesale"
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    address: string,
  ) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  createWholesaleUser: (email: string, firstName: string, lastName: string, phone: string, address: string) => void
}
