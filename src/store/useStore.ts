import { create } from "zustand"
import type { Product, Variant } from "../data/products"
import type { Estampa, ThemeId } from "../data/estampas"

export type PaymentMethod = "pix" | "cartao"

export type Order = {
  code: string
  product: Product
  variant: Variant
  estampa: Estampa | null
  customText: string
  quantity: number
  theme: ThemeId | null
  total: number
  method: PaymentMethod
}

type State = {
  product: Product | null
  variant: Variant | null
  theme: ThemeId | null
  estampa: Estampa | null
  customText: string
  quantity: number
  method: PaymentMethod
  lastOrder: Order | null

  selectProduct: (product: Product, variant?: Variant) => void
  setVariant: (variant: Variant) => void
  setTheme: (theme: ThemeId | null) => void
  setEstampa: (estampa: Estampa | null) => void
  setCustomText: (text: string) => void
  setQuantity: (n: number) => void
  setMethod: (m: PaymentMethod) => void
  total: () => number
  placeOrder: () => Order
  reset: () => void
}

function makeCode(): string {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `AUR-${n}`
}

export const useStore = create<State>((set, get) => ({
  product: null,
  variant: null,
  theme: null,
  estampa: null,
  customText: "",
  quantity: 1,
  method: "pix",
  lastOrder: null,

  selectProduct: (product, variant) =>
    set({
      product,
      variant: variant ?? product.variants[0],
      // fresh personalization whenever a new product is opened
      theme: null,
      estampa: null,
      customText: "",
      quantity: 1,
    }),
  setVariant: (variant) => set({ variant }),
  setTheme: (theme) => set({ theme }),
  setEstampa: (estampa) => set({ estampa }),
  setCustomText: (text) => set({ customText: text.slice(0, 22) }),
  setQuantity: (n) => set({ quantity: Math.max(1, Math.min(999, n)) }),
  setMethod: (method) => set({ method }),

  total: () => {
    const { product, quantity } = get()
    if (!product) return 0
    return product.price * quantity
  },

  placeOrder: () => {
    const s = get()
    const order: Order = {
      code: makeCode(),
      product: s.product!,
      variant: s.variant!,
      estampa: s.estampa,
      customText: s.customText,
      quantity: s.quantity,
      theme: s.theme,
      total: s.total(),
      method: s.method,
    }
    set({ lastOrder: order })
    return order
  },

  reset: () =>
    set({
      product: null,
      variant: null,
      theme: null,
      estampa: null,
      customText: "",
      quantity: 1,
      method: "pix",
    }),
}))
