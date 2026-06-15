import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Minus, Plus, QrCode, CreditCard, ShieldCheck, Loader2, Copy, Check } from "lucide-react"
import { useStore, type PaymentMethod } from "../store/useStore"
import { brl } from "../lib/utils"
import TopBar from "../components/TopBar"
import Stepper from "../components/Stepper"
import MockupPreview from "../components/MockupPreview"
import QRCode from "../components/QRCode"
import { playTap } from "../lib/sound"

export default function Checkout() {
  const navigate = useNavigate()
  const { product, variant, estampa, customText, quantity, setQuantity, theme, method, setMethod, total, placeOrder } = useStore()
  const [paying, setPaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" })

  useEffect(() => {
    if (!product || !variant) navigate("/catalogo", { replace: true })
  }, [product, variant, navigate])

  if (!product || !variant) return null

  const subtotal = total()
  const discount = method === "pix" ? subtotal * 0.05 : 0
  const grandTotal = subtotal - discount

  function finish() {
    playTap()
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
            <button onClick={() => { playTap(); setQuantity(quantity - 1) }} className="grid place-items-center w-9 h-9 rounded-full bg-paper-2 border border-line active:scale-90 transition">
              <Minus size={16} className="text-ink" />
            </button>
            <span className="font-display font-bold text-ink text-[18px] w-7 text-center">{quantity}</span>
            <button onClick={() => { playTap(); setQuantity(quantity + 1) }} className="grid place-items-center w-9 h-9 rounded-full aura-gradient text-[#06131f] active:scale-90 transition">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* payment method */}
        <div>
          <h3 className="font-display font-semibold text-ink text-[14px] mb-2.5 px-1">Forma de pagamento</h3>
          <div className="grid grid-cols-2 gap-3">
            <PayOption active={method === "pix"} onClick={() => { playTap(); setMethod("pix") }} icon={<QrCode size={20} />} title="PIX" hint="5% de desconto" />
            <PayOption active={method === "cartao"} onClick={() => { playTap(); setMethod("cartao") }} icon={<CreditCard size={20} />} title="Cartão" hint="até 12x" />
          </div>

          {/* payment detail */}
          <AnimatePresence mode="wait">
            {method === "pix" ? (
              <motion.div
                key="pix"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-3 bg-paper border border-line rounded-3xl p-4 flex gap-4 items-center"
              >
                <div className="shrink-0 rounded-xl bg-white p-1.5 shadow">
                  <QRCode size={104} seed={`grava-${grandTotal}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-60 animate-ping" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-mint" />
                    </span>
                    <span className="text-[12px] text-ink-soft">Aguardando pagamento</span>
                  </div>
                  <p className="font-display font-bold text-ink text-[15px] mt-1">{brl(grandTotal)}</p>
                  <p className="text-[11px] text-ink-faint leading-snug mt-0.5">Aponte a câmera do seu banco para o QR Code.</p>
                  <button
                    onClick={() => { playTap(); setCopied(true); setTimeout(() => setCopied(false), 1800) }}
                    className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-aura-2 active:scale-95 transition"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "Código copiado!" : "Copiar código PIX"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-3 bg-paper border border-line rounded-3xl p-4 space-y-2.5"
              >
                <CardField label="Número do cartão" value={card.number} onChange={(v) => setCard({ ...card, number: formatCardNumber(v) })} placeholder="0000 0000 0000 0000" inputMode="numeric" maxLength={19} />
                <CardField label="Nome impresso" value={card.name} onChange={(v) => setCard({ ...card, name: v.toUpperCase() })} placeholder="COMO NO CARTÃO" />
                <div className="grid grid-cols-2 gap-2.5">
                  <CardField label="Validade" value={card.exp} onChange={(v) => setCard({ ...card, exp: formatExp(v) })} placeholder="MM/AA" inputMode="numeric" maxLength={5} />
                  <CardField label="CVV" value={card.cvv} onChange={(v) => setCard({ ...card, cvv: v.replace(/\D/g, "").slice(0, 4) })} placeholder="123" inputMode="numeric" maxLength={4} />
                </div>
                <p className="text-[11px] text-ink-faint">Parcele em até 12x de {brl(grandTotal / 12)} sem juros.</p>
              </motion.div>
            )}
          </AnimatePresence>
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

function CardField({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  maxLength,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  inputMode?: "numeric" | "text"
  maxLength?: number
}) {
  return (
    <label className="block">
      <span className="text-[11px] text-ink-faint">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className="w-full mt-1 bg-paper-2 border border-line rounded-xl px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-faint outline-none focus:ring-2 focus:ring-aura-2/40 tracking-wide"
      />
    </label>
  )
}

function formatCardNumber(v: string): string {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
}

function formatExp(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 4)
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}
