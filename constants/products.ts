export const GRIND_OPTIONS = [
	{ value: "whole", label: "Granos Enteros" },
	{ value: "coarse", label: "Gruesa" },
	{ value: "medium", label: "Media" },
	{ value: "fine", label: "Fina" },
	{ value: "espresso", label: "Espresso" },
	{ value: "nespresso", label: "Nespresso" },
] as const;

export const PRESENTATION_OPTIONS = [
	{ value: "quarter", label: "1/4", price: 1 },
	{ value: "half", label: "1/2", price: 1.8 },
	{ value: "full", label: "1", price: 3.5 },
] as const;

export const WHOLESALE_PRESENTATIONS = [
	{ value: "quarter", label: "1/4 kg", price: 1 },
	{ value: "full", label: "1 kg", price: 3.5 },
] as const;
