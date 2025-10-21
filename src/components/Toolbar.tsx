import React, { useState } from "react";
import { useCacheStore } from "../store/useCacheStore";
import { Settings, Trash2 } from "lucide-react";

export default function Toolbar() {
  const capacity = useCacheStore(s => s.capacity);
  const setCapacity = useCacheStore(s => s.setCapacity);
  const clearCache = useCacheStore(s => s.clearCache);
  const [cap, setCap] = useState(capacity.toString());

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end">
      <div>
        <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Settings size={14}/> Capacity
        </div>
        <div className="flex items-center gap-2">
          <input
            className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            value={cap}
            onChange={e => setCap(e.target.value)}
          />
          <button
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
            onClick={() => {
              const n = parseInt(cap, 10);
              if (!Number.isNaN(n) && n > 0) setCapacity(n);
            }}
          >
            Set
          </button>
        </div>
      </div>

      <div className="md:ml-4">
        <div className="mb-1 text-xs font-medium text-slate-500">Actions</div>
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-300"
          onClick={clearCache}
        >
          <Trash2 size={16}/> Clear Cache
        </button>
      </div>
    </div>
  );
}
