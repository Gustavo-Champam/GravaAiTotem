import type { Estampa, EstampaStyle, ThemeId } from "../data/estampas"

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
const MODEL = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || "gemini-2.5-flash"

const STYLES: EstampaStyle[] = [
  "mesh", "confete", "ondas", "folhas", "tropical", "geolux", "grid", "floral", "flocos", "raios", "bokeh", "mono",
]

export function isAIEnabled(): boolean {
  return Boolean(API_KEY && API_KEY.length > 10)
}

export type AIResult = {
  reply: string
  designs: Estampa[]
}

type GenParams = {
  productName: string
  color: string
  colorHex?: string
  theme: ThemeId
  themeLabel: string
  brief: string
}

const SCHEMA = {
  type: "OBJECT",
  properties: {
    reply: { type: "STRING" },
    designs: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          style: { type: "STRING", enum: STYLES },
          bg: { type: "STRING" },
          palette: { type: "ARRAY", items: { type: "STRING" } },
          textColor: { type: "STRING" },
          tagline: { type: "STRING" },
        },
        required: ["name", "style", "bg", "palette", "textColor", "tagline"],
      },
    },
  },
  required: ["reply", "designs"],
}

function buildPrompt(p: GenParams): string {
  return [
    "Você é a Grava, a IA de personalização de brindes da GRAVA.AI (empresa de gravação a laser).",
    "Um cliente quer personalizar um produto em um totem de loja.",
    `Produto: ${p.productName} (cor: ${p.color}${p.colorHex ? `, hex ${p.colorHex}` : ""}).`,
    `Ocasião: ${p.themeLabel}.`,
    p.brief.trim() ? `Pedido do cliente: "${p.brief.trim()}".` : "Sem detalhes extras do cliente.",
    "",
    "Crie EXATAMENTE 3 conceitos de estampa/arte para aplicar no produto, bem diferentes entre si e adequados à ocasião.",
    "Para cada conceito escolha um 'style' da lista permitida e defina uma paleta de cores harmônica (3 a 5 cores hex), uma cor de fundo (bg) e uma cor de texto (textColor) com bom contraste sobre o fundo.",
    "Regras de cor: TODOS os campos de cor ('bg', 'palette', 'textColor') devem ser hex no formato #rrggbb. 'bg' é a cor de fundo da arte; 'textColor' é a cor do texto que deve contrastar fortemente com 'bg'. NÃO escreva frases nesses campos, apenas cores hex.",
    `IMPORTANTE — CONTRASTE COM O PRODUTO: a arte será aplicada sobre um produto de cor "${p.color}". O 'bg' de CADA estampa precisa CONTRASTAR FORTE com essa cor do produto para a arte aparecer bem. Se o produto for escuro, use fundos claros/vibrantes; se for claro, pode usar fundos escuros ou saturados. NUNCA use um 'bg' parecido com a cor do produto.`,
    "'name' curto (1-2 palavras, em português). 'tagline' = uma frase curta explicando por que combina com a ocasião.",
    "'reply' = uma mensagem curta, calorosa e em primeira pessoa apresentando as 3 estampas ao cliente (máx 2 frases, pode usar 1 emoji).",
    "Responda SOMENTE no formato JSON do schema.",
  ].join("\n")
}

/** Calls Gemini and returns AI-designed estampas. Throws on any failure. */
export async function aiGenerateEstampas(p: GenParams, timeoutMs = 9000): Promise<AIResult> {
  if (!isAIEnabled()) throw new Error("AI disabled")

  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`
    const body = JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildPrompt(p) }] }],
      generationConfig: {
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: SCHEMA,
        // disable "thinking" on 2.5 models for fast, totem-friendly latency
        thinkingConfig: { thinkingBudget: 0 },
      },
    })
    const call = () => fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, signal: ctrl.signal, body })

    let res = await call()
    // Rate limit (free-tier RPM): wait the suggested time and retry once before
    // falling back, so a busy demo keeps using the real AI.
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after"))
      const waitMs = Math.min(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1300, timeoutMs - 1000)
      if (waitMs > 0) {
        await new Promise((r) => setTimeout(r, waitMs))
        res = await call()
      }
    }
    if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`)
    const data = await res.json()
    const parts: Array<{ text?: string }> = data?.candidates?.[0]?.content?.parts ?? []
    const text = parts.map((p) => p.text).filter(Boolean).join("")
    if (!text) throw new Error("Empty Gemini response")
    const parsed = JSON.parse(text) as {
      reply: string
      designs: Array<{ name: string; style: string; bg: string; palette: string[]; textColor: string; tagline: string }>
    }
    const designs: Estampa[] = (parsed.designs || []).slice(0, 3).map((d, i) => ({
      id: `ai-${p.theme}-${i}`,
      name: d.name?.slice(0, 18) || `Arte ${i + 1}`,
      tagline: d.tagline || "",
      style: (STYLES.includes(d.style as EstampaStyle) ? d.style : "mesh") as EstampaStyle,
      bg: sanitizeHex(d.bg, "#0e1726"),
      palette: (d.palette || []).map((c) => sanitizeHex(c, "#2dc5f5")).slice(0, 5),
      text: sanitizeHex(d.textColor, "#ffffff"),
      themes: [p.theme],
    }))
    if (designs.length < 1) throw new Error("No designs")
    // guarantee at least 3 entries
    while (designs.length < 3) designs.push({ ...designs[designs.length - 1], id: `ai-${p.theme}-pad-${designs.length}` })
    return { reply: parsed.reply || "Criei 3 estampas exclusivas pra você ✨", designs }
  } finally {
    clearTimeout(t)
  }
}

function sanitizeHex(value: string | undefined, fallback: string): string {
  if (!value) return fallback
  const v = value.trim()
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v) ? v : fallback
}
