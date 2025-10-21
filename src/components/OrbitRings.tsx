import { motion } from 'framer-motion'
export default function OrbitRings() {
  return (
    <div className="absolute right-6 bottom-6 w-40 h-40">
      <div className="absolute inset-0 rounded-full border border-brand-600/20" />
      <motion.div className="absolute inset-3 rounded-full border border-brand-500/20" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 12, ease: 'linear' }} />
      <motion.div className="absolute inset-6 rounded-full border border-brand-400/20" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 18, ease: 'linear' }} />
      <motion.div className="absolute left-1/2 top-0 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-400" animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} />
    </div>
  )
}
