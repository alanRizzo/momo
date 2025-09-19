import type { Product } from "@/types/product"

export const PRODUCTS: Product[] = [
  {
    id: "duna",
    name: "DUNA",
    description: "Café de origen único con notas florales y cítricas",
    price: 12000,
    image: "/duna.webp",
  },
  {
    id: "leo",
    name: "LEO",
    description: "Mezcla equilibrada con cuerpo medio y dulzura natural",
    price: 11500,
    image: "/leo.webp",
  },
  {
    id: "silnina",
    name: "SILNINA",
    description: "Café intenso con notas achocolatadas y frutos secos",
    price: 13000,
    image: "/silnina.webp",
  },
  {
    id: "decaf",
    name: "DECAF",
    description: "Descafeinado natural que conserva todo el sabor",
    price: 12500,
    image: "/decaf.webp",
  },
]

export const GRIND_OPTIONS = [
  { value: "whole", label: "Granos Enteros" },
  { value: "coarse", label: "Gruesa" },
  { value: "medium", label: "Media" },
  { value: "fine", label: "Fina" },
  { value: "espresso", label: "Espresso" },
  { value: "nespresso", label: "Nespresso" },
] as const

export const PRESENTATION_OPTIONS = [
  { value: "quarter", label: "1/4", price: 1 },
  { value: "half", label: "1/2", price: 1.8 },
  { value: "full", label: "1", price: 3.5 },
] as const

export const WHOLESALE_PRESENTATIONS = [
  { value: "quarter", label: "1/4 kg", price: 1 },
  { value: "full", label: "1 kg", price: 3.5 },
] as const
