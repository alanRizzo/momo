"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import type {
	User,
	RegisterRequest,
	LoginRequest,
} from "@/services/auth-service";
import { AuthService } from "@/services/auth-service";

interface AuthContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	token: string | null;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	register: (
		email: string,
		password: string,
		firstName: string,
		lastName: string,
		phone: string,
		address: RegisterRequest["address"],
	) => Promise<boolean>;
	createWholesaleUser: (
		email: string,
		firstName: string,
		lastName: string,
		phone: string,
		address: RegisterRequest["address"],
	) => Promise<User>;
	logout: () => Promise<void>;
	updateUserData: (updates: Partial<User>) => Promise<User | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const savedUser = AuthService.getStoredUser();
		const savedToken = AuthService.getStoredToken();
		if (savedUser) setUser(savedUser);
		if (savedToken) setToken(savedToken);
		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		setIsLoading(true);
		try {
			const resp = await AuthService.login({ email, password } as LoginRequest);
			setUser(resp.user);
			setToken(resp.access_token ?? null);
			return true;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (
		email: string,
		password: string,
		firstName: string,
		lastName: string,
		phone: string,
		address: RegisterRequest["address"],
	): Promise<boolean> => {
		setIsLoading(true);
		try {
			const req: RegisterRequest = {
				email,
				password,
				first_name: firstName,
				last_name: lastName,
				phone,
				user_type: "retail",
				address,
			};
			await AuthService.register(req);

			// Creamos un objeto User válido para el frontend
			const newUser: User = {
				id: "temp-" + Date.now(),
				email,
				first_name: firstName,
				last_name: lastName,
				phone,
				user_type: "retail",
				address: [address],
			};

			setUser(newUser);
			AuthService.storeUser(newUser);
			return true;
		} catch (error) {
			console.error("Registration error:", error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const createWholesaleUser = async (
		email: string,
		firstName: string,
		lastName: string,
		phone: string,
		address: RegisterRequest["address"],
	): Promise<User> => {
		const req: RegisterRequest = {
			email,
			password: "defaultPassword123",
			first_name: firstName,
			last_name: lastName,
			phone,
			user_type: "wholesale",
			address,
		};

		await AuthService.register(req);

		const newUser: User = {
			id: "wholesale-" + Date.now(),
			email,
			first_name: firstName,
			last_name: lastName,
			phone,
			user_type: "wholesale",
			address: [address],
		};

		setUser(newUser);
		AuthService.storeUser(newUser);
		return newUser;
	};

	const logout = async () => {
		try {
			await AuthService.logout();
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setUser(null);
			setToken(null);
		}
	};

	const updateUserData = async (updates: Partial<User>) => {
		if (!user) return;
		try {
			const updatedUser = await AuthService.updateUser(user.id, updates);
			setUser(updatedUser);
			return updatedUser;
		} catch (error) {
			console.error("Update user data error:", error);
			throw error;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				token,
				isLoading,
				login,
				register,
				logout,
				createWholesaleUser,
				updateUserData,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
