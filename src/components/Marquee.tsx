export default function Marquee() {
  const items = ['LRU', 'LFU', 'String-Length+Time', 'HashMap', 'DLL', 'Binary Heap', 'O(1)', 'O(log n)', 'Eviction', 'Hits', 'Misses', 'Timestamps']
  return (
    <div className="relative w-full overflow-hidden border-y border-neutral-800 bg-neutral-900/40">
      <div className="flex whitespace-nowrap animate-marquee py-2">
        {[...items, ...items].map((t, i) => (
          <div key={i} className="mx-6 text-sm tracking-wide text-neutral-300">{t}</div>
        ))}
      </div>
    </div>
  )
}
