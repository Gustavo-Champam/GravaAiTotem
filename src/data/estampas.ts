export type ThemeId =
  | "corporativo"
  | "aniversario"
  | "casamento"
  | "festa"
  | "esportivo"
  | "praia"
  | "natal"
  | "minimal"

export type Theme = {
  id: ThemeId
  label: string
  emoji: string
}

export const THEMES: Theme[] = [
  { id: "corporativo", label: "Corporativo", emoji: "💼" },
  { id: "aniversario", label: "Aniversário", emoji: "🎂" },
  { id: "casamento", label: "Casamento", emoji: "💍" },
  { id: "festa", label: "Festa", emoji: "🎉" },
  { id: "esportivo", label: "Esportivo", emoji: "🏃" },
  { id: "praia", label: "Verão & Praia", emoji: "🌴" },
  { id: "natal", label: "Fim de ano", emoji: "🎄" },
  { id: "minimal", label: "Minimalista", emoji: "✨" },
]

export type EstampaStyle =
  | "mesh"
  | "confete"
  | "ondas"
  | "folhas"
  | "tropical"
  | "geolux"
  | "grid"
  | "floral"
  | "flocos"
  | "raios"
  | "bokeh"
  | "mono"

export type Estampa = {
  id: string
  name: string
  tagline: string
  style: EstampaStyle
  /** background fill of the print panel */
  bg: string
  /** ink/decoration colors used by the renderer */
  palette: string[]
  /** suggested color for custom text on top */
  text: string
  themes: ThemeId[]
}

export const ESTAMPAS: Estampa[] = [
  {
    id: "aurora-mesh",
    name: "Aurora",
    tagline: "Degradê suave e moderno, combina com qualquer marca.",
    style: "mesh",
    bg: "#0e0e1a",
    palette: ["#6e5bff", "#b84dff", "#ff5c93", "#ff9d5c"],
    text: "#ffffff",
    themes: ["corporativo", "minimal", "festa", "aniversario"],
  },
  {
    id: "linhas-corp",
    name: "Grid Executivo",
    tagline: "Linhas geométricas sóbrias, cara de empresa séria.",
    style: "grid",
    bg: "#12233b",
    palette: ["#5b9dff", "#9fc2ff", "#ffffff"],
    text: "#ffffff",
    themes: ["corporativo", "minimal", "esportivo"],
  },
  {
    id: "mono-mark",
    name: "Monograma",
    tagline: "Minimalista e elegante — só o essencial.",
    style: "mono",
    bg: "#f4f1ea",
    palette: ["#16161d", "#b89a5a"],
    text: "#16161d",
    themes: ["minimal", "corporativo", "casamento"],
  },
  {
    id: "confete-festa",
    name: "Confete",
    tagline: "Pontinhos divertidos pra celebrar com energia.",
    style: "confete",
    bg: "#1a1030",
    palette: ["#ffd166", "#ff5c93", "#6e5bff", "#34d399", "#5b9dff"],
    text: "#ffffff",
    themes: ["aniversario", "festa"],
  },
  {
    id: "ondas-memphis",
    name: "Memphis",
    tagline: "Formas pop e vibrantes, bem anos 90.",
    style: "ondas",
    bg: "#fff5e9",
    palette: ["#ff5c93", "#6e5bff", "#ffb703", "#34d399"],
    text: "#16161d",
    themes: ["festa", "aniversario", "esportivo"],
  },
  {
    id: "folhas-bot",
    name: "Botânica",
    tagline: "Folhagens delicadas em traço fino.",
    style: "folhas",
    bg: "#0f2419",
    palette: ["#7fd1a3", "#cdeede", "#b89a5a"],
    text: "#ffffff",
    themes: ["casamento", "minimal", "praia"],
  },
  {
    id: "geo-lux",
    name: "Geo Lux",
    tagline: "Geometria dourada sofisticada para ocasiões especiais.",
    style: "geolux",
    bg: "#101015",
    palette: ["#d9b25b", "#f0d896", "#ffffff"],
    text: "#f0d896",
    themes: ["casamento", "corporativo", "natal"],
  },
  {
    id: "floral-soft",
    name: "Floral",
    tagline: "Flores suaves e românticas em tons pastéis.",
    style: "floral",
    bg: "#fdf0f4",
    palette: ["#ff8fb1", "#ffc2d4", "#a8d5b5", "#ffd166"],
    text: "#6b2a45",
    themes: ["casamento", "aniversario", "praia"],
  },
  {
    id: "tropical-sun",
    name: "Tropical",
    tagline: "Sol, palmeiras e clima de verão o ano todo.",
    style: "tropical",
    bg: "#04313a",
    palette: ["#ffd166", "#ff7e5f", "#2ec4b6", "#9be7c4"],
    text: "#ffffff",
    themes: ["praia", "festa"],
  },
  {
    id: "raios-sport",
    name: "Velocidade",
    tagline: "Raios dinâmicos com energia esportiva.",
    style: "raios",
    bg: "#0b1020",
    palette: ["#3b82f6", "#22d3ee", "#ffffff"],
    text: "#ffffff",
    themes: ["esportivo", "festa", "corporativo"],
  },
  {
    id: "bokeh-glow",
    name: "Glow",
    tagline: "Luzes desfocadas, clima de balada premium.",
    style: "bokeh",
    bg: "#160a24",
    palette: ["#b84dff", "#ff5c93", "#6e5bff", "#ffd166"],
    text: "#ffffff",
    themes: ["festa", "aniversario"],
  },
  {
    id: "flocos-natal",
    name: "Inverno",
    tagline: "Flocos e estrelas para o clima de fim de ano.",
    style: "flocos",
    bg: "#0a1f2e",
    palette: ["#cfe8ff", "#ffffff", "#d9b25b"],
    text: "#ffffff",
    themes: ["natal", "minimal"],
  },
]

/**
 * GRAVA.AI's fallback "recommendation engine": pick estampas that match a theme.
 * Deterministic given (theme), with a guaranteed minimum of 3.
 */
export function recommendEstampas(theme: ThemeId, count = 3): Estampa[] {
  const matches = ESTAMPAS.filter((e) => e.themes.includes(theme))
  const rest = ESTAMPAS.filter((e) => !e.themes.includes(theme))
  const ordered = [...matches, ...rest]
  return ordered.slice(0, count)
}
