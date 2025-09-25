export interface Product {
	id: number;
	name: string;
	image: string;
	badge?: string;
	rating: number;
	description: string;
	price: string;
	originalPrice?: string;
	region: string;
	varietal: string;
	altitude: string;
	notes: string;
	process: string;
}

export interface ProductSelection {
	productId: string;
	presentation: "quarter" | "half" | "full";
	grind: "whole" | "coarse" | "medium" | "fine" | "espresso" | "nespresso";
	quantity: number;
	quarterQuantity?: number;
	fullQuantity?: number;
}

export interface WholesaleQuantities {
	quarter: number;
	full: number;
}
