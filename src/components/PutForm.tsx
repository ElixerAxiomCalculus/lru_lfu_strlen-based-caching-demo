import React, { useState } from "react";
import { useCacheStore } from "../store/useCacheStore";

export default function PutForm() {
  const putManual = useCacheStore(s => s.putManual);
  const [key, setKey] = useState("0");
  const [value, setValue] = useState("value");
  const [size, setSize] = useState("1");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div>
          <div className="mb-1 text-xs font-medium text-slate-500">Key</div>
          <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" value={key} onChange={e => setKey(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <div className="mb-1 text-xs font-medium text-slate-500">Value</div>
          <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-slate-500">Size</div>
          <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" value={size} onChange={e => setSize(e.target.value)} />
        </div>
      </div>
      <button
        className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
        onClick={() => {
          const k = parseInt(key,10);
          const s = parseInt(size,10);
          if (!Number.isNaN(k) && !Number.isNaN(s)) putManual(k, value, s);
        }}
      >
        Put
      </button>
    </div>
  );
}
