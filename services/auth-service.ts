import { ApiClient } from "@/lib/api-client";

export interface AddressData {
	street: string;
	city: string;
	state: string;
	postal_code: string;
	country: string;
	is_default: boolean;
}

export interface RegisterRequest {
	email: string;
	first_name: string;
	last_name: string;
	phone: string;
	user_type: "retail" | "wholesale";
	address: AddressData;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterResponse {
	first_name: string;
}

export interface User {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	phone: string;
	user_type: "retail" | "wholesale";
	addresses: [AddressData];
}

export interface AuthResponse {
	user: User;
	access_token?: string;
	token_type?: string;
}

const STORAGE_KEY_USER = "auth_user";
const STORAGE_KEY_TOKEN = "auth_token";

export const AuthService = {
	async register(data: RegisterRequest): Promise<RegisterResponse> {
		return await ApiClient.post<RegisterResponse>("/user/register", data);
	},

	async login(data: LoginRequest): Promise<AuthResponse> {
		const response = await ApiClient.post<AuthResponse>("/user/login", data);
		if (response.user) {
			this.storeUser(response.user);
		}
		if (response.access_token) {
			this.storeToken(response.access_token);
		}
		return response;
	},

	async updateUser(
		userId: string,
		updates: Partial<RegisterRequest>,
	): Promise<User> {
		const response = await ApiClient.put<AuthResponse>(
			`/user/${userId}`,
			updates,
		);
		if (response.user) {
			this.storeUser(response.user);
		}
		return response.user;
	},

	async logout(): Promise<void> {
		this.clearStoredUser();
		this.clearStoredToken();
		// Opcional: avisar al backend si maneja sesiones
		// await ApiClient.post("/user/logout", {})
	},

	// --- Helpers de almacenamiento local ---
	getStoredUser(): User | null {
		if (typeof window === "undefined") return null;
		const data = localStorage.getItem(STORAGE_KEY_USER);
		return data ? (JSON.parse(data) as User) : null;
	},

	storeUser(user: User) {
		if (typeof window === "undefined") return;
		localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
	},

	clearStoredUser() {
		if (typeof window === "undefined") return;
		localStorage.removeItem(STORAGE_KEY_USER);
	},

	getStoredToken(): string | null {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(STORAGE_KEY_TOKEN);
	},

	storeToken(token: string) {
		if (typeof window === "undefined") return;
		localStorage.setItem(STORAGE_KEY_TOKEN, token);
	},

	clearStoredToken() {
		if (typeof window === "undefined") return;
		localStorage.removeItem(STORAGE_KEY_TOKEN);
	},
};
