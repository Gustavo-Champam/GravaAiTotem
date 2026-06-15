import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"
import { Check, Sparkles } from "lucide-react"
import { getProduct } from "../data/products"
import { useStore } from "../store/useStore"
import { brl } from "../lib/utils"
import TopBar from "../components/TopBar"
import Stepper from "../components/Stepper"

export default function Product() {
  const navigate = useNavigate()
  const { id } = useParams()
  const product = getProduct(id)
  const variant = useStore((s) => s.variant)
  const setVariant = useStore((s) => s.setVariant)
  const selectProduct = useStore((s) => s.selectProduct)

  // Keep store in sync with the route (handles deep-links / refresh) — in an
  // effect, never during render.
  useEffect(() => {
    if (!product) {
      navigate("/catalogo", { replace: true })
      return
    }
    const inStore = useStore.getState().product
    if (!inStore || inStore.id !== product.id) {
      selectProduct(product)
    }
  }, [product, navigate, selectProduct])

  if (!product) return null

  const current = variant && product.variants.find((v) => v.id === variant.id) ? variant : product.variants[0]

  return (
    <motion.div className="absolute inset-0 flex flex-col" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
      <TopBar onBack={() => navigate("/catalogo")} />
      <Stepper current={0} />

      <div className="flex-1 scroll-y px-5 pb-40 pt-1">
        {/* hero image */}
        <div className="relative stage rounded-3xl border border-line p-4 h-[40vh] grid place-items-center overflow-hidden">
          {product.badge && (
            <span className="absolute z-10 top-4 left-4 text-[10px] font-semibold tracking-wide uppercase aura-gradient text-[#06131f] px-2.5 py-1 rounded-full shadow">
              {product.badge}
            </span>
          )}
          <AnimatePresence mode="popLayout">
            <motion.img
              key={current.id}
              src={current.image}
              alt={`${product.name} ${current.name}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.28 }}
              className="max-h-[90%] max-w-[80%] object-contain product-shadow"
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* title + price */}
        <div className="flex items-start justify-between mt-5 gap-3">
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-aura-2 uppercase tracking-wide">{product.category}</span>
            <h1 className="font-display font-extrabold text-ink text-[23px] leading-tight">{product.name}</h1>
            <p className="text-ink-faint text-[13px] mt-0.5">{product.tagline}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display font-extrabold text-ink text-[22px]">{brl(product.price)}</div>
            <div className="text-[10px] text-ink-faint">à vista no PIX</div>
          </div>
        </div>

        {/* variants */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="font-display font-semibold text-ink text-[14px]">
              {product.variants.some((v) => v.swatch) ? "Cor" : "Modelo"}
            </h2>
            <span className="text-[12px] text-ink-soft">{current.name}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const active = v.id === current.id
              return (
                <button
                  key={v.id}
                  onClick={() => setVariant(v)}
                  className={`relative rounded-2xl transition active:scale-95 ${active ? "ring-2 ring-aura-2" : "ring-1 ring-line"}`}
                >
                  {v.swatch ? (
                    <span className="grid place-items-center w-11 h-11 rounded-2xl" style={{ background: v.swatch }}>
                      {active && <Check size={18} className="text-white drop-shadow" />}
                    </span>
                  ) : (
                    <span className="grid place-items-center w-11 h-11 rounded-2xl stage overflow-hidden">
                      <img src={v.image} alt={v.name} className="w-9 h-9 object-contain" draggable={false} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* specs */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          {product.specs.map((s) => (
            <div key={s} className="flex items-center gap-2 bg-paper border border-line rounded-xl px-3 py-2.5">
              <Check size={14} className="text-mint shrink-0" />
              <span className="text-[12px] text-ink-soft">{s}</span>
            </div>
          ))}
        </div>

        {/* description */}
        <p className="text-ink-soft text-[13px] leading-relaxed mt-5">{product.description}</p>
      </div>

      {/* sticky CTA */}
      <div className="absolute bottom-0 inset-x-0 p-5 pt-8 bg-gradient-to-t from-cloud via-cloud to-transparent">
        <button
          onClick={() => navigate(`/personalizar/${product.id}`)}
          className="w-full aura-gradient text-[#06131f] font-display font-semibold text-[16px] py-4 rounded-2xl shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <Sparkles size={18} />
          Personalizar com IA
        </button>
      </div>
    </motion.div>
  )
}
