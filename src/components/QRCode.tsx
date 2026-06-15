import { useMemo } from "react"
import { hashSeed, seededRandom } from "../lib/utils"

/**
 * Decorative QR — looks like a real PIX QR (finder patterns + data modules)
 * for the demo. Not scannable. Deterministic per seed.
 */
export default function QRCode({ size = 168, seed = "grava-pix" }: { size?: number; seed?: string }) {
  const N = 25
  const quiet = 2
  const total = N + quiet * 2

  const modules = useMemo(() => {
    const rng = seededRandom(hashSeed(seed))
    const inBox = (r: number, c: number, br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7
    const isFinderZone = (r: number, c: number) =>
      inBox(r, c, 0, 0) || inBox(r, c, 0, N - 7) || inBox(r, c, N - 7, 0)
    const finderOn = (r: number, c: number) => {
      const local = (br: number, bc: number) => {
        const lr = r - br
        const lc = c - bc
        const ring = lr === 0 || lr === 6 || lc === 0 || lc === 6
        const inner = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4
        return ring || inner
      }
      if (r < 7 && c < 7) return local(0, 0)
      if (r < 7 && c >= N - 7) return local(0, N - 7)
      if (r >= N - 7 && c < 7) return local(N - 7, 0)
      return false
    }
    const cells: Array<[number, number]> = []
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const on = isFinderZone(r, c) ? finderOn(r, c) : rng() > 0.52
        if (on) cells.push([r, c])
      }
    }
    return cells
  }, [seed])

  return (
    <svg width={size} height={size} viewBox={`0 0 ${total} ${total}`} shapeRendering="crispEdges" style={{ display: "block", borderRadius: 12 }}>
      <rect x={0} y={0} width={total} height={total} fill="#ffffff" />
      {modules.map(([r, c], i) => (
        <rect key={i} x={c + quiet} y={r + quiet} width={1} height={1} fill="#0b1320" />
      ))}
    </svg>
  )
}
