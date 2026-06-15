import { useEffect, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom"
import Idle from "./pages/Idle"
import Catalog from "./pages/Catalog"
import Product from "./pages/Product"
import Personalize from "./pages/Personalize"
import Checkout from "./pages/Checkout"
import Success from "./pages/Success"
import { useStore } from "./store/useStore"
import { unlockAudio } from "./lib/sound"

const IDLE_TIMEOUT_MS = 90_000 // volta sozinho à tela inicial (totem)

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const reset = useStore((s) => s.reset)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathRef = useRef(location.pathname)
  pathRef.current = location.pathname

  // Kiosk guards: block context menu, unlock audio on first gesture,
  // and auto-return to the idle screen after inactivity.
  useEffect(() => {
    const onCtx = (e: Event) => e.preventDefault()
    const unlockOnce = () => unlockAudio()
    document.addEventListener("contextmenu", onCtx)
    window.addEventListener("pointerdown", unlockOnce, { once: true })

    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        if (pathRef.current !== "/") {
          reset()
          navigate("/")
        }
      }, IDLE_TIMEOUT_MS)
    }
    const activity = ["pointerdown", "keydown", "wheel", "touchstart"]
    activity.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }))
    resetTimer()

    return () => {
      document.removeEventListener("contextmenu", onCtx)
      window.removeEventListener("pointerdown", unlockOnce)
      activity.forEach((e) => window.removeEventListener(e, resetTimer))
      if (timer.current) clearTimeout(timer.current)
    }
  }, [navigate, reset])

  return (
    <div className="totem-room">
      <div className="totem">
        <div className="totem-screen">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Idle />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/produto/:id" element={<Product />} />
              <Route path="/personalizar/:id" element={<Personalize />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/sucesso" element={<Success />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
