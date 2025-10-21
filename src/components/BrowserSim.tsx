import { useState } from 'react'
import { Globe, ArrowRight, History } from 'lucide-react'

type Props = {
  onVisit: (term: string) => void
  history: string[]
}

export default function BrowserSim({ onVisit, history }: Props) {
  const [query, setQuery] = useState('google.com')
  const go = () => {
    const q = query.trim()
    if (q.length === 0) return
    onVisit(q)
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
          <button onClick={go} className="px-4 py-2 rounded-xl bg-brand-600 text-white flex items-center gap-2">
            <span>Go</span><ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="text-sm text-neutral-400 mb-2 flex items-center gap-2"><History className="w-4 h-4" /> Recent</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {history.slice().reverse().map((h, i) => (
            <div key={i} className="rounded-2xl p-4 bg-[var(--card-bg)] border border-neutral-800">
              <div className="text-neutral-300">{h}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}