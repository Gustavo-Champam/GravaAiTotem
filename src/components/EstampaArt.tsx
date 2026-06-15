import { useMemo } from "react"
import type { Estampa } from "../data/estampas"
import { hashSeed, seededRandom } from "../lib/utils"

type Props = {
  estampa: Estampa
  /** optional initials to embed (used by the "mono" style) */
  monogram?: string
  className?: string
}

const VW = 120
const VH = 84

/**
 * Renders an estampa as generative SVG art. Deterministic per estampa id,
 * so the same design always looks identical across the app.
 */
export default function EstampaArt({ estampa, monogram, className }: Props) {
  const id = estampa.id
  const rng = useMemo(() => seededRandom(hashSeed(id)), [id])
  const filterId = `blur-${id}`

  const r = (min: number, max: number) => min + rng() * (max - min)
  const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)]
  const pal = estampa.palette

  let content: React.ReactNode = null

  switch (estampa.style) {
    case "mesh": {
      const blobs = Array.from({ length: 6 }, (_, i) => (
        <circle
          key={i}
          cx={r(0, VW)}
          cy={r(0, VH)}
          r={r(26, 48)}
          fill={pal[i % pal.length]}
          opacity={0.85}
        />
      ))
      content = <g filter={`url(#${filterId})`}>{blobs}</g>
      break
    }
    case "grid": {
      const lines: React.ReactNode[] = []
      for (let x = 0; x <= VW; x += 12)
        lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={VH} stroke={pal[1]} strokeWidth={0.6} opacity={0.4} />)
      for (let y = 0; y <= VH; y += 12)
        lines.push(<line key={`h${y}`} x1={0} y1={y} x2={VW} y2={y} stroke={pal[1]} strokeWidth={0.6} opacity={0.4} />)
      content = (
        <g>
          {lines}
          <circle cx={VW * 0.72} cy={VH * 0.36} r={3} fill={pal[0]} />
          <circle cx={VW * 0.28} cy={VH * 0.64} r={3} fill={pal[0]} />
          <line x1={VW * 0.28} y1={VH * 0.64} x2={VW * 0.72} y2={VH * 0.36} stroke={pal[0]} strokeWidth={1.4} />
        </g>
      )
      break
    }
    case "mono": {
      const letter = (monogram?.trim()?.[0] || "G").toUpperCase()
      content = (
        <g>
          <rect x={VW / 2 - 30} y={VH / 2 - 30} width={60} height={60} rx={30} fill="none" stroke={pal[1]} strokeWidth={1} />
          <rect x={VW / 2 - 24} y={VH / 2 - 24} width={48} height={48} rx={24} fill="none" stroke={pal[0]} strokeWidth={0.6} opacity={0.4} />
          <text
            x={VW / 2}
            y={VH / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="Outfit Variable, sans-serif"
            fontWeight={700}
            fontSize={34}
            fill={pal[0]}
          >
            {letter}
          </text>
        </g>
      )
      break
    }
    case "confete": {
      const bits = Array.from({ length: 46 }, (_, i) => {
        const x = r(2, VW - 2)
        const y = r(2, VH - 2)
        const c = pick(pal)
        const t = Math.floor(rng() * 3)
        if (t === 0) return <circle key={i} cx={x} cy={y} r={r(1.2, 2.8)} fill={c} />
        if (t === 1)
          return <rect key={i} x={x} y={y} width={r(2, 4)} height={r(2, 4)} fill={c} transform={`rotate(${r(0, 90)} ${x} ${y})`} />
        return <rect key={i} x={x} y={y} width={r(3, 6)} height={1.4} rx={0.7} fill={c} transform={`rotate(${r(0, 180)} ${x} ${y})`} />
      })
      content = <g>{bits}</g>
      break
    }
    case "ondas": {
      const els: React.ReactNode[] = []
      for (let i = 0; i < 5; i++) {
        const y = (i + 0.5) * (VH / 5)
        const c = pal[i % pal.length]
        let d = `M -4 ${y}`
        for (let x = 0; x <= VW + 8; x += 12) d += ` q 6 -7 12 0 t 12 0`
        els.push(<path key={`w${i}`} d={d} fill="none" stroke={c} strokeWidth={1.6} opacity={0.85} />)
      }
      for (let i = 0; i < 10; i++) els.push(<circle key={`d${i}`} cx={r(0, VW)} cy={r(0, VH)} r={1.6} fill={pick(pal)} />)
      content = <g>{els}</g>
      break
    }
    case "folhas": {
      const sprigs = Array.from({ length: 7 }, (_, i) => {
        const x = r(8, VW - 8)
        const y = r(8, VH - 8)
        const rot = r(-40, 40)
        const c = pick(pal)
        const leaves = Array.from({ length: 5 }, (_, j) => (
          <ellipse key={j} cx={0} cy={-j * 5 - 3} rx={2.4} ry={4} fill={c} opacity={0.9} transform={`rotate(${j % 2 ? 32 : -32} 0 ${-j * 5 - 3})`} />
        ))
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <line x1={0} y1={2} x2={0} y2={-26} stroke={c} strokeWidth={0.8} />
            {leaves}
          </g>
        )
      })
      content = <g>{sprigs}</g>
      break
    }
    case "geolux": {
      const cxp = VW / 2
      const cyp = VH / 2
      const rings = Array.from({ length: 5 }, (_, i) => (
        <polygon
          key={i}
          points={hexPoints(cxp, cyp, 12 + i * 7)}
          fill="none"
          stroke={pal[i % 2]}
          strokeWidth={i === 0 ? 1.4 : 0.7}
          opacity={0.8}
        />
      ))
      const rays = Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <line
            key={`r${i}`}
            x1={cxp + Math.cos(a) * 14}
            y1={cyp + Math.sin(a) * 14}
            x2={cxp + Math.cos(a) * 44}
            y2={cyp + Math.sin(a) * 44}
            stroke={pal[0]}
            strokeWidth={0.5}
            opacity={0.5}
          />
        )
      })
      content = (
        <g>
          {rays}
          {rings}
          <circle cx={cxp} cy={cyp} r={4} fill={pal[1]} />
        </g>
      )
      break
    }
    case "floral": {
      const flowers = Array.from({ length: 9 }, (_, i) => {
        const x = r(8, VW - 8)
        const y = r(8, VH - 8)
        const c = pick(pal)
        const petals = Array.from({ length: 6 }, (_, j) => {
          const a = (j / 6) * Math.PI * 2
          return <ellipse key={j} cx={Math.cos(a) * 3.2} cy={Math.sin(a) * 3.2} rx={2.4} ry={1.3} fill={c} opacity={0.9} transform={`rotate(${(a * 180) / Math.PI})`} />
        })
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            {petals}
            <circle r={1.6} fill={pal[3] ?? "#ffd166"} />
          </g>
        )
      })
      content = <g>{flowers}</g>
      break
    }
    case "tropical": {
      const sun = (
        <g>
          <circle cx={VW * 0.78} cy={VH * 0.28} r={9} fill={pal[0]} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2
            return (
              <line
                key={i}
                x1={VW * 0.78 + Math.cos(a) * 12}
                y1={VH * 0.28 + Math.sin(a) * 12}
                x2={VW * 0.78 + Math.cos(a) * 17}
                y2={VH * 0.28 + Math.sin(a) * 17}
                stroke={pal[0]}
                strokeWidth={1.4}
              />
            )
          })}
        </g>
      )
      const palms = Array.from({ length: 6 }, (_, i) => {
        const x = r(6, VW - 6)
        const y = r(VH * 0.4, VH - 6)
        const c = pick([pal[2], pal[3]])
        const fronds = Array.from({ length: 6 }, (_, j) => {
          const a = (-90 + (j - 2.5) * 26) * (Math.PI / 180)
          return <path key={j} d={`M 0 0 q ${Math.cos(a) * 8} ${Math.sin(a) * 8} ${Math.cos(a) * 16} ${Math.sin(a) * 16}`} fill="none" stroke={c} strokeWidth={1.4} />
        })
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            {fronds}
          </g>
        )
      })
      content = (
        <g>
          {sun}
          {palms}
        </g>
      )
      break
    }
    case "raios": {
      const streaks = Array.from({ length: 16 }, (_, i) => {
        const y = r(0, VH)
        const len = r(20, VW)
        const c = pick(pal)
        return <rect key={i} x={r(-10, VW - len)} y={y} width={len} height={r(0.8, 2.4)} rx={1} fill={c} opacity={0.8} transform={`skewX(-22)`} />
      })
      content = <g>{streaks}</g>
      break
    }
    case "bokeh": {
      const dots = Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={r(0, VW)} cy={r(0, VH)} r={r(2, 12)} fill={pick(pal)} opacity={r(0.2, 0.7)} filter={`url(#${filterId})`} />
      ))
      content = <g>{dots}</g>
      break
    }
    case "flocos": {
      const flakes = Array.from({ length: 12 }, (_, i) => {
        const x = r(6, VW - 6)
        const y = r(6, VH - 6)
        const s = r(2.5, 5)
        const c = pick(pal)
        const arms = Array.from({ length: 6 }, (_, j) => {
          const a = (j / 6) * Math.PI * 2
          return <line key={j} x1={0} y1={0} x2={Math.cos(a) * s} y2={Math.sin(a) * s} stroke={c} strokeWidth={0.7} />
        })
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            {arms}
          </g>
        )
      })
      const stars = Array.from({ length: 10 }, (_, i) => <circle key={`s${i}`} cx={r(0, VW)} cy={r(0, VH)} r={r(0.5, 1.2)} fill="#fff" opacity={0.8} />)
      content = (
        <g>
          {stars}
          {flakes}
        </g>
      )
      break
    }
  }

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" className={className} style={{ display: "block", width: "100%", height: "100%" }}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect x={0} y={0} width={VW} height={VH} fill={estampa.bg} />
      {content}
    </svg>
  )
}

function hexPoints(cx: number, cy: number, rad: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2
    return `${cx + Math.cos(a) * rad},${cy + Math.sin(a) * rad}`
  }).join(" ")
}
