import { useEffect, useRef, useState } from "react"

/**
 * Reveal `text` character-by-character. Restarts whenever `text` changes.
 * `start` gates the animation (e.g. wait until the bubble is mounted).
 */
export function useTypewriter(text: string, speed = 26, start = true) {
  const [out, setOut] = useState("")
  const [done, setDone] = useState(false)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    setOut("")
    setDone(false)
    if (!start || !text) {
      if (!text) setDone(true)
      return
    }
    let i = 0
    let last = performance.now()
    const tick = (now: number) => {
      if (now - last >= speed) {
        i++
        setOut(text.slice(0, i))
        last = now
      }
      if (i < text.length) {
        raf.current = requestAnimationFrame(tick)
      } else {
        setDone(true)
      }
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [text, speed, start])

  return { out, done }
}
