import { motion } from "framer-motion"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"
import { HexMark } from "../components/Logo"
import { seededRandom } from "../lib/utils"
import { unlockAudio, playTap } from "../lib/sound"

function Particles() {
  const dots = useMemo(() => {
    const rng = seededRandom(99)
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: rng() * 100,
      size: 2 + rng() * 4,
      delay: rng() * 6,
      dur: 7 + rng() * 8,
      drift: (rng() - 0.5) * 30,
    }))
  }, [])
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full"
          style={{ left: `${d.x}%`, bottom: -10, width: d.size, height: d.size, background: "rgba(111,227,255,0.55)", boxShadow: "0 0 8px rgba(45,197,245,0.6)" }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: "-820px", x: d.drift, opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  )
}

export default function Idle() {
  const navigate = useNavigate()

  const start = () => {
    unlockAudio()
    playTap()
    try {
      document.documentElement.requestFullscreen?.().catch(() => {})
    } catch {
      /* fullscreen optional */
    }
    navigate("/catalogo")
  }

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer"
      onClick={start}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* aurora background */}
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(120% 80% at 50% 8%, #0a2a40 0%, #08161f 55%, #050a12 100%)" }} />
      <Particles />
      <motion.div
        className="absolute -z-10 rounded-full aura-gradient"
        style={{ width: "100%", aspectRatio: "1", filter: "blur(60px)", opacity: 0.28, top: "8%", willChange: "transform" }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="pt-16 flex flex-col items-center gap-1">
        <span className="text-aura text-xs tracking-[0.36em] uppercase font-semibold">Personalização inteligente</span>
      </div>

      <div className="flex flex-col items-center gap-7 px-8">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 40px rgba(45,197,245,0.55))" }}
        >
          <HexMark size={120} />
        </motion.div>
        <div>
          <h1 className="font-display font-extrabold text-7xl tracking-tight leading-none">
            <span className="text-white">GRAVA</span>
            <span className="text-aura">.AI</span>
          </h1>
          <p className="text-white/70 text-base mt-4 leading-relaxed max-w-xs">
            Crie brindes únicos com a ajuda da <span className="text-aura font-semibold">inteligência artificial</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 text-white/55 text-sm">
          <Sparkles size={15} className="text-aura-2" />
          <span>Escolha · Personalize com IA · Leve pra casa</span>
        </div>
      </div>

      <div className="pb-16 flex flex-col items-center gap-4">
        <motion.div
          className="px-9 py-4 rounded-full aura-gradient text-[#06131f] font-display font-bold text-lg shadow-2xl"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 10px 40px -10px rgba(45,197,245,.5)",
              "0 14px 60px -8px rgba(111,227,255,.7)",
              "0 10px 40px -10px rgba(45,197,245,.5)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          Toque para começar
        </motion.div>
        <motion.div className="flex gap-1.5" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-aura-2/70" />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
