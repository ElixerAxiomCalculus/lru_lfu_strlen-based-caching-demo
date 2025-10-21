import React from "react";
import { useCacheStore } from "../store/useCacheStore";

export default function CacheViewer() {
  const cache = useCacheStore(s => s.cache);
  const nodes = cache.snapshot();

  return (
    <div>
      {nodes.length === 0 ? (
        <div className="text-sm text-slate-500">Empty</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {nodes.map(n => (
            <span key={n.key} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs">
              key {n.key} • size {n.size} • freq {n.frequency}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
