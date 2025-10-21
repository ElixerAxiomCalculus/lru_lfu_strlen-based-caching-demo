import { ShieldCheck, Activity, Wand2, TerminalSquare, Gauge, Binary } from 'lucide-react'
import TiltCard from './TiltCard'
const items = [
  { icon: ShieldCheck, title: 'Deterministic Evictions', sub: 'Tail-safe LRU & min-root heaps' },
  { icon: Activity, title: 'Live Reordering', sub: 'Hit/miss reshuffles & ties' },
  { icon: Wand2, title: 'Cinematic Motion', sub: 'Glows, tilt, parallax' },
  { icon: TerminalSquare, title: 'Op Console', sub: 'Human-readable steps' },
  { icon: Gauge, title: 'Hit Rate Meter', sub: 'Conic progress ring' },
  { icon: Binary, title: 'Heap + List', sub: 'Two data structures' }
]
export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map(({ icon: Icon, title, sub }, i) => (
        <TiltCard key={i}>
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-brand-300" />
            <div className="font-medium">{title}</div>
          </div>
          <div className="text-xs text-neutral-400 mt-1">{sub}</div>
        </TiltCard>
      ))}
    </div>
  )
}
