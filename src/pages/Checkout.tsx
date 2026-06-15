import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Minus, Plus, QrCode, CreditCard, ShieldCheck, Loader2 } from "lucide-react"
import { useStore, type PaymentMethod } from "../store/useStore"
import { brl } from "../lib/utils"
import TopBar from "../components/TopBar"
import Stepper from "../components/Stepper"
import MockupPreview from "../components/MockupPreview"

export default function Checkout() {
  const navigate = useNavigate()
  const { product, variant, estampa, customText, quantity, setQuantity, theme, method, setMethod, total, placeOrder } = useStore()
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    if (!product || !variant) navigate("/catalogo", { replace: true })
  }, [product, variant, navigate])

  if (!product || !variant) return null

  const subtotal = total()
  const discount = method === "pix" ? subtotal * 0.05 : 0
  const grandTotal = subtotal - discount

  function finish() {
    setPaying(true)
    setTimeout(() => {
      placeOrder()
      navigate("/sucesso")
    }, 2300)
  }

  return (
    <motion.div className="absolute inset-0 flex flex-col" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
      <TopBar onBack={() => navigate(`/personalizar/${product.id}`)} title="Resumo do pedido" />
      <Stepper current={2} />

      <div className="flex-1 scroll-y px-5 pb-44 pt-1 space-y-4">
        {/* item card */}
        <div className="bg-paper border border-line rounded-3xl p-4 flex gap-3">
          <div className="w-28 h-32 shrink-0 rounded-2xl stage overflow-hidden">
            <MockupPreview product={product} variant={variant} estampa={estampa} customText={customText} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <span className="text-[10px] font-medium text-aura-2 uppercase tracking-wide">{product.category}</span>
            <h2 className="font-display font-bold text-ink text-[16px] leading-tight">{product.name}</h2>
            <dl className="mt-1.5 space-y-0.5 text-[12px]">
              <Row label="Cor / modelo" value={variant.name} />
              {theme && <Row label="Ocasião" value={cap(theme)} />}
              <Row label="Estampa IA" value={estampa?.name ?? "—"} />
              {customText.trim() && <Row label="Gravação" value={`"${customText.trim()}"`} />}
            </dl>
            <div className="mt-auto pt-2 font-display font-bold text-ink text-[15px]">{brl(product.price)}<span className="text-ink-faint font-normal text-[11px]"> /un.</span></div>
          </div>
        </div>

        {/* quantity */}
        <div className="bg-paper border border-line rounded-3xl p-4 flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-ink text-[14px]">Quantidade</h3>
            <p className="text-ink-faint text-[11px]">Brindes em quantidade? A GRAVA.AI cuida disso.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setQuantity(quantity - 1)} className="grid place-items-center w-9 h-9 rounded-full bg-cloud border border-line active:scale-90 transition">
              <Minus size={16} className="text-ink" />
            </button>
            <span className="font-display font-bold text-ink text-[18px] w-7 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="grid place-items-center w-9 h-9 rounded-full aura-gradient text-[#06131f] active:scale-90 transition">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* payment method */}
        <div>
          <h3 className="font-display font-semibold text-ink text-[14px] mb-2.5 px-1">Forma de pagamento</h3>
          <div className="grid grid-cols-2 gap-3">
            <PayOption active={method === "pix"} onClick={() => setMethod("pix")} icon={<QrCode size={20} />} title="PIX" hint="5% de desconto" />
            <PayOption active={method === "cartao"} onClick={() => setMethod("cartao")} icon={<CreditCard size={20} />} title="Cartão" hint="até 12x" />
          </div>
        </div>

        {/* totals */}
        <div className="bg-paper border border-line rounded-3xl p-4 space-y-2">
          <Line label="Subtotal" value={brl(subtotal)} />
          {discount > 0 && <Line label="Desconto PIX (5%)" value={`- ${brl(discount)}`} accent />}
          <Line label="Frete" value="Grátis" />
          <div className="h-px bg-line my-1" />
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-ink text-[16px]">Total</span>
            <span className="font-display font-extrabold text-ink text-[22px]">{brl(grandTotal)}</span>
          </div>
          {method === "cartao" && (
            <p className="text-right text-[11px] text-ink-faint">ou 12x de {brl(grandTotal / 12)}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-faint">
          <ShieldCheck size={13} className="text-mint" />
          Ambiente simulado para demonstração
        </div>
      </div>

      {/* sticky finish */}
      <div className="absolute bottom-0 inset-x-0 p-5 pt-8 bg-gradient-to-t from-cloud via-cloud to-transparent">
        <button
          onClick={finish}
          disabled={paying}
          className="w-full aura-gradient text-[#06131f] font-display font-semibold text-[16px] py-4 rounded-2xl shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-80"
        >
          {paying ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processando pagamento…
            </>
          ) : (
            <>Finalizar compra · {brl(grandTotal)}</>
          )}
        </button>
      </div>

      {/* paying overlay */}
      <AnimatePresence>
        {paying && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 glass grid place-items-center z-20">
            <div className="flex flex-col items-center gap-4">
              {method === "pix" ? <QrCode size={40} className="text-aura-2" /> : <CreditCard size={40} className="text-aura-2" />}
              <Loader2 size={26} className="animate-spin text-ink-soft" />
              <p className="text-ink-soft text-[13px]">{method === "pix" ? "Confirmando o PIX…" : "Autorizando o cartão…"}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="text-ink font-medium text-right truncate">{value}</dd>
    </div>
  )
}

function Line({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-ink-soft">{label}</span>
      <span className={accent ? "text-mint font-medium" : "text-ink font-medium"}>{value}</span>
    </div>
  )
}

function PayOption({ active, onClick, icon, title, hint }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; hint: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl p-3.5 border-2 text-left transition active:scale-[0.97] ${active ? "border-aura-2 bg-aura-1/5" : "border-line bg-paper"}`}
    >
      <div className={`${active ? "text-aura-2" : "text-ink-soft"}`}>{icon}</div>
      <div className="font-display font-semibold text-ink text-[14px] mt-1.5">{title}</div>
      <div className="text-[11px] text-ink-faint">{hint}</div>
    </button>
  )
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
