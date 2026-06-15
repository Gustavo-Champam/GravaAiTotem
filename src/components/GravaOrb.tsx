import { motion } from "framer-motion"

type Props = {
  size?: number
  thinking?: boolean
}

/** "Grava" — the GRAVA.AI assistant, a living cyan gradient orb. */
export default function GravaOrb({ size = 44, thinking = false }: Props) {
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      {/* glow halo */}
      <motion.div
        className="absolute inset-0 rounded-full aura-gradient"
        style={{ filter: "blur(10px)" }}
        animate={{ opacity: thinking ? [0.6, 1, 0.6] : [0.4, 0.7, 0.4], scale: thinking ? [1, 1.25, 1] : [1, 1.1, 1] }}
        transition={{ duration: thinking ? 1.1 : 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* rotating core */}
      <motion.div
        className="relative rounded-full aura-gradient overflow-hidden"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: thinking ? 2.4 : 8, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute rounded-full"
          style={{
            inset: size * 0.18,
            background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0) 55%)",
          }}
        />
        <div
          className="absolute rounded-full bg-white/30"
          style={{ width: size * 0.16, height: size * 0.16, top: size * 0.22, left: size * 0.3 }}
        />
      </motion.div>
    </div>
  )
}
