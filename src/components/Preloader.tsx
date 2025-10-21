import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => { setShow(false); setTimeout(onDone, 500) }, 2600)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-gradient-to-b from-[#0b0614] to-[#120a1e] flex items-center justify-center overflow-hidden">
          <div className="relative w-[360px] h-[360px]">
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: [0.7, 1.08, 1], opacity: 1 }} transition={{ duration: 1.1, times: [0, 0.7, 1] }} className="absolute inset-0 rounded-[40px] bg-[radial-gradient(ellipse_at_center,rgba(139,61,255,0.28),rgba(0,0,0,0))]" />
            <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }} className="absolute inset-0">
              <div className="absolute inset-0 rounded-[40px] border-4 border-brand-500/20" />
              <div className="absolute inset-4 rounded-[36px] border-4 border-brand-500/25" />
              <div className="absolute inset-8 rounded-[32px] border-4 border-brand-500/20" />
            </motion.div>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }} className="absolute inset-10 rounded-[28px] glow-border" />
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }} className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-300 bg-clip-text text-transparent">CACHE</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }} className="absolute inset-0 flex items-end justify-center pb-6 text-sm text-neutral-300">
              Loading Engine
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
