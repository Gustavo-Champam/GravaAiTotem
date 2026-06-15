export type Category = "Copos" | "Garrafas" | "Canetas" | "Chaveiros"

export type Variant = {
  id: string
  name: string
  image: string
  /** CSS color for the swatch dot. If omitted, the variant thumb shows the image. */
  swatch?: string
}

/** How a personalization is rendered onto this product. */
export type PrintStyle = "panel" | "engrave" | "plate"

export type PrintArea = {
  cx: number // center X (% of frame)
  cy: number // center Y (% of frame)
  w: number // width (% of frame)
  h: number // height (% of frame)
  round: number // border radius (px-ish)
  skew?: number // subtle vertical curve hint
}

export type Product = {
  id: string
  name: string
  category: Category
  tagline: string
  description: string
  specs: string[]
  price: number
  badge?: string
  printStyle: PrintStyle
  print: PrintArea
  variants: Variant[]
}

const P = "/products"

export const PRODUCTS: Product[] = [
  {
    id: "copo-1200",
    name: "Copo Térmico 1200ml",
    category: "Copos",
    tagline: "O queridinho — com canudo e alça",
    description:
      "Copo térmico de parede dupla em aço inox, com tampa, canudo e alça ergonômica. Mantém a bebida gelada por até 24h. Disponível em 8 cores e pronto para receber a sua arte.",
    specs: ["Aço inox 304", "Parede dupla a vácuo", "1200 ml", "Canudo + alça"],
    price: 89.9,
    badge: "Mais vendido",
    printStyle: "panel",
    print: { cx: 44, cy: 59, w: 48, h: 40, round: 18, skew: 5 },
    variants: [
      { id: "preto", name: "Preto", image: `${P}/copo-1200/preto.jpg`, swatch: "#1b1b21" },
      { id: "vermelho", name: "Vermelho", image: `${P}/copo-1200/vermelho.png`, swatch: "#e11d2a" },
      { id: "pink", name: "Pink", image: `${P}/copo-1200/pink.jpg`, swatch: "#ed1e95" },
      { id: "menta", name: "Menta", image: `${P}/copo-1200/menta.jpg`, swatch: "#86d8c3" },
      { id: "coral", name: "Coral", image: `${P}/copo-1200/coral.jpg`, swatch: "#f3a98d" },
      { id: "lilas", name: "Lilás", image: `${P}/copo-1200/lilas.jpg`, swatch: "#c3a0ee" },
      { id: "serenity", name: "Azul Serenity", image: `${P}/copo-1200/serenity.jpg`, swatch: "#a7c1ec" },
      { id: "creme", name: "Creme", image: `${P}/copo-1200/creme.jpg`, swatch: "#ece6d2" },
    ],
  },
  {
    id: "garrafa-500",
    name: "Garrafa Térmica 500ml",
    category: "Garrafas",
    tagline: "Design clássico estilo swell",
    description:
      "Garrafa térmica em aço inox com acabamento premium e tampa rosqueável. Formato icônico, ideal para gravação de logo e brindes corporativos.",
    specs: ["Aço inox", "Parede dupla", "500 ml", "Tampa em inox"],
    price: 69.9,
    printStyle: "panel",
    print: { cx: 50, cy: 56, w: 40, h: 44, round: 16, skew: 6 },
    variants: [
      { id: "branca", name: "Branca", image: `${P}/garrafa-500/branca.jpg`, swatch: "#f3f3f0" },
      { id: "preta", name: "Preta", image: `${P}/garrafa-500/preta.jpg`, swatch: "#1b1b21" },
    ],
  },
  {
    id: "garrafa-dw",
    name: "Garrafa Double Wall 600ml",
    category: "Garrafas",
    tagline: "Esportiva com alça de transporte",
    description:
      "Garrafa esportiva de parede dupla com tampa de rosca, bico de bebida e alça de silicone. Robusta, perfeita para academia e dia a dia.",
    specs: ["Aço inox", "Parede dupla", "600 ml", "Alça de transporte"],
    price: 79.9,
    printStyle: "panel",
    print: { cx: 50, cy: 60, w: 46, h: 40, round: 16, skew: 4 },
    variants: [{ id: "preta", name: "Preta", image: `${P}/garrafa-dw/preta.jpg`, swatch: "#1b1b21" }],
  },
  {
    id: "kit-cafe",
    name: "Garrafa Kit Café 500ml",
    category: "Garrafas",
    tagline: "Térmica com tampa-copo",
    description:
      "Garrafa térmica com tampa que vira copo — perfeita para café e chá. Acompanha vedação dupla. Um presente sofisticado e funcional.",
    specs: ["Aço inox", "Tampa-copo", "500 ml", "Vedação dupla"],
    price: 109.9,
    badge: "Premium",
    printStyle: "panel",
    print: { cx: 50, cy: 62, w: 44, h: 34, round: 16, skew: 4 },
    variants: [{ id: "preto", name: "Preto Fosco", image: `${P}/kit-cafe/preto.jpg`, swatch: "#1b1b21" }],
  },
  {
    id: "chopp",
    name: "Caneca Chopp 750ml",
    category: "Copos",
    tagline: "Caneca térmica para a cerveja gelada",
    description:
      "Caneca de chopp térmica em aço inox de parede dupla com alça resistente. Mantém o chopp gelado do começo ao fim. Ideal para bares, eventos e presentes.",
    specs: ["Aço inox", "Parede dupla", "750 ml", "Alça resistente"],
    price: 54.9,
    printStyle: "panel",
    print: { cx: 43, cy: 54, w: 48, h: 46, round: 16, skew: 4 },
    variants: [{ id: "branco", name: "Branco", image: `${P}/chopp/branco.jpg`, swatch: "#f3f3f0" }],
  },
  {
    id: "caneta",
    name: "Caneta Metal Premium",
    category: "Canetas",
    tagline: "Gravação a laser do seu nome",
    description:
      "Caneta esferográfica em metal com acabamento brilhante e detalhes cromados. Escrita macia em tinta azul. Personalize com gravação a laser elegante.",
    specs: ["Corpo em metal", "Tinta azul", "Detalhes cromados", "Gravação a laser"],
    price: 24.9,
    printStyle: "engrave",
    print: { cx: 50, cy: 50, w: 40, h: 8, round: 4 },
    variants: [
      { id: "azul", name: "Azul", image: `${P}/caneta/azul.png`, swatch: "#1f4fd1" },
      { id: "preta", name: "Preta", image: `${P}/caneta/preta.png`, swatch: "#1b1b21" },
      { id: "vermelha", name: "Vermelha", image: `${P}/caneta/vermelha.png`, swatch: "#d11f2a" },
      { id: "verde", name: "Verde", image: `${P}/caneta/verde.png`, swatch: "#1f9d57" },
      { id: "roxo", name: "Roxo", image: `${P}/caneta/roxo.png`, swatch: "#6a32c9" },
      { id: "rosa", name: "Rosa", image: `${P}/caneta/rosa.png`, swatch: "#ff5fa8" },
    ],
  },
  {
    id: "chaveiro",
    name: "Chaveiro Personalizado",
    category: "Chaveiros",
    tagline: "Vários modelos para gravar",
    description:
      "Chaveiros premium em metal e couro sintético, perfeitos para gravação de logo, nome ou data. Lembrança ideal para eventos, brindes e fidelização.",
    specs: ["Metal / couro", "Argola reforçada", "Gravação a laser", "Vários formatos"],
    price: 16.9,
    printStyle: "plate",
    print: { cx: 50, cy: 56, w: 34, h: 24, round: 8 },
    variants: [
      { id: "couro-preto", name: "Couro Preto", image: `${P}/chaveiro/couro-preto.png` },
      { id: "couro-caramelo", name: "Couro Caramelo", image: `${P}/chaveiro/couro-caramelo.png` },
      { id: "metal", name: "Metal Retangular", image: `${P}/chaveiro/metal-retangular.png` },
      { id: "casa", name: "Formato Casa", image: `${P}/chaveiro/formato-casa.png` },
      { id: "abridor", name: "Abridor", image: `${P}/chaveiro/abridor.png` },
    ],
  },
]

export const CATEGORIES: Array<{ id: Category | "Todos"; label: string }> = [
  { id: "Todos", label: "Todos" },
  { id: "Copos", label: "Copos" },
  { id: "Garrafas", label: "Garrafas" },
  { id: "Canetas", label: "Canetas" },
  { id: "Chaveiros", label: "Chaveiros" },
]

export function getProduct(id: string | undefined): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}
