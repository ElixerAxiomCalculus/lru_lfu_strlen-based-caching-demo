import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
export default function Cursor() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const xs = useSpring(x, { stiffness: 500, damping: 40 })
  const ys = useSpring(y, { stiffness: 500, damping: 40 })
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState(false)
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    const down = () => setActive(true)
    const up = () => setActive(false)
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null
      const isHover = !!el && !!el.closest('a, button, input, [data-cursor="hover"]')
      setHover(isHover)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    window.addEventListener('mouseover', over, true)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('mouseover', over, true)
    }
  }, [x, y])
  const size = hover ? 24 : 18
  const ring = hover ? 52 : 42
  const ringOpacity = active ? 0.35 : 0.5
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <motion.div style={{ translateX: xs, translateY: ys }} className="absolute">
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div className="absolute -inset-6 rounded-full bg-brand-600/10 blur-xl" />
          <div className="absolute -inset-12 rounded-full bg-brand-400/5 blur-[36px]" />
          <motion.div animate={{ width: ring, height: ring, opacity: ringOpacity }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="rounded-full border border-brand-400/40" />
          <motion.div animate={{ width: size, height: size, scale: active ? 0.85 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="rounded-full bg-brand-500" />
        </div>
      </motion.div>
    </div>
  )
}
