import { useMemo } from 'react'
export default function MetricsPanel({ hits, misses, size, capacity }: { hits: number; misses: number; size: number; capacity: number }) {
  const rate = useMemo(()=>{
    const total = hits + misses
    return total ? Math.round((hits/total)*100) : 0
  },[hits, misses])
  const fill = (v:number)=>({ background: `conic-gradient(#8b3dff ${v*3.6}deg, #1f1b29 0deg)` })
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-3 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full grid place-items-center" style={fill(rate)}>
          <div className="w-12 h-12 rounded-full bg-neutral-950 grid place-items-center text-sm">{rate}%</div>
        </div>
        <div className="text-xs text-neutral-400 mt-2">Hit Rate</div>
      </div>
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-3 flex flex-col items-center">
        <div className="text-xl font-bold">{hits}</div>
        <div className="text-xs text-neutral-400 mt-1">Hits</div>
      </div>
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-3 flex flex-col items-center">
        <div className="text-xl font-bold">{misses}</div>
        <div className="text-xs text-neutral-400 mt-1">Misses</div>
      </div>
      <div className="col-span-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 p-3 flex items-center justify-between">
        <div className="text-xs text-neutral-400">Usage</div>
        <div className="flex-1 mx-3 h-2 rounded-full bg-neutral-800 overflow-hidden">
          <div className="h-full bg-brand-600" style={{ width: `${Math.min(100, (size/capacity)*100)}%` }} />
        </div>
        <div className="text-xs">{size}/{capacity}</div>
      </div>
    </div>
  )
}
