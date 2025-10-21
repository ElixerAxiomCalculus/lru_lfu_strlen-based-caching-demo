import React from "react";
import { useCacheStore } from "../store/useCacheStore";

export default function LogsPanel() {
  const logs = useCacheStore(s => s.logs);

  return (
    <div className="h-56 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="space-y-1 font-mono text-xs leading-5 text-slate-700">
        {logs.length === 0 ? (
          <div className="text-slate-500">No logs yet…</div>
        ) : (
          logs.map((l, i) => <div key={i}>{new Date(l.t).toLocaleTimeString()} — {l.msg}</div>)
        )}
      </div>
    </div>
  );
}
