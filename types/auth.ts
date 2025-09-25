export interface User {
	id: string;
	email: string;
	name: string;
	firstName: string;
	lastName: string;
	phone: string;
	address: string;
	userType: "retail" | "wholesale";
}

export interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<boolean>;
	register: (
		email: string,
		password: string,
		firstName: string,
		lastName: string,
		phone: string,
		address: string,
		userType: string,
	) => Promise<boolean>;
	logout: () => void;
	isLoading: boolean;
	updateUserData?: (
		updates: Partial<
			Pick<User, "phone" | "address" | "firstName" | "lastName">
		>,
	) => Promise<User>;
}
