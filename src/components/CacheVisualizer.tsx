import type { CacheEntry, Policy } from '../lib/types'
import { MotionConfig, motion, AnimatePresence } from 'framer-motion'

type Props = {
  policy: Policy
  entries: CacheEntry<string, string>[]
  stats: { hits: number; misses: number; puts: number; evictions: number; policy: Policy }
  snapshot: unknown
  lastAction: string
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="px-3 py-2 rounded-xl bg-neutral-800 text-sm">
      <div className="text-neutral-400">{label}</div>
      <div className="text-neutral-100 font-semibold">{value}</div>
    </div>
  )
}

export default function CacheVisualizer({ policy, entries, stats, snapshot, lastAction }: Props) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur">
        <div className="text-sm text-neutral-300">Cache Visualizer</div>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3 border-b border-neutral-800 bg-neutral-900/30">
        <Stat label="Policy" value={policy} />
        <Stat label="Size" value={entries.length} />
        <Stat label="Hits" value={stats.hits} />
        <Stat label="Misses" value={stats.misses} />
        <Stat label="Puts" value={stats.puts} />
        <Stat label="Evictions" value={stats.evictions} />
        <Stat label="Last" value={lastAction || '-'} />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Ordered View</div>
          <MotionConfig transition={{ type: 'spring', stiffness: 400, damping: 35 }}>
            <div className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {entries.map((e) => (
                  <motion.div
                    key={String(e.key)}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="rounded-2xl p-3 bg-[var(--card-bg)] border border-neutral-800 flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <div className="font-semibold text-neutral-100">{String(e.key)}</div>
                      <div className="text-xs text-neutral-400">{e.value}</div>
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-3">
                      {typeof e.freq === 'number' && <span>freq {e.freq}</span>}
                      {typeof e.length === 'number' && <span>len {e.length}</span>}
                      {typeof e.time === 'number' && <span>t {e.time}</span>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </MotionConfig>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Structure Snapshot</div>
          <pre className="text-xs bg-neutral-950 border border-neutral-800 rounded-2xl p-3 overflow-x-auto">{JSON.stringify(snapshot, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}