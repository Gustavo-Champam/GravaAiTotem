type Props = {
  size?: number
  withWordmark?: boolean
}

/** GRAVA.AI logo — cyan hexagon "G" mark + wordmark. */
export default function Logo({ size = 28, withWordmark = true }: Props) {
  return (
    <div className="flex items-center gap-2.5">
      <HexMark size={size * 1.18} />
      {withWordmark && (
        <span
          className="font-display font-extrabold tracking-tight leading-none"
          style={{ fontSize: size * 0.92 }}
        >
          <span className="text-ink">GRAVA</span>
          <span className="text-aura">.AI</span>
        </span>
      )}
    </div>
  )
}

/** The hexagon-G badge, recreated as SVG. */
export function HexMark({ size = 34 }: { size?: number }) {
  // pointy-top hexagon
  const pts = "50,3 90.6,26.5 90.6,73.5 50,97 9.4,73.5 9.4,26.5"
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <defs>
        <linearGradient id="hexg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6fe3ff" />
          <stop offset="0.55" stopColor="#2dc5f5" />
          <stop offset="1" stopColor="#169fe6" />
        </linearGradient>
      </defs>
      <polygon points={pts} fill="url(#hexg)" />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Outfit Variable, sans-serif"
        fontWeight={800}
        fontSize="62"
        fill="#0b1320"
      >
        G
      </text>
    </svg>
  )
}
