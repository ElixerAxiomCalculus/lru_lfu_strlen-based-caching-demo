import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
type Item = { id: string; label: string; freq: number; len: number; t: number }
type Policy = 'LRU' | 'LFU' | 'LEN_TIME'
function order(items: Item[], p: Policy) {
  if (p === 'LFU') return items.slice().sort((a,b)=>a.freq===b.freq?a.t-b.t:a.freq-b.freq)
  if (p === 'LEN_TIME') return items.slice().sort((a,b)=>a.len===b.len?a.t-b.t:a.len-b.len)
  return items.slice().sort((a,b)=>b.t-a.t)
}
export default function MiniSim() {
  const [policy, setPolicy] = useState<Policy>('LRU')
  const [t, setT] = useState(6)
  const [items, setItems] = useState<Item[]>([
    { id: 'a', label: 'google.com', freq: 3, len: 10, t: 6 },
    { id: 'b', label: 'leetcode', freq: 2, len: 8, t: 5 },
    { id: 'c', label: 'openai', freq: 1, len: 6, t: 4 },
    { id: 'd', label: 'github', freq: 4, len: 6, t: 3 },
    { id: 'e', label: 'stackoverflow', freq: 1, len: 13, t: 2 }
  ])
  const ordered = useMemo(()=>order(items, policy),[items, policy])
  useEffect(()=>{
    const id = setInterval(()=>{
      setItems(prev=>{
        const idx = Math.floor(Math.random()*prev.length)
        const cp = prev.slice()
        const it = { ...cp[idx] }
        it.t = t + 1
        it.freq += 1
        cp[idx] = it
        return cp
      })
      setT(x=>x+1)
    }, 1600)
    return ()=>clearInterval(id)
  },[t])
  const btn = (name: string, val: Policy) => (
    <button onClick={()=>setPolicy(val)} data-cursor="hover" className={`px-3 py-1.5 rounded-xl text-xs ${policy===val?'bg-brand-600 text-white':'bg-neutral-800'} border border-neutral-700`}>{name}</button>
  )
  return (
    <div className="h-full w-full rounded-2xl border border-neutral-800 p-4 bg-[var(--panel-bg)] glow-border">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-neutral-300">Policy Preview</div>
        <div className="flex gap-2">{btn('LRU','LRU')}{btn('LFU','LFU')}{btn('Len+Time','LEN_TIME')}</div>
      </div>
      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {ordered.map(it=>(
            <motion.div key={it.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center justify-between rounded-xl bg-neutral-900/60 border border-neutral-800 px-3 py-2">
              <div className="text-sm">{it.label}</div>
              <div className="text-[10px] text-neutral-400 flex gap-3">
                <span>freq {it.freq}</span>
                <span>len {it.len}</span>
                <span>t {it.t}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
