import { motion } from "framer-motion"

const STEPS = ["Produto", "Personalizar", "Pagamento"]

export default function Stepper({ current }: { current: 0 | 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-2 px-6 py-2">
      {STEPS.map((label, i) => {
        const active = i <= current
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <motion.span
                animate={{ scale: i === current ? 1 : 0.85 }}
                className={`grid place-items-center w-5 h-5 rounded-full text-[10px] font-bold ${
                  active ? "aura-gradient text-[#06131f]" : "bg-line text-ink-faint"
                }`}
              >
                {i + 1}
              </motion.span>
              <span className={`text-[10px] font-medium ${i === current ? "text-ink" : "text-ink-faint"}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <span className={`w-5 h-px ${i < current ? "bg-aura-2" : "bg-line"}`} />}
          </div>
        )
      })}
    </div>
  )
}
