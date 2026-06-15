import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Product, Variant } from "../data/products"
import type { Estampa } from "../data/estampas"
import EstampaArt from "./EstampaArt"

type Props = {
  product: Product
  variant: Variant
  estampa: Estampa | null
  customText?: string
}

type Box = { l: number; t: number; w: number; h: number }

/**
 * Composites the chosen estampa + custom text onto the real product photo.
 * The overlay is positioned against the *rendered* image box (accounting for
 * object-contain letterboxing) so the print always lands on the product body,
 * regardless of container aspect ratio.
 */
export default function MockupPreview({ product, variant, estampa, customText }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [box, setBox] = useState<Box | null>(null)
  const a = product.print
  const txt = (customText ?? "").trim()

  const measure = useCallback(() => {
    const root = rootRef.current
    const img = imgRef.current
    if (!root || !img || !img.complete || !img.naturalWidth) return
    const cw = root.clientWidth
    const ch = root.clientHeight
    const ar = img.naturalWidth / img.naturalHeight
    let w = cw
    let h = cw / ar
    if (h > ch) {
      h = ch
      w = ch * ar
    }
    setBox({ l: (cw - w) / 2, t: (ch - h) / 2, w, h })
  }, [])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (rootRef.current) ro.observe(rootRef.current)
    return () => ro.disconnect()
  }, [measure, variant.image])

  // overlay rect in px relative to the root
  const rect = box
    ? {
        left: box.l + ((a.cx - a.w / 2) / 100) * box.w,
        top: box.t + ((a.cy - a.h / 2) / 100) * box.h,
        width: (a.w / 100) * box.w,
        height: (a.h / 100) * box.h,
      }
    : null

  return (
    <div ref={rootRef} className="relative w-full h-full">
      <img
        ref={imgRef}
        src={variant.image}
        alt={`${product.name} ${variant.name}`}
        onLoad={measure}
        className="absolute inset-0 w-full h-full object-contain product-shadow select-none"
        draggable={false}
      />

      <AnimatePresence>
        {estampa && rect && product.printStyle === "panel" && (
          <motion.div
            key={estampa.id + variant.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="absolute overflow-hidden"
            style={{
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
              borderRadius: a.round,
              boxShadow: "0 2px 10px rgba(10,28,48,0.16)",
              maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            }}
          >
            <EstampaArt estampa={estampa} monogram={txt} />
            {/* Real shading: overlay the cup photo so its curvature, gloss and
                shadows imprint onto the art — makes it look truly printed on. */}
            <img
              src={variant.image}
              aria-hidden
              draggable={false}
              className="absolute object-contain pointer-events-none"
              style={{
                left: box!.l - rect.left,
                top: box!.t - rect.top,
                width: box!.w,
                height: box!.h,
                mixBlendMode: "soft-light",
                opacity: 0.6,
              }}
            />
            {/* gentle wrap shadow on the sides for cylinder feel */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, rgba(0,0,0,0.22), rgba(0,0,0,0) 26%, rgba(0,0,0,0) 74%, rgba(0,0,0,0.24))",
              }}
            />
            {txt && (
              <div className="absolute inset-0 grid place-items-center px-2">
                <span
                  className="font-display font-bold text-center leading-tight"
                  style={{
                    color: estampa.text,
                    fontSize: Math.max(11, Math.min(rect.height * 0.2, rect.width * 0.14)),
                    textShadow: "0 1px 6px rgba(0,0,0,0.35)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {txt}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {estampa && rect && product.printStyle === "engrave" && (
          <motion.div
            key={"eng" + estampa.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute grid place-items-center"
            style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
          >
            <span
              className="font-display font-semibold whitespace-nowrap"
              style={{
                color: "rgba(255,255,255,0.92)",
                fontSize: Math.max(7, rect.height * 0.7),
                letterSpacing: "0.18em",
                textShadow: "0 1px 2px rgba(0,0,0,0.45)",
              }}
            >
              {txt || "SEU NOME"}
            </span>
          </motion.div>
        )}

        {estampa && rect && product.printStyle === "plate" && (
          <motion.div
            key={"plate" + estampa.id + variant.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="absolute overflow-hidden shadow"
            style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: a.round }}
          >
            <EstampaArt estampa={estampa} monogram={txt} />
            {txt && (
              <div className="absolute inset-0 grid place-items-center">
                <span
                  className="font-display font-bold text-center"
                  style={{ color: estampa.text, fontSize: Math.max(8, rect.height * 0.3), textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
                >
                  {txt}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
