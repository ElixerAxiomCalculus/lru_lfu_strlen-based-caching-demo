import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'
export default function Aurora() {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth)
      my.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])
  const x1 = useTransform(mx, v => `${(v - 0.5) * 40}px`)
  const y1 = useTransform(my, v => `${(v - 0.5) * 40}px`)
  const x2 = useTransform(mx, v => `${(0.5 - v) * 60}px`)
  const y2 = useTransform(my, v => `${(0.5 - v) * 60}px`)
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div style={{ x: x1, y: y1 }} className="absolute -top-24 -left-24 w-[60vw] h-[60vw] rounded-full bg-brand-700/25 blur-3xl" />
      <motion.div style={{ x: x2, y: y2 }} className="absolute -bottom-24 -right-24 w-[50vw] h-[50vw] rounded-full bg-brand-500/25 blur-3xl" />
    </div>
  )
}
