const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;

	const config: RequestInit = {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(options.headers || {}),
		},
	};

	try {
		const response = await fetch(url, config);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.detail || `HTTP error! status: ${response.status}`,
			);
		}

		return await response.json();
	} catch (error) {
		console.error("API request failed:", error);
		throw error;
	}
}

export const ApiClient = {
	request,
	async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
		return request<T>(endpoint, { method: "GET", headers });
	},

	async post<T>(
		endpoint: string,
		data?: any,
		headers?: Record<string, string>,
	): Promise<T> {
		return request<T>(endpoint, {
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
			headers,
		});
	},

	async put<T>(
		endpoint: string,
		data?: any,
		headers?: Record<string, string>,
	): Promise<T> {
		return request<T>(endpoint, {
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
			headers,
		});
	},

	async patch<T>(
		endpoint: string,
		data?: any,
		headers?: Record<string, string>,
	): Promise<T> {
		return request<T>(endpoint, {
			method: "PATCH",
			body: data ? JSON.stringify(data) : undefined,
			headers,
		});
	},

	async delete<T>(
		endpoint: string,
		headers?: Record<string, string>,
	): Promise<T> {
		return request<T>(endpoint, { method: "DELETE", headers });
	},
};
