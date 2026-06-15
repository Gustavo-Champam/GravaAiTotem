/** Format a number as Brazilian Real. */
export function brl(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

/** Tiny seeded PRNG (mulberry32) so generated art is stable per seed. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Hash a string into a 32-bit int (for seeding). */
export function hashSeed(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

/** Relative luminance (0=black, 1=white) of a hex color. */
export function luminance(hex: string): number {
  const c = (hex || "").replace("#", "")
  const n = c.length === 3 ? c.split("").map((x) => x + x).join("") : c
  if (n.length < 6) return 0.5
  const ch = (i: number) => parseInt(n.slice(i, i + 2), 16) / 255
  const lin = (x: number) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(ch(0)) + 0.7152 * lin(ch(2)) + 0.0722 * lin(ch(4))
}

/** WCAG-style contrast ratio between two hex colors (1..21). */
export function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a)
  const l2 = luminance(b)
  const hi = Math.max(l1, l2)
  const lo = Math.min(l1, l2)
  return (hi + 0.05) / (lo + 0.05)
}

export function isDark(hex: string): boolean {
  return luminance(hex) < 0.42
}

