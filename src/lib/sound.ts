// Lightweight UI sound via Web Audio — no asset files. Subtle, totem-friendly.
let ctx: AudioContext | null = null
let enabled = true

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {})
  return ctx
}

/** Call on first user gesture to unlock audio. */
export function unlockAudio() {
  ac()
}

export function setSoundEnabled(v: boolean) {
  enabled = v
}
export function isSoundEnabled() {
  return enabled
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, delay = 0) {
  const c = ac()
  if (!c || !enabled) return
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

/** Soft tap/click. */
export function playTap() {
  tone(420, 0.09, "sine", 0.06)
}

/** Selection / confirm blip. */
export function playSelect() {
  tone(620, 0.1, "triangle", 0.07)
  tone(880, 0.12, "sine", 0.05, 0.04)
}

/** Success chime (order placed). */
export function playSuccess() {
  const notes = [523.25, 659.25, 783.99, 1046.5] // C E G C
  notes.forEach((f, i) => tone(f, 0.35, "sine", 0.08, i * 0.1))
}

/** Soft "thinking" shimmer when AI generates. */
export function playGenerate() {
  tone(300, 0.5, "sine", 0.04)
  tone(450, 0.5, "sine", 0.03, 0.08)
}
