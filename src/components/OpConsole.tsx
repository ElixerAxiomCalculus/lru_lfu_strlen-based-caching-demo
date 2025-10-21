import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
export type Log = { t: string; op: 'GET'|'PUT'; key: string; status: 'HIT'|'MISS'|'EVICT' }
export default function OpConsole({ logs }: { logs: Log[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{ ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' }) }, [logs])
  const color = (s: Log['status']) => s==='HIT'?'text-emerald-400':s==='MISS'?'text-amber-300':'text-rose-400'
  return (
    <div className="h-52 rounded-2xl bg-neutral-950/70 border border-neutral-800 overflow-hidden">
      <div className="px-3 py-2 text-xs text-neutral-400 border-b border-neutral-800">Operation Console</div>
      <div ref={ref} className="h-[calc(100%-34px)] overflow-y-auto p-3 space-y-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {logs.map((l,i)=>(
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-[12px] font-mono text-neutral-300">
              <span className="text-neutral-500 mr-2">{l.t}</span>
              <span className="text-brand-300 mr-2">{l.op}</span>
              <span className="mr-2">{l.key}</span>
              <span className={color(l.status)}>{l.status}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
