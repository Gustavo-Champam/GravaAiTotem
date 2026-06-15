import { motion } from "framer-motion"
import type { Product } from "../data/products"
import { brl } from "../lib/utils"

type Props = {
  product: Product
  index: number
  onClick: () => void
}

export default function ProductCard({ product, index, onClick }: Props) {
  const cover = product.variants[0].image
  const colorDots = product.variants.filter((v) => v.swatch).slice(0, 6)

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index, type: "spring", stiffness: 260, damping: 26 }}
      whileTap={{ scale: 0.96 }}
      className="group relative text-left bg-paper rounded-3xl p-3 border border-line shadow-[0_8px_24px_-16px_rgba(0,0,0,0.3)] active:shadow-sm"
    >
      {product.badge && (
        <span className="absolute z-10 top-4 left-4 text-[10px] font-semibold tracking-wide uppercase aura-gradient text-[#06131f] px-2.5 py-1 rounded-full shadow">
          {product.badge}
        </span>
      )}
      <div className="relative aspect-square rounded-2xl stage overflow-hidden grid place-items-center">
        <img
          src={cover}
          alt={product.name}
          loading="lazy"
          className="h-[86%] w-[86%] object-contain transition-transform duration-300 group-active:scale-95 group-hover:scale-[1.04]"
          draggable={false}
        />
      </div>
      <div className="px-1 pt-3 pb-1">
        <h3 className="font-display font-semibold text-ink leading-tight text-[15px]">{product.name}</h3>
        <p className="text-ink-faint text-[11px] mt-0.5 line-clamp-1">{product.tagline}</p>
        <div className="flex items-center justify-between mt-2.5">
          <span className="font-display font-bold text-ink text-[15px]">{brl(product.price)}</span>
          <div className="flex -space-x-1">
            {colorDots.map((v) => (
              <span
                key={v.id}
                className="w-3.5 h-3.5 rounded-full ring-2 ring-paper"
                style={{ background: v.swatch }}
              />
            ))}
            {product.variants.length > colorDots.length && colorDots.length > 0 && (
              <span className="text-[9px] text-ink-faint pl-1.5 self-center">+{product.variants.length - colorDots.length}</span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  )
}
