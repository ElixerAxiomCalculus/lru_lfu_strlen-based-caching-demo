import { useMemo } from 'react'
import type { Policy } from '../lib/types'
export default function StructureViz({ policy, snapshot }: { policy: Policy; snapshot: any }) {
  if (policy === 'LRU') return <LRUList snap={snapshot} />
  return <HeapTree snap={snapshot} />
}
function LRUList({ snap }: { snap: any }) {
  const nodes = (snap?.orderHeadToTail ?? []) as { key: string }[]
  return (
    <div className="relative w-full h-56 bg-neutral-950/70 border border-neutral-800 rounded-2xl p-3 overflow-x-auto">
      <div className="text-xs text-neutral-400 mb-2">LRU List (Head → Tail)</div>
      <div className="flex items-center gap-2 min-w-max">
        {nodes.map((n, i) => (
          <div key={i} className="px-3 py-2 rounded-xl bg-neutral-900/60 border border-neutral-800">{String(n.key)}</div>
        ))}
      </div>
    </div>
  )
}
function HeapTree({ snap }: { snap: any }) {
  const heap = (snap?.heap ?? []) as { key: string }[]
  const levels = useMemo(()=>{
    const arr: number[][] = []
    for (let i=0;i<heap.length;i++){
      const lvl = Math.floor(Math.log2(i+1))
      if(!arr[lvl]) arr[lvl]=[]
      arr[lvl].push(i)
    }
    return arr
  },[heap])
  return (
    <div className="relative w-full h-56 bg-neutral-950/70 border border-neutral-800 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 p-3">
        <div className="text-xs text-neutral-400 mb-2">Heap (level order)</div>
        {levels.map((lvl, li)=>(
          <div key={li} className="flex items-center justify-center gap-3 mb-3">
            {lvl.map(i=>(
              <div key={i} className="px-3 py-2 rounded-xl bg-neutral-900/60 border border-neutral-800 text-sm">{String(heap[i]?.key)}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
