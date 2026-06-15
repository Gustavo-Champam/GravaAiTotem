import { AnimatePresence } from "framer-motion"
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import Idle from "./pages/Idle"
import Catalog from "./pages/Catalog"
import Product from "./pages/Product"
import Personalize from "./pages/Personalize"
import Checkout from "./pages/Checkout"
import Success from "./pages/Success"

export default function App() {
  const location = useLocation()

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
