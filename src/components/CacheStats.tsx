import React from "react";
import { useCacheStore } from "../store/useCacheStore";

export default function CacheStats() {
  const hits = useCacheStore(s => s.hits);
  const misses = useCacheStore(s => s.misses);
  const capacity = useCacheStore(s => s.capacity);
  const cache = useCacheStore(s => s.cache);
  const count = cache.snapshot().length;
  const rate = hits + misses === 0 ? 0 : (hits / (hits + misses)) * 100;

  const Item = ({ label, value }: { label: string; value: string | number }) => (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <Item label="Capacity" value={capacity} />
      <Item label="Count" value={count} />
      <Item label="Hits" value={hits} />
      <Item label="Misses" value={misses} />
      <Item label="Hit Rate" value={`${rate.toFixed(1)}%`} />
    </div>
  );
}
