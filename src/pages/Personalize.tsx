import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ArrowRight, RotateCcw, Sparkles, Check, Cpu } from "lucide-react"
import { useStore } from "../store/useStore"
import { ESTAMPAS, THEMES, type Estampa, type ThemeId } from "../data/estampas"
import TopBar from "../components/TopBar"
import Stepper from "../components/Stepper"
import GravaOrb from "../components/GravaOrb"
import EstampaArt from "../components/EstampaArt"
import MockupPreview from "../components/MockupPreview"
import { useTypewriter } from "../lib/useTypewriter"
import { aiGenerateEstampas, isAIEnabled } from "../lib/gemini"

type Phase = "ask" | "thinking" | "done"

/** Local fallback "recommendation engine" (used if Gemini is unavailable). */
function localGenerate(theme: ThemeId, round: number): Estampa[] {
  const matches = ESTAMPAS.filter((e) => e.themes.includes(theme))
  const rest = ESTAMPAS.filter((e) => !e.themes.includes(theme))
  const pool = [...matches, ...rest]
  const out: Estampa[] = []
  for (let i = 0; i < 3; i++) out.push(pool[(round * 3 + i) % pool.length])
  return Array.from(new Set(out))
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function GravaBubble({ text }: { text: string }) {
  const { out, done } = useTypewriter(text, 16)
  return (
    <div className="flex items-start gap-2.5">
      <div className="shrink-0 mt-0.5">
        <GravaOrb size={30} />
      </div>
      <div className="bg-paper border border-line rounded-2xl rounded-tl-md px-3.5 py-2.5 shadow-sm max-w-[85%]">
        <p className="text-[13.5px] text-ink leading-relaxed">
          {out}
          {!done && <span className="inline-block w-1.5 h-3.5 -mb-0.5 ml-0.5 bg-aura-2 rounded-sm animate-pulse" />}
        </p>
      </div>
    </div>
  )
}

export default function Personalize() {
  const navigate = useNavigate()
  const { product, variant, theme, estampa, customText, setTheme, setEstampa, setCustomText } = useStore()

  const [phase, setPhase] = useState<Phase>("ask")
  const [round, setRound] = useState(0)
  const [brief, setBrief] = useState("")
  const [options, setOptions] = useState<Estampa[]>([])
  const [reply, setReply] = useState("Criei 3 estampas exclusivas pra você. Toque na sua favorita 👇")
  const [usedAI, setUsedAI] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!product || !variant) navigate("/catalogo")
  }, []) // eslint-disable-line

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (phase === "ask") el.scrollTo({ top: 0, behavior: "smooth" })
    else el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [phase, options, estampa])

  const themeLabel = useMemo(() => THEMES.find((t) => t.id === theme)?.label ?? "", [theme])

  if (!product || !variant) return null

  async function runGenerate(t: ThemeId, nextRound: number) {
    setTheme(t)
    setEstampa(null)
    setRound(nextRound)
    setPhase("thinking")
    const label = THEMES.find((x) => x.id === t)?.label ?? ""

    const [result] = await Promise.all([
      aiGenerateEstampas({
        productName: product!.name,
        color: variant!.name,
        theme: t,
        themeLabel: label,
        brief,
      }).catch(() => null),
      sleep(1600), // minimum "thinking" time for a smooth reveal
    ])

    if (result && result.designs.length) {
      setOptions(result.designs)
      setReply(result.reply)
      setUsedAI(true)
    } else {
      setOptions(localGenerate(t, nextRound))
      setReply("Criei 3 estampas exclusivas pra você. Toque na sua favorita 👇")
      setUsedAI(false)
    }
    setPhase("done")
  }

  return (
    <motion.div className="absolute inset-0 flex flex-col" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
      <TopBar onBack={() => navigate(`/produto/${product.id}`)} title="Personalizar com IA" subtitle={`${product.name} · ${variant.name}`} />
      <Stepper current={1} />

      {/* live preview */}
      <div className="mx-5 mt-1 rounded-3xl border border-line stage h-[28vh] relative overflow-hidden">
        <MockupPreview product={product} variant={variant} estampa={estampa} customText={customText} />
        <div className="absolute top-2.5 left-3 flex items-center gap-1.5 text-[10px] text-[#42566b] bg-white/80 backdrop-blur px-2 py-1 rounded-full border border-black/5">
          <span className={`w-1.5 h-1.5 rounded-full ${estampa ? "bg-mint" : "bg-[#9fb0c0]"}`} />
          {estampa ? "Pré-visualização da arte" : "Aguardando sua arte"}
        </div>
      </div>

      {/* conversation */}
      <div ref={scrollRef} className="flex-1 scroll-y px-5 pt-4 pb-36 space-y-4">
        <GravaBubble
          text={`Oi! Eu sou a Grava ✨ a IA da GRAVA.AI. Você escolheu o ${product.name} na cor ${variant.name.toLowerCase()}. Pra qual ocasião vai ser?`}
        />

        {/* ask controls */}
        <AnimatePresence>
          {phase === "ask" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(theme === t.id ? null : t.id)}
                    className={`px-3 py-2 rounded-full text-[12.5px] font-medium border transition active:scale-95 ${
                      theme === t.id ? "aura-gradient text-[#06131f] border-transparent shadow" : "bg-paper text-ink-soft border-line"
                    }`}
                  >
                    <span className="mr-1">{t.emoji}</span>
                    {t.label}
                  </button>
                ))}
              </div>
              <input
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Conte um detalhe (opcional): cores, tema, nome da empresa…"
                className="w-full bg-paper border border-line rounded-2xl px-4 py-3 text-[13px] text-ink placeholder:text-ink-faint outline-none focus:ring-2 focus:ring-aura-2/40"
              />
              <button
                disabled={!theme}
                onClick={() => theme && runGenerate(theme, 0)}
                className={`w-full py-3.5 rounded-2xl font-display font-semibold text-[15px] flex items-center justify-center gap-2 transition ${
                  theme ? "aura-gradient text-[#06131f] shadow-lg active:scale-[0.98]" : "bg-line text-ink-faint"
                }`}
              >
                <Sparkles size={17} />
                Gerar estampas com IA
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* user message + AI generation */}
        {phase !== "ask" && (
          <>
            <div className="flex justify-end">
              <div className="aura-gradient text-[#06131f] rounded-2xl rounded-tr-md px-3.5 py-2.5 shadow-sm max-w-[85%]">
                <p className="text-[13.5px] leading-relaxed font-medium">
                  Quero algo para <b>{themeLabel.toLowerCase()}</b>
                  {brief.trim() ? `. ${brief.trim()}` : "."}
                </p>
              </div>
            </div>

            {phase === "thinking" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <GravaOrb size={30} thinking />
                  <span className="text-[13px] text-ink-soft">A Grava está criando suas estampas…</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-line">
                      <div className="aspect-[4/3] shimmer" />
                      <div className="p-2 space-y-1.5">
                        <div className="h-2 rounded shimmer" />
                        <div className="h-2 w-2/3 rounded shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {phase === "done" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <GravaBubble text={reply} />
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-aura-2 bg-aura-2/10 border border-aura-2/20 px-2 py-0.5 rounded-full">
                    <Cpu size={11} />
                    {usedAI ? "Gerado por IA · Gemini" : "Estampas inteligentes"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {options.map((e, i) => {
                    const active = estampa?.id === e.id
                    return (
                      <motion.button
                        key={e.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 * i, type: "spring", stiffness: 240, damping: 22 }}
                        onClick={() => setEstampa(e)}
                        className={`relative text-left rounded-2xl overflow-hidden border-2 transition active:scale-95 ${
                          active ? "border-aura-2 shadow-lg" : "border-line"
                        }`}
                      >
                        <div className="aspect-[4/3] relative">
                          <EstampaArt estampa={e} monogram={customText} />
                          {active && (
                            <span className="absolute top-1.5 right-1.5 grid place-items-center w-5 h-5 rounded-full aura-gradient text-[#06131f] shadow">
                              <Check size={13} />
                            </span>
                          )}
                        </div>
                        <div className="p-2 bg-paper">
                          <p className="font-display font-semibold text-ink text-[11.5px] leading-tight">{e.name}</p>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <button onClick={() => runGenerate(theme!, round + 1)} className="flex items-center gap-1.5 text-[12px] font-medium text-aura-2 active:scale-95 transition">
                    <RotateCcw size={13} />
                    Gerar outras opções
                  </button>
                  <button onClick={() => { setPhase("ask"); setEstampa(null) }} className="text-[12px] text-ink-faint underline underline-offset-2">
                    trocar ocasião
                  </button>
                </div>

                {/* picked estampa → tagline + custom text */}
                <AnimatePresence>
                  {estampa && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-1">
                      <GravaBubble text={`Ótima escolha! A "${estampa.name}" — ${estampa.tagline.toLowerCase()} Quer gravar um nome, frase ou logo?`} />
                      <input
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Ex.: Equipe GRAVA · João · #Forever2026 (opcional)"
                        maxLength={22}
                        className="w-full bg-paper border border-line rounded-2xl px-4 py-3 text-[13px] text-ink placeholder:text-ink-faint outline-none focus:ring-2 focus:ring-aura-2/40"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* sticky continue */}
      <AnimatePresence>
        {estampa && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="absolute bottom-0 inset-x-0 p-5 pt-8 bg-gradient-to-t from-cloud via-cloud to-transparent"
          >
            <button
              onClick={() => navigate("/checkout")}
              className="w-full aura-gradient text-[#06131f] font-display font-semibold text-[16px] py-4 rounded-2xl shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              Continuar para o resumo
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
