import React from "react";
import { EvictionPolicy } from "../lib/types";
import { useCacheStore } from "../store/useCacheStore";

export default function PolicySelector() {
  const policy = useCacheStore(s => s.policy);
  const setPolicy = useCacheStore(s => s.setPolicy);
  const items = Object.values(EvictionPolicy);

  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-slate-300 bg-slate-100">
      {items.map((p, i) => {
        const active = policy === p;
        return (
          <button
            key={p}
            className={`px-4 py-2 text-sm font-medium transition ${
              active ? "bg-white text-slate-900" : "text-slate-600 hover:bg-white/60"
            } ${i !== 0 ? "border-l border-slate-300" : ""}`}
            onClick={() => setPolicy(p)}
            aria-pressed={active}
          >
            {p.replace("_", "-")}
          </button>
        );
      })}
    </div>
  );
}
