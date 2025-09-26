import type { Product } from "@/types/product"

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "DUNA",
    description: "Café de origen único con notas florales y cítricas, cultivado en las montañas de Colombia",
    price: 12000,
    image: "/duna.webp",
    badge: "Origen Único",
    rating: 4.8,
    region: "Huila, Colombia",
    varietal: "Caturra",
    altitude: "1,600 - 1,800 msnm",
    notes: "Florales, cítricas, miel",
    process: "Lavado",
  },
  {
    id: "2",
    name: "LEO",
    description: "Mezcla equilibrada con cuerpo medio y dulzura natural, perfecta para cualquier momento del día",
    price: 11500,
    image: "/leo.webp",
    badge: "Bestseller",
    rating: 4.6,
    region: "Nariño, Colombia",
    varietal: "Castillo, Caturra",
    altitude: "1,400 - 1,700 msnm",
    notes: "Chocolate, caramelo, nueces",
    process: "Natural",
  },
  {
    id: "3",
    name: "SILNINA",
    description: "Café intenso con notas achocolatadas y frutos secos, ideal para los amantes del café fuerte",
    price: 13000,
    image: "/silnina.webp",
    badge: "Intenso",
    rating: 4.9,
    region: "Tolima, Colombia",
    varietal: "Geisha",
    altitude: "1,800 - 2,000 msnm",
    notes: "Chocolate negro, almendras, especias",
    process: "Honey",
  },
  {
    id: "4",
    name: "DECAF",
    description: "Descafeinado natural que conserva todo el sabor original sin comprometer la calidad",
    price: 12500,
    image: "/decaf.webp",
    badge: "Descafeinado",
    rating: 4.4,
    region: "Cauca, Colombia",
    varietal: "Bourbon",
    altitude: "1,500 - 1,650 msnm",
    notes: "Dulce, suave, equilibrado",
    process: "Descafeinado por agua",
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
