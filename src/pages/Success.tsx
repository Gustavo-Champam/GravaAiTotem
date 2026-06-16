import { useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Check, Home } from "lucide-react"
import { useStore } from "../store/useStore"
import { brl, seededRandom } from "../lib/utils"
import { playSuccess, playTap } from "../lib/sound"
import MockupPreview from "../components/MockupPreview"
import Logo from "../components/Logo"

const COLORS = ["#6e5bff", "#b84dff", "#ff5c93", "#ff9d5c", "#34d399"]

function Confetti() {
  const rng = useMemo(() => seededRandom(7), [])
  const bits = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: rng() * 100,
        delay: rng() * 0.6,
        dur: 2.2 + rng() * 1.8,
        rot: rng() * 360,
        color: COLORS[Math.floor(rng() * COLORS.length)],
        size: 6 + rng() * 8,
      })),
    [rng]
  )
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="absolute top-0 rounded-sm"
          style={{ left: `${b.x}%`, width: b.size, height: b.size * 0.5, background: b.color }}
          initial={{ y: -30, rotate: 0, opacity: 1 }}
          animate={{ y: "820px", rotate: b.rot + 720, opacity: [1, 1, 0.9, 0] }}
          transition={{ duration: b.dur, delay: b.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  )
}

export default function Success() {
  const navigate = useNavigate()
  const order = useStore((s) => s.lastOrder)
  const reset = useStore((s) => s.reset)

  useEffect(() => {
    if (!order) {
      navigate("/catalogo")
      return
    }
    playSuccess()
  }, [order]) // eslint-disable-line

  if (!order) return null

  return (
    <motion.div className="absolute inset-0 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Confetti />

      <div className="flex-1 scroll-y px-6 pt-12 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
          className="grid place-items-center w-20 h-20 rounded-full aura-gradient shadow-xl"
        >
          <Check size={40} className="text-white" strokeWidth={3} />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="font-display font-extrabold text-ink text-[27px] mt-5 leading-tight">
          Compra finalizada!
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-ink-soft text-[13.5px] mt-1.5 max-w-xs">
          Seu brinde personalizado já entrou em produção. Em breve ele estará com a sua cara. 💜
        </motion.p>

        {/* receipt card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 200, damping: 22 }}
          className="w-full bg-paper border border-line rounded-3xl p-5 mt-7 text-left shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <span className="text-[11px] text-ink-faint">Pedido</span>
            <span className="font-display font-bold text-ink tracking-wide">{order.code}</span>
          </div>

          <div className="flex gap-3 py-4">
            <div className="w-24 h-28 shrink-0 rounded-2xl stage overflow-hidden">
              <MockupPreview product={order.product} variant={order.variant} estampa={order.estampa} customText={order.customText} />
            </div>
            <div className="flex-1 min-w-0 text-[12.5px] space-y-1">
              <h2 className="font-display font-bold text-ink text-[15px] leading-tight">{order.product.name}</h2>
              <p className="text-ink-soft">Cor / modelo: <b className="text-ink">{order.variant.name}</b></p>
              {order.estampa && <p className="text-ink-soft">Estampa: <b className="text-ink">{order.estampa.name}</b></p>}
              {order.customText.trim() && <p className="text-ink-soft">Gravação: <b className="text-ink">"{order.customText.trim()}"</b></p>}
              <p className="text-ink-soft">Quantidade: <b className="text-ink">{order.quantity}</b></p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-line">
            <div>
              <div className="text-[11px] text-ink-faint">Pago via {order.method === "pix" ? "PIX" : "Cartão"}</div>
              <div className="flex items-center gap-1 text-[11px] text-mint font-medium">
                <Check size={12} /> Aprovado
              </div>
            </div>
            <span className="font-display font-extrabold text-ink text-[22px]">{brl(order.total - (order.method === "pix" ? order.total * 0.05 : 0))}</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-7 opacity-70">
          <Logo size={22} />
        </motion.div>
      </div>

      {/* sticky new order */}
      <div className="absolute bottom-0 inset-x-0 p-5 pt-8 bg-gradient-to-t from-cloud via-cloud to-transparent">
        <button
          onClick={() => {
            playTap()
            reset()
            navigate("/")
          }}
          className="w-full bg-paper-2 border border-line text-ink font-display font-semibold text-[16px] py-4 rounded-2xl shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <Home size={18} />
          Iniciar novo pedido
        </button>
      </div>
    </motion.div>
  )
}
