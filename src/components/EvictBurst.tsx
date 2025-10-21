import { motion, AnimatePresence } from 'framer-motion'
export default function EvictBurst({ trigger }: { trigger: number }) {
  const dots = Array.from({ length: 14 })
  return (
    <AnimatePresence>
      {trigger>0 && (
        <motion.div key={trigger} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0 z-20">
          {dots.map((_,i)=>(
            <motion.span key={i} initial={{ opacity: 1, scale: 0, x: 0, y: 0 }} animate={{ opacity: 0, scale: 1, x: (Math.random()*2-1)*260, y: (Math.random()*2-1)*160 }} transition={{ duration: 0.9, ease: 'easeOut' }} className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-brand-400" />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
