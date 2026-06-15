import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"
import { CATEGORIES, PRODUCTS, type Category } from "../data/products"
import ProductCard from "../components/ProductCard"
import Logo from "../components/Logo"
import { useStore } from "../store/useStore"
import { playTap } from "../lib/sound"

export default function Catalog() {
  const navigate = useNavigate()
  const selectProduct = useStore((s) => s.selectProduct)
  const [cat, setCat] = useState<Category | "Todos">("Todos")

  const list = useMemo(
    () => (cat === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)),
    [cat]
  )

  return (
    <motion.div className="absolute inset-0 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* header */}
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <Logo size={26} />
          <div className="flex items-center gap-1.5 text-[11px] text-ink-soft bg-paper border border-line rounded-full px-3 py-1.5">
            <Sparkles size={13} className="text-aura-2" />
            <span className="font-medium">Personalização com IA</span>
          </div>
        </div>
        <h1 className="font-display font-extrabold text-ink text-[26px] leading-tight mt-4">
          Escolha seu <span className="text-aura">brinde</span>
        </h1>
        <p className="text-ink-faint text-[13px] mt-0.5">A GRAVA.AI deixa o seu brinde com a sua cara.</p>
      </div>

      {/* category chips */}
      <div className="px-5">
        <div className="flex gap-2 overflow-x-auto scroll-y pb-1 -mx-1 px-1">
          {CATEGORIES.map((c) => {
            const active = cat === c.id
            return (
              <button
                key={c.id}
                onClick={() => { playTap(); setCat(c.id) }}
                className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-medium border transition ${
                  active ? "aura-gradient text-[#06131f] border-transparent shadow" : "bg-paper text-ink-soft border-line"
                }`}
              >
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* grid */}
      <div className="flex-1 scroll-y px-5 pt-4 pb-8">
        <div className="grid grid-cols-2 gap-3.5">
          {list.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              onClick={() => {
                playTap()
                selectProduct(p)
                navigate(`/produto/${p.id}`)
              }}
            />
          ))}
        </div>
        <p className="text-center text-ink-faint text-[11px] mt-6">{PRODUCTS.length} produtos · personalização a laser GRAVA.AI</p>
      </div>
    </motion.div>
  )
}
