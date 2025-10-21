import { useEffect, useMemo, useRef, useState } from 'react'
import SettingsBar from '../components/SettingsBar'
import BrowserSim from '../components/BrowserSim'
import CacheVisualizer from '../components/CacheVisualizer'
import { createCache } from '../lib/caches'
import type { Policy } from '../lib/types'
import StructureViz from '../components/StructureViz'
import MetricsPanel from '../components/MetricsPanel'
import OpConsole, { Log } from '../components/OpConsole'
import EvictBurst from '../components/EvictBurst'

const TERMS = ['google.com','openai.com','github.com','leetcode','wikipedia','stackoverflow','netflix','amazon','twitter','reddit','coursera','udemy','geeksforgeeks','mdn','gmail']

export default function Demo() {
  const [policy, setPolicy] = useState<Policy>('LRU')
  const [capacity, setCapacity] = useState(6)
  const cacheRef = useRef(createCache<string, string>(policy, capacity))
  const [history, setHistory] = useState<string[]>([])
  const [tick, setTick] = useState(0)
  const [lastAction, setLastAction] = useState('')
  const [logs, setLogs] = useState<Log[]>([])
  const [autoplay, setAutoplay] = useState(false)
  const [evictPulse, setEvictPulse] = useState(0)
  const prevEvicts = useRef(0)

  const resetCache = (p: Policy = policy, c: number = capacity) => {
    cacheRef.current = createCache<string, string>(p, c)
    setTick(t => t + 1)
    setLastAction('reset')
    setLogs([])
    prevEvicts.current = 0
  }
  const onPolicy = (p: Policy) => { setPolicy(p); resetCache(p, capacity) }
  const onCapacity = (c: number) => { setCapacity(c); resetCache(policy, c) }
  const onReset = () => resetCache()

  const onVisit = (term: string) => {
    const beforeEvicts = cacheRef.current.stats().evictions
    const hit = cacheRef.current.get(term)
    if (hit === undefined) { cacheRef.current.put(term, term); setLastAction('miss→put ' + term); pushLog('PUT', term, 'MISS') } 
    else { setLastAction('hit ' + term); pushLog('GET', term, 'HIT') }
    const afterEvicts = cacheRef.current.stats().evictions
    if (afterEvicts > beforeEvicts) { pushLog('PUT', term, 'EVICT'); setEvictPulse(p => p + 1) }
    setHistory(h => [...h, term])
    setTick(t => t + 1)
  }

  const pushLog = (op: 'GET'|'PUT', key: string, status: 'HIT'|'MISS'|'EVICT') => {
    const now = new Date()
    const t = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setLogs(l => [...l.slice(-80), { t, op, key, status }])
  }

  useEffect(() => {
    if (!autoplay) return
    const id = setInterval(() => {
      const k = TERMS[Math.floor(Math.random()*TERMS.length)]
      onVisit(k)
    }, 900)
    return () => clearInterval(id)
  }, [autoplay, policy, capacity])

  const entries = useMemo(() => cacheRef.current.entries(), [tick])
  const stats = useMemo(() => cacheRef.current.stats(), [tick])
  const snapshot = useMemo(() => cacheRef.current.snapshot(), [tick])

  useEffect(() => {
    if (stats.evictions !== prevEvicts.current) { setEvictPulse(p => p + 1); prevEvicts.current = stats.evictions }
  }, [stats.evictions])

  return (
    <div className="h-screen w-screen grid grid-rows-[auto_1fr] bg-neutral-950 text-neutral-100 relative">
      <SettingsBar policy={policy} onPolicy={onPolicy} capacity={capacity} onCapacity={onCapacity} onReset={onReset} />
      <EvictBurst trigger={evictPulse} />
      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-0 h-full">
        <div className="border-r border-neutral-800 grid grid-rows-[1fr_auto]">
          <BrowserSim onVisit={onVisit} history={history} />
          <div className="p-3 border-t border-neutral-800 bg-neutral-900/60">
            <div className="grid grid-cols-3 gap-3">
              <button data-cursor="hover" onClick={()=>setAutoplay(a=>!a)} className={`px-3 py-2 rounded-xl text-sm ${autoplay?'bg-emerald-600 text-white':'bg-neutral-800 hover:bg-neutral-700'}`}>{autoplay ? 'Stop Autoplay' : 'Start Autoplay'}</button>
              <button data-cursor="hover" onClick={()=>onVisit(TERMS[Math.floor(Math.random()*TERMS.length)])} className="px-3 py-2 rounded-xl text-sm bg-brand-600 text-white">Random Visit</button>
              <button data-cursor="hover" onClick={onReset} className="px-3 py-2 rounded-xl text-sm bg-neutral-800 hover:bg-neutral-700">Clear</button>
            </div>
            <div className="mt-3">
              <OpConsole logs={logs} />
            </div>
          </div>
        </div>
        <div className="grid grid-rows-[auto_auto_1fr]">
          <div className="p-3 border-b border-neutral-800 bg-neutral-900/60">
            <MetricsPanel hits={stats.hits} misses={stats.misses} size={entries.length} capacity={capacity} />
          </div>
          <div className="p-3 border-b border-neutral-800">
            <StructureViz policy={stats.policy} snapshot={snapshot} />
          </div>
          <div className="">
            <CacheVisualizer policy={policy} entries={entries} stats={stats} snapshot={snapshot} lastAction={lastAction} />
          </div>
        </div>
      </div>
    </div>
  )
}
