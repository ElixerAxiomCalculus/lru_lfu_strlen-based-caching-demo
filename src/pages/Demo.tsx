import { useEffect, useMemo, useRef, useState } from 'react'
import SettingsBar from '../components/SettingsBar'
import BrowserSim from '../components/BrowserSim'
import CacheVisualizer from '../components/CacheVisualizer'
import { createCache } from '../lib/caches'
import type { CacheEntry, Policy } from '../lib/types'
import StructureViz from '../components/StructureViz'
import MetricsPanel from '../components/MetricsPanel'
import OpConsole, { Log } from '../components/OpConsole'
import EvictBurst from '../components/EvictBurst'

// This interface defines the expected shape of a cache instance
interface Cache<K, V> {
  get(key: K): V | undefined;
  put(key: K, value: V): void;
  entries(): CacheEntry<K, V>[];
  stats(): { hits: number; misses: number; puts: number; evictions: number; };
  snapshot(): CacheEntry<K, V>[];
}

const TERMS = ['google.com','openai.com','github.com','leetcode','wikipedia','stackoverflow','netflix','amazon','twitter','reddit','coursera','udemy','geeksforgeeks','mdn','gmail']

export default function Demo() {
  const [policy, setPolicy] = useState<Policy>('LRU')
  const [capacity, setCapacity] = useState(6)

  // --- State Management ---
  const cachesRef = useRef<Record<string, Cache<string, string>>>({});
  const cacheRef = useRef<Cache<string, string>>(null!);

  const [allHistories, setAllHistories] = useState<Record<string, string[]>>({})
  const [tick, setTick] = useState(0)
  const [lastAction, setLastAction] = useState('')

  const cacheKey = `${policy}-${capacity}`
  const currentHistory = allHistories[cacheKey] || []

  // --- Autoplay State ---
  const [logs, setLogs] = useState<Log[]>([])
  const [autoplay, setAutoplay] = useState(false)
  const [evictPulse, setEvictPulse] = useState(0)
  const prevEvicts = useRef(0)
  const autoplayCount = useRef(0) // Counter for autoplay limit

  // Effect to switch or create cache instances
  useEffect(() => {
    const key = `${policy}-${capacity}`;
    if (!cachesRef.current[key]) {
      cachesRef.current[key] = createCache<string, string>(policy, capacity);
    }
    cacheRef.current = cachesRef.current[key];
    setLastAction(`switched to ${key}`);
    setTick(t => t + 1);
  }, [policy, capacity]);
  
  // --- Core Logic Functions ---

  const onPolicy = (p: Policy) => { setPolicy(p) };
  const onCapacity = (c: number) => { setCapacity(c) };

  // 1. "Reset" Button Logic (Global Clean Slate)
  const onReset = () => {
    cachesRef.current = {};
    setAllHistories({});
    setPolicy('LRU');
    setCapacity(6); // Reset to default
    setLogs([]);
    setLastAction('Global reset performed.');
  };

  // 2. "Clear Current" Button Logic (Resets active cache)
  const clearCurrentCache = () => {
    const freshCache = createCache<string, string>(policy, capacity);
    cachesRef.current[cacheKey] = freshCache;
    cacheRef.current = freshCache;
    setAllHistories(prev => ({ ...prev, [cacheKey]: [] }));
    setLogs([]);
    setLastAction(`cleared ${cacheKey}`);
    setTick(t => t + 1);
  };

  const onVisit = (term: string) => {
    // --- FIX: Add guard to prevent crash on initial render ---
    if (!cacheRef.current) return;
    // ---
    
    const beforeEvicts = cacheRef.current.stats().evictions
    const hit = cacheRef.current.get(term)
    if (hit === undefined) { 
      cacheRef.current.put(term, term); 
      setLastAction('miss→put ' + term); 
      pushLog('PUT', term, 'MISS') 
    } 
    else { 
      cacheRef.current.put(term, term);
      setLastAction('hit ' + term); 
      pushLog('GET', term, 'HIT') 
    }
    const afterEvicts = cacheRef.current.stats().evictions
    if (afterEvicts > beforeEvicts) { 
      pushLog('PUT', term, 'EVICT'); 
      setEvictPulse(p => p + 1) 
    }
    
    const newHistoryForCache = [term, ...currentHistory.filter(h => h !== term)];
    setAllHistories(prev => ({ ...prev, [cacheKey]: newHistoryForCache }))
    setTick(t => t + 1)
  }

  const removeHistoryItem = (itemToRemove: string) => {
    const newHistory = currentHistory.filter(item => item !== itemToRemove);
    setAllHistories(prev => ({ ...prev, [cacheKey]: newHistory }))
  };

  // 3. "Run Other Inputs" Button Logic
  const runOtherInputsOnCurrent = () => {
    const currentHistorySet = new Set(currentHistory);
    const otherInputs = new Set(
      Object.entries(allHistories)
        .filter(([key]) => key !== cacheKey)
        .flatMap(([, history]) => history)
        .filter(input => !currentHistorySet.has(input))
    );

    const inputsToRun = Array.from(otherInputs);
    if (inputsToRun.length === 0) {
      setLastAction('No new inputs from other caches.');
      return;
    }

    const freshCache = createCache<string, string>(policy, capacity);
    inputsToRun.forEach(term => {
      freshCache.get(term);
      freshCache.put(term, term);
    });

    cachesRef.current[cacheKey] = freshCache;
    cacheRef.current = freshCache;
    setAllHistories(prev => ({ ...prev, [cacheKey]: inputsToRun }));
    setLastAction(`ran ${inputsToRun.length} other inputs on ${cacheKey}`);
    setTick(t => t + 1);
  };

  // 4. "Run History on All" Button Logic
  const runCurrentHistoryOnAll = () => {
    if (currentHistory.length === 0) {
      setLastAction('No history to run.');
      return;
    }

    const updatedHistories = { ...allHistories };

    // Iterate over *all* cache instances
    for (const key in cachesRef.current) {
      // Skip the current one
      if (key === cacheKey) continue;
      
      const [otherPolicy, otherCapacityStr] = key.split('-');
      const otherCapacity = parseInt(otherCapacityStr, 10);
      
      // Create a fresh cache for that policy
      const freshCache = createCache<string, string>(otherPolicy as Policy, otherCapacity);
      
      // Run the current history through it
      currentHistory.forEach(term => {
        freshCache.get(term);
        freshCache.put(term, term);
      });
      
      // Save the new cache state and history
      cachesRef.current[key] = freshCache;
      updatedHistories[key] = [...currentHistory];
    }
    
    setAllHistories(updatedHistories);
    setLastAction(`Ran current history on all other policies.`);
    setTick(t => t + 1);
  };

  // --- Autoplay Logic ---
  const pushLog = (op: 'GET'|'PUT', key: string, status: 'HIT'|'MISS'|'EVICT') => {
    const now = new Date()
    const t = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setLogs(l => [...l.slice(-80), { t, op, key, status }])
  }

  // 5. "Autoplay Limit" Logic
  useEffect(() => {
    if (!autoplay) {
      autoplayCount.current = 0; // Reset counter when autoplay is turned off
      return;
    }

    const maxRuns = capacity * 3;

    const id = setInterval(() => {
      if (autoplayCount.current >= maxRuns) {
        setAutoplay(false); // Stop autoplay
        setLastAction(`Autoplay limit (${maxRuns}) reached.`);
        return;
      }
      
      const k = TERMS[Math.floor(Math.random()*TERMS.length)]
      onVisit(k);
      autoplayCount.current += 1; // Increment counter

    }, 900);
    return () => clearInterval(id);
  }, [autoplay, policy, capacity]); // Dependencies

  // --- Memoized Data (for performance) ---
  const entries: CacheEntry<string, string>[] = useMemo(() => {
    if (!cacheRef.current) return [];
    return cacheRef.current.entries();
  }, [tick, policy, capacity]);

  const stats = useMemo(() => {
    const baseStats = cacheRef.current
      ? cacheRef.current.stats()
      : { hits: 0, misses: 0, puts: 0, evictions: 0 };
    return { ...baseStats, policy: policy };
  }, [tick, policy, capacity]);

  const snapshot: CacheEntry<string, string>[] = useMemo(() => {
    if (!cacheRef.current) return [];
    return cacheRef.current.snapshot();
  }, [tick, policy, capacity]);

  const hasOtherInputs = useMemo(() => {
    const currentHistorySet = new Set(currentHistory);
    const otherInputs = Object.entries(allHistories)
      .filter(([key]) => key !== cacheKey)
      .flatMap(([, history]) => history);
    return otherInputs.some(input => !currentHistorySet.has(input));
  }, [allHistories, cacheKey]);

  // Condition for the new button
  const showRunHistoryOnAllButton = useMemo(() => {
    // --- FIX: Use the already-memoized 'stats' object ---
    // This prevents a crash and is more efficient.
    return stats.puts > 0;
  }, [stats]); // <-- Dependency is now 'stats'

  useEffect(() => {
    if (stats.evictions !== prevEvicts.current) { setEvictPulse(p => p + 1); prevEvicts.current = stats.evictions }
  }, [stats.evictions]);

  // --- Rendering ---
  return (
    <div className="h-screen w-screen grid grid-rows-[auto_1fr] bg-neutral-950 text-neutral-100 relative font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        html { font-family: 'Inter', sans-serif; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
      <SettingsBar policy={policy} onPolicy={onPolicy} capacity={capacity} onCapacity={onCapacity} onReset={onReset} />
      <EvictBurst trigger={evictPulse} />
      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-0 h-full">
        <div className="border-r border-neutral-800 grid grid-rows-[1fr_auto]">
          <BrowserSim
            onVisit={onVisit}
            history={currentHistory}
            onRemoveItem={removeHistoryItem}
            onClearAll={clearCurrentCache}
            onRunAllInputs={runOtherInputsOnCurrent}
            hasOtherInputs={hasOtherInputs}
            onRunHistoryOnAll={runCurrentHistoryOnAll}
            showRunHistoryOnAllButton={showRunHistoryOnAllButton}
          />
          <div className="p-3 border-t border-neutral-800 bg-neutral-900/60">
            <div className="grid grid-cols-3 gap-3">
              <button data-cursor="hover" onClick={()=>setAutoplay(a=>!a)} className={`px-3 py-2 rounded-xl text-sm ${autoplay?'bg-emerald-600 text-white':'bg-neutral-800 hover:bg-neutral-700'}`}>{autoplay ? 'Stop Autoplay' : 'Start Autoplay'}</button>
              <button data-cursor="hover" onClick={()=>onVisit(TERMS[Math.floor(Math.random()*TERMS.length)])} className="px-3 py-2 rounded-xl text-sm bg-brand-600 text-white">Random Visit</button>
              <button data-cursor="hover" onClick={clearCurrentCache} className="px-3 py-2 rounded-xl text-sm bg-neutral-800 hover:bg-neutral-700">Clear Current</button>
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

