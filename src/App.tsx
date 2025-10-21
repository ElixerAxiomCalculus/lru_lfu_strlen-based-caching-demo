import { useMemo, useRef, useState, useEffect } from 'react'
import SettingsBar from './components/SettingsBar'
import BrowserSim from './components/BrowserSim'
import CacheVisualizer from './components/CacheVisualizer'
import { createCache } from './lib/caches'
import type { CacheEntry, Policy } from './lib/types'
import { X } from 'lucide-react'

export default function App() {
  const [policy, setPolicy] = useState<Policy>('LRU')
  const [capacity, setCapacity] = useState(5)

  // --- FIX: Use a specific type for the cache refs to resolve generic type errors ---
  const cachesRef = useRef<Record<string, ReturnType<typeof createCache<string, string>>>>({});
  const cacheRef = useRef<ReturnType<typeof createCache<string, string>>>(null!);
  // ---

  const [allHistories, setAllHistories] = useState<Record<string, string[]>>({})
  const [tick, setTick] = useState(0)
  const [lastAction, setLastAction] = useState('')

  const cacheKey = `${policy}-${capacity}`
  const currentHistory = allHistories[cacheKey] || []

  useEffect(() => {
    const key = `${policy}-${capacity}`;
    if (!cachesRef.current[key]) {
      cachesRef.current[key] = createCache<string, string>(policy, capacity);
    }
    cacheRef.current = cachesRef.current[key];
    setLastAction(`switched to ${key}`);
    setTick(t => t + 1);
  }, [policy, capacity]);
  
  const runOtherInputsOnCurrent = () => {
    const otherInputs = new Set(
      Object.entries(allHistories)
        .filter(([key]) => key !== cacheKey)
        .flatMap(([, history]) => history)
    );

    const inputsToRun = Array.from(otherInputs);

    if (inputsToRun.length === 0) {
      setLastAction('No inputs from other caches to run.');
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

  const onPolicy = (p: Policy) => { setPolicy(p) };
  const onCapacity = (c: number) => { setCapacity(c) };

  const onReset = () => {
    cachesRef.current = {};
    setAllHistories({});
    setPolicy('LRU');
    setCapacity(5);
  };

  const onVisit = (term: string) => {
    const hit = cacheRef.current.get(term)
    if (hit === undefined) {
      cacheRef.current.put(term, term)
      setLastAction('miss→put ' + term)
    } else {
      cacheRef.current.put(term, term)
      setLastAction('hit ' + term)
    }
    const newHistoryForCache = [term, ...currentHistory.filter(h => h !== term)];
    setAllHistories(prev => ({ ...prev, [cacheKey]: newHistoryForCache }))
    setTick(t => t + 1)
  }

  const removeHistoryItem = (itemToRemove: string) => {
    const newHistory = currentHistory.filter(item => item !== itemToRemove);
    setAllHistories(prev => ({ ...prev, [cacheKey]: newHistory }))
  };

  const clearCurrentHistory = () => {
    const freshCache = createCache<string, string>(policy, capacity);
    cachesRef.current[cacheKey] = freshCache;
    cacheRef.current = freshCache;
    setAllHistories(prev => ({ ...prev, [cacheKey]: [] }));
    setLastAction(`cleared ${cacheKey}`);
    setTick(t => t + 1);
  };

  const entries: CacheEntry<string, string>[] = useMemo(() => {
    if (!cacheRef.current) return [];
    return cacheRef.current.entries();
  }, [tick, policy, capacity]);

  const stats = useMemo(() => {
    if (!cacheRef.current) return { hits: 0, misses: 0, puts: 0, evictions: 0, policy: policy };
    return cacheRef.current.stats();
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

  return (
    <div className="h-screen w-screen grid grid-rows-[auto_1fr] bg-neutral-950 text-neutral-100 font-sans">
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-0 h-full">
        <div className="border-r border-neutral-800">
          <BrowserSim
            onVisit={onVisit}
            history={currentHistory}
            onRemoveItem={removeHistoryItem}
            onClearAll={clearCurrentHistory}
            onRunAllInputs={runOtherInputsOnCurrent}
            hasOtherInputs={hasOtherInputs}
          />
        </div>
        <div className="">
          <CacheVisualizer policy={policy} entries={entries} stats={stats} snapshot={snapshot} lastAction={lastAction} />
        </div>
      </div>
    </div>
  )
}

