import React from "react";
import { SearchDoc } from "../lib/types";
import { useCacheStore } from "../store/useCacheStore";

type Props = { results: SearchDoc[] };

export default function SearchResults({ results }: Props) {
  const getViaCache = useCacheStore(s => s.getViaCache);

  if (!results.length) {
    return <div className="text-sm text-slate-500">No results yet. Try searching “doc” or “cache”.</div>;
  }

  return (
    <div className="grid gap-3">
      {results.map(r => (
        <article key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm transition">
          <h3 className="font-semibold text-slate-900">{r.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{r.text}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-slate-500">id {r.id} • size {r.size}</div>
            <button
              className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
              onClick={() => getViaCache(r.id, () => ({ value: r.text, size: r.size }))}
            >
              Open
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
