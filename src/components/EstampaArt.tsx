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
 * Renders an estampa as generative SVG art. Patterns are dense and evenly
 * distributed (jittered grid) so they read as a finished printed design.
 * Deterministic per estampa id.
 */
export default function EstampaArt({ estampa, monogram, className }: Props) {
  const id = estampa.id
  const filterId = `blur-${id.replace(/[^a-z0-9]/gi, "")}`

  const content = useMemo(() => {
    const rng = seededRandom(hashSeed(id))
    const r = (min: number, max: number) => min + rng() * (max - min)
    const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)] ?? arr[0]
    const pal = estampa.palette.length ? estampa.palette : ["#2dc5f5", "#6fe3ff", "#4f8bff"]

    // evenly-spaced jittered grid covering the full viewBox (with overscan)
    const grid = (cols: number, rows: number, jitter = 0.4): Array<[number, number]> => {
      const pts: Array<[number, number]> = []
      const cw = VW / cols
      const ch = VH / rows
      for (let row = -1; row <= rows; row++) {
        for (let col = -1; col <= cols; col++) {
          const offset = row % 2 === 0 ? 0 : cw / 2 // brick offset for organic feel
          pts.push([(col + 0.5) * cw + offset + (rng() - 0.5) * cw * jitter, (row + 0.5) * ch + (rng() - 0.5) * ch * jitter])
        }
      }
      return pts
    }

    switch (estampa.style) {
      case "mesh": {
        return (
          <g filter={`url(#${filterId})`}>
            {Array.from({ length: 7 }, (_, i) => (
              <circle key={i} cx={r(-10, VW + 10)} cy={r(-10, VH + 10)} r={r(30, 52)} fill={pal[i % pal.length]} opacity={0.9} />
            ))}
          </g>
        )
      }

      case "grid": {
        const lines: React.ReactNode[] = []
        for (let x = 0; x <= VW; x += 11) lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={VH} stroke={pal[1] ?? pal[0]} strokeWidth={0.5} opacity={0.35} />)
        for (let y = 0; y <= VH; y += 11) lines.push(<line key={`h${y}`} x1={0} y1={y} x2={VW} y2={y} stroke={pal[1] ?? pal[0]} strokeWidth={0.5} opacity={0.35} />)
        const dots = grid(8, 6, 0).map(([x, y], i) => <circle key={`d${i}`} cx={x} cy={y} r={1.6} fill={pal[0]} opacity={0.9} />)
        return (
          <g>
            {lines}
            {dots}
          </g>
        )
      }

      case "mono": {
        const letter = (monogram?.trim()?.[0] || "G").toUpperCase()
        const cx = VW / 2
        const cy = VH / 2
        return (
          <g>
            <rect x={cx - 33} y={cy - 33} width={66} height={66} rx={33} fill="none" stroke={pal[1] ?? pal[0]} strokeWidth={1} />
            <rect x={cx - 26} y={cy - 26} width={52} height={52} rx={26} fill="none" stroke={pal[0]} strokeWidth={0.6} opacity={0.45} />
            <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central" fontFamily="Outfit Variable, sans-serif" fontWeight={800} fontSize={38} fill={pal[0]}>
              {letter}
            </text>
          </g>
        )
      }

      case "confete": {
        return (
          <g>
            {grid(9, 6, 0.7).map(([x, y], i) => {
              const c = pick(pal)
              const t = Math.floor(rng() * 3)
              if (t === 0) return <circle key={i} cx={x} cy={y} r={r(1.4, 2.8)} fill={c} />
              if (t === 1) return <rect key={i} x={x} y={y} width={r(2.4, 4)} height={r(2.4, 4)} rx={0.6} fill={c} transform={`rotate(${r(0, 90)} ${x} ${y})`} />
              return <rect key={i} x={x} y={y} width={r(4, 7)} height={1.6} rx={0.8} fill={c} transform={`rotate(${r(0, 180)} ${x} ${y})`} />
            })}
          </g>
        )
      }

      case "ondas": {
        const els: React.ReactNode[] = []
        const rows = 7
        for (let i = 0; i < rows; i++) {
          const y = (i + 0.5) * (VH / rows)
          const c = pal[i % pal.length]
          let d = `M -6 ${y}`
          for (let x = -6; x <= VW + 12; x += 12) d += ` q 6 -6 12 0 t 12 0`
          els.push(<path key={`w${i}`} d={d} fill="none" stroke={c} strokeWidth={1.8} opacity={0.9} strokeLinecap="round" />)
        }
        grid(7, 4, 0.5).forEach(([x, y], i) => els.push(<circle key={`dot${i}`} cx={x} cy={y} r={1.3} fill={pick(pal)} opacity={0.8} />))
        return <g>{els}</g>
      }

      case "folhas": {
        return (
          <g>
            {grid(5, 4, 0.45).map(([x, y], i) => {
              const rot = r(-50, 50)
              const c = pick(pal)
              return (
                <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
                  <line x1={0} y1={6} x2={0} y2={-13} stroke={c} strokeWidth={0.8} opacity={0.85} />
                  {Array.from({ length: 6 }, (_, j) => (
                    <ellipse key={j} cx={0} cy={-j * 3.4 + 4} rx={2.6} ry={4.2} fill={c} opacity={0.85} transform={`rotate(${j % 2 ? 34 : -34} 0 ${-j * 3.4 + 4})`} />
                  ))}
                </g>
              )
            })}
          </g>
        )
      }

      case "geolux": {
        const motif = (cx: number, cy: number, scale: number) => (
          <g key={`${cx}-${cy}`}>
            {Array.from({ length: 3 }, (_, k) => (
              <polygon key={k} points={hexPoints(cx, cy, (6 + k * 5) * scale)} fill="none" stroke={pal[k % 2]} strokeWidth={k === 0 ? 1.1 : 0.6} opacity={0.85} />
            ))}
            <circle cx={cx} cy={cy} r={2 * scale} fill={pal[1] ?? pal[0]} />
          </g>
        )
        return (
          <g>
            {grid(3, 2, 0.15).map(([x, y]) => motif(x, y, 0.85))}
          </g>
        )
      }

      case "floral": {
        const petalColors = pal.slice(0, Math.max(2, pal.length - 1))
        const accent = pal[pal.length - 1] ?? "#ffd166"
        const flower = (cx: number, cy: number, color: string, s: number) => (
          <g key={`f${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
            {Array.from({ length: 6 }, (_, j) => {
              const a = (j / 6) * Math.PI * 2
              return <ellipse key={j} cx={Math.cos(a) * 3 * s} cy={Math.sin(a) * 3 * s} rx={2.6 * s} ry={1.5 * s} fill={color} opacity={0.95} transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 3 * s} ${Math.sin(a) * 3 * s})`} />
            })}
            <circle r={1.7 * s} fill={accent} />
          </g>
        )
        const pts = grid(5, 4, 0.3)
        return (
          <g>
            {/* small leaves between flowers for fullness */}
            {pts.map(([x, y], i) => (
              <ellipse key={`lf${i}`} cx={x + 5} cy={y + 4} rx={1.6} ry={3} fill={accent} opacity={0.5} transform={`rotate(40 ${x + 5} ${y + 4})`} />
            ))}
            {pts.map(([x, y], i) => flower(x, y, petalColors[i % petalColors.length], r(0.85, 1.15)))}
          </g>
        )
      }

      case "tropical": {
        const leaf = (cx: number, cy: number, rot: number, c: string) => (
          <g key={`p${cx}-${cy}`} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
            {Array.from({ length: 7 }, (_, j) => {
              const a = (-90 + (j - 3) * 22) * (Math.PI / 180)
              return <path key={j} d={`M 0 0 q ${Math.cos(a) * 7} ${Math.sin(a) * 7} ${Math.cos(a) * 15} ${Math.sin(a) * 15}`} fill="none" stroke={c} strokeWidth={1.4} strokeLinecap="round" />
            })}
          </g>
        )
        return (
          <g>
            {grid(4, 3, 0.4).map(([x, y], i) => leaf(x, y, r(-40, 40), pick(pal.slice(1))))}
            {grid(5, 4, 0.5).map(([x, y], i) => <circle key={`d${i}`} cx={x} cy={y} r={1.3} fill={pal[0]} opacity={0.6} />)}
          </g>
        )
      }

      case "raios": {
        return (
          <g>
            {Array.from({ length: 22 }, (_, i) => {
              const y = (i / 22) * (VH + 20) - 10
              const c = pick(pal)
              return <rect key={i} x={-20} y={y} width={VW + 60} height={r(1, 3)} rx={1.2} fill={c} opacity={0.8} transform={`skewX(-26)`} />
            })}
          </g>
        )
      }

      case "bokeh": {
        return (
          <g filter={`url(#${filterId})`}>
            {grid(6, 5, 0.8).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r(3, 11)} fill={pick(pal)} opacity={r(0.25, 0.7)} />)}
          </g>
        )
      }

      case "flocos": {
        return (
          <g>
            {grid(6, 4, 0.4).map(([x, y], i) => {
              const s = r(3, 5)
              const c = pick(pal)
              return (
                <g key={i} transform={`translate(${x} ${y})`}>
                  {Array.from({ length: 6 }, (_, j) => {
                    const a = (j / 6) * Math.PI * 2
                    return <line key={j} x1={0} y1={0} x2={Math.cos(a) * s} y2={Math.sin(a) * s} stroke={c} strokeWidth={0.8} strokeLinecap="round" />
                  })}
                </g>
              )
            })}
            {grid(7, 5, 0.7).map(([x, y], i) => <circle key={`s${i}`} cx={x} cy={y} r={0.9} fill={pal[1] ?? "#fff"} opacity={0.7} />)}
          </g>
        )
      }
    }
    return null
  }, [id, estampa.style, estampa.palette, monogram, filterId])

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" className={className} style={{ display: "block", width: "100%", height: "100%" }}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
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
