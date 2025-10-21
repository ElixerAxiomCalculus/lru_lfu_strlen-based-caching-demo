import { useState } from 'react'
import type { Policy } from '../lib/types'
import { clsx } from 'clsx'
type Props = { policy: Policy; onPolicy: (p: Policy) => void; capacity: number; onCapacity: (n: number) => void; onReset: () => void }
export default function SettingsBar({ policy, onPolicy, capacity, onCapacity, onReset }: Props) {
  const [capField, setCapField] = useState(String(capacity))
  const applyCap = () => { const n = parseInt(capField, 10); if (!Number.isNaN(n) && n > 0) onCapacity(n) }
  const Btn = ({ name, value }: { name: string; value: Policy }) => (
    <button data-cursor="hover" onClick={() => onPolicy(value)} className={clsx('px-3 py-2 rounded-xl text-sm transition', policy === value ? 'bg-brand-600 text-white shadow' : 'bg-neutral-800 hover:bg-neutral-700')}>
      {name}
    </button>
  )
  return (
    <div className="flex items-center gap-3 p-3 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur">
      <div className="text-sm text-neutral-300">Policy</div>
      <div className="flex gap-2">
        <Btn name="LRU" value="LRU" />
        <Btn name="LFU" value="LFU" />
        <Btn name="Len+Time" value="STRING_LENGTH_TIME" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-neutral-300">Capacity</span>
        <input data-cursor="hover" value={capField} onChange={e => setCapField(e.target.value)} onBlur={applyCap} onKeyDown={e => { if (e.key === 'Enter') applyCap() }} className="w-20 bg-neutral-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-brand-600" type="number" min={1} />
        <button data-cursor="hover" onClick={onReset} className="px-3 py-2 rounded-xl text-sm bg-neutral-800 hover:bg-neutral-700">Reset</button>
      </div>
    </div>
  )
}
