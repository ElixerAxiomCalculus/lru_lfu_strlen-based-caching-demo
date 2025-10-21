import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion'
import { ReactNode } from 'react'
export default function TiltCard({ children }: { children: ReactNode }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useTransform(my, v => (0.5 - v) * 12)
  const ry = useTransform(mx, v => (v - 0.5) * 12)
  const sx = useSpring(rx, { stiffness: 100, damping: 16 })
  const sy = useSpring(ry, { stiffness: 100, damping: 16 })
  const onMove = (e: React.MouseEvent) => {
    const r = (e.target as HTMLElement).getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  return (
    <motion.div onMouseMove={onMove} data-cursor="hover" style={{ rotateX: sx, rotateY: sy }} className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4 glow-border">
      {children}
    </motion.div>
  )
}
