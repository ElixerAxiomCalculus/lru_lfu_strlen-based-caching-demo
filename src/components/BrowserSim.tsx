import { useState, useEffect } from 'react'
import { Globe, ArrowRight, History, X, TestTube2, ChevronsRight } from 'lucide-react'

type Props = {
  onVisit: (term: string) => void
  history: string[]
  onRemoveItem: (item: string) => void
  onClearAll: () => void
  onRunAllInputs: () => void
  hasOtherInputs: boolean
  onRunHistoryOnAll: () => void
  showRunHistoryOnAllButton: boolean
}

export default function BrowserSim({ 
  onVisit, 
  history, 
  onRemoveItem, 
  onClearAll, 
  onRunAllInputs, 
  hasOtherInputs,
  onRunHistoryOnAll,
  showRunHistoryOnAllButton
}: Props) {
  const [query, setQuery] = useState(
    () => sessionStorage.getItem('browserQuery') || ''
  )

  useEffect(() => {
    sessionStorage.setItem('browserQuery', query)
  }, [query])

  useEffect(() => {
    sessionStorage.setItem('activeURL', '1')
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('activeURL')
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const go = () => {
    const q = query.trim()
    if (q.length === 0) return
    onVisit(q)
    setQuery('')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-neutral-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') go() }}
            placeholder="Type a URL or search term"
            className="flex-1 bg-neutral-800 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-brand-600"
          />
          <button onClick={go} className="px-4 py-2 rounded-xl bg-brand-600 text-white flex items-center gap-2 hover:bg-brand-500 transition-colors">
            <span>Go</span><ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-neutral-400 flex items-center gap-2">
            <History className="w-4 h-4" /> Recent
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {/* --- NEW BUTTON: "Run History on All" --- */}
            {showRunHistoryOnAllButton && (
              <button
                onClick={onRunHistoryOnAll}
                className="text-sm text-purple-400 hover:underline flex items-center gap-1.5"
                title="Run this policy's history on all other policies"
              >
                <ChevronsRight className="w-4 h-4" /> Run History on All
              </button>
            )}
            {/* --- END NEW BUTTON --- */}
            
            {hasOtherInputs && (
              <button
                onClick={onRunAllInputs}
                className="text-sm text-green-500 hover:underline flex items-center gap-1.5"
                title="Run all unique inputs from other policies on this one"
              >
                <TestTube2 className="w-4 h-4" /> Run Other Inputs
              </button>
            )}
            {history.length > 0 && (
              <button onClick={onClearAll} className="text-sm text-brand-500 hover:underline">
                Clear Current
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {history.length > 0 ? (
            history.map((h, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl p-4 bg-neutral-900 border border-neutral-800 group">
                <div className="text-neutral-300 truncate">{h}</div>
                <button onClick={() => onRemoveItem(h)} className="text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-neutral-500 col-span-1 md:col-span-2 mt-4">
              History for this cache is empty.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

