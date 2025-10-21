import { useMemo, useRef, useState } from 'react'
import SettingsBar from './components/SettingsBar'
import BrowserSim from './components/BrowserSim'
import CacheVisualizer from './components/CacheVisualizer'
import { createCache } from './lib/caches'
import type { Policy } from './lib/types'

export default function App() {
  const [policy, setPolicy] = useState<Policy>('LRU')
  const [capacity, setCapacity] = useState(5)
  const cacheRef = useRef(createCache<string, string>(policy, capacity))
  const [history, setHistory] = useState<string[]>([])
  const [tick, setTick] = useState(0)
  const [lastAction, setLastAction] = useState('')

  const resetCache = (p: Policy = policy, c: number = capacity) => {
    cacheRef.current = createCache<string, string>(p, c)
    setTick(t => t + 1)
    setLastAction('reset')
  }

  const onPolicy = (p: Policy) => {
    setPolicy(p)
    resetCache(p, capacity)
  }
  const onCapacity = (c: number) => {
    setCapacity(c)
    resetCache(policy, c)
  }
  const onReset = () => resetCache()

  const onVisit = (term: string) => {
    const hit = cacheRef.current.get(term)
    if (hit === undefined) {
      cacheRef.current.put(term, term)
      setLastAction('miss→put ' + term)
    } else {
      setLastAction('hit ' + term)
    }
    setHistory(h => [...h, term])
    setTick(t => t + 1)
  }

  const entries = useMemo(() => cacheRef.current.entries(), [tick])
  const stats = useMemo(() => cacheRef.current.stats(), [tick])
  const snapshot = useMemo(() => cacheRef.current.snapshot(), [tick])

  return (
    <div className="h-screen w-screen grid grid-rows-[auto_1fr] bg-neutral-950 text-neutral-100">
      <SettingsBar policy={policy} onPolicy={onPolicy} capacity={capacity} onCapacity={onCapacity} onReset={onReset} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-0 h-full">
        <div className="border-r border-neutral-800">
          <BrowserSim onVisit={onVisit} history={history} />
        </div>
        <div className="">
          <CacheVisualizer policy={policy} entries={entries} stats={stats} snapshot={snapshot} lastAction={lastAction} />
        </div>
      </div>
    </div>
  )
}