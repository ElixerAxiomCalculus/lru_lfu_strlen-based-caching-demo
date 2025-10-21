import { useEffect, useRef, useState } from 'react'
export default function NumberTicker({ from = 0, to = 1000, duration = 1600 }: { from?: number; to?: number; duration?: number }) {
  const [val, setVal] = useState(from)
  const start = useRef<number | null>(null)
  useEffect(() => {
    const step = (t: number) => {
      if (start.current === null) start.current = t
      const p = Math.min(1, (t - start.current) / duration)
      const v = Math.floor(from + (to - from) * (1 - Math.cos(p * Math.PI)) / 2)
      setVal(v)
      if (p < 1) requestAnimationFrame(step)
    }
    const id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [from, to, duration])
  return <span>{val.toLocaleString()}</span>
}
