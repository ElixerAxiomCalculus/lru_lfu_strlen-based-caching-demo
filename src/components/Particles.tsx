import { motion } from 'framer-motion'
export default function Particles({ count = 28 }: { count?: number }) {
  const items = Array.from({ length: count })
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {items.map((_, i) => {
        const size = 4 + (i % 5)
        const left = `${(i * 37) % 100}%`
        const delay = (i * 0.35) % 3
        const duration = 6 + (i % 4)
        return (
          <motion.span
            key={i}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '-10%', opacity: [0, 1, 1, 0] }}
            transition={{ delay, duration, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute rounded-full bg-white/10"
            style={{ left, width: size, height: size }}
          />
        )
      })}
    </div>
  )
}
