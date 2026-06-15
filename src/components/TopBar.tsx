import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Logo from "./Logo"

type Props = {
  onBack?: () => void
  title?: string
  subtitle?: string
}

export default function TopBar({ onBack, title, subtitle }: Props) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-3 px-5 pt-5 pb-2">
      {onBack ? (
        <button
          onClick={onBack}
          className="grid place-items-center w-10 h-10 rounded-full bg-paper border border-line shadow-sm active:scale-95 transition"
          aria-label="Voltar"
        >
          <ChevronLeft size={20} className="text-ink" />
        </button>
      ) : (
        <div className="w-10" />
      )}

      <div className="flex-1 min-w-0">
        {title ? (
          <div>
            <h1 className="font-display font-semibold text-ink text-[17px] leading-tight truncate">{title}</h1>
            {subtitle && <p className="text-ink-faint text-[11px] truncate">{subtitle}</p>}
          </div>
        ) : (
          <button onClick={() => navigate("/catalogo")} className="flex items-center">
            <Logo size={24} />
          </button>
        )}
      </div>
      <div className="w-10" />
    </div>
  )
}
