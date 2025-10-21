import React, { useState } from "react";
import PolicySelector from "../components/PolicySelector";
import Toolbar from "../components/Toolbar";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import CacheViewer from "../components/CacheViewer";
import CacheStats from "../components/CacheStats";
import LogsPanel from "../components/LogsPanel";
import PutForm from "../components/PutForm";
import { SearchDoc } from "../lib/types";
import { useCacheStore } from "../store/useCacheStore";

export default function Home() {
  const [results, setResults] = useState<SearchDoc[]>([]);
  const policy = useCacheStore(s => s.policy);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT: Main interactions */}
      <section className="space-y-6 lg:col-span-2">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-2">Eviction Policy</h2>
                <PolicySelector />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-2">Capacity & Actions</h2>
                <Toolbar />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-2">Search</h2>
              <SearchBar onResults={setResults} />
              <div className="mt-3 text-sm text-slate-500">
                Policy: <span className="font-semibold">{policy}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Results</h2>
          <SearchResults results={results} />
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">How to Use</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700">
            <li>Select an eviction policy (LRU, LFU, or Size-based).</li>
            <li>Optionally set the cache <span className="font-medium">capacity</span> and click <span className="font-medium">Set</span>.</li>
            <li>Type a query (e.g., <span className="font-mono">doc</span> or <span className="font-mono">cache</span>) and press <span className="font-medium">Search</span>.</li>
            <li>Click <span className="font-medium">Open</span> on any result:
              <ul className="list-disc pl-5 mt-1">
                <li>A <span className="font-medium">hit</span> means it was already in cache.</li>
                <li>A <span className="font-medium">miss</span> stores it (via <span className="font-mono">put</span>) and then reads it.</li>
              </ul>
            </li>
            <li>Watch <span className="font-medium">Cache (Head → Tail)</span>, <span className="font-medium">Stats</span>, and <span className="font-medium">Logs</span> update live.</li>
            <li>Use <span className="font-medium">Manual Put</span> to insert or update any key/value/size.</li>
            <li>To see the collision behavior from your C code, set capacity to <span className="font-mono">3</span>, then open docs with ids <span className="font-mono">0</span> and <span className="font-mono">3</span> (both map to the same slot).</li>
          </ol>
        </div>
      </section>

      {/* RIGHT: Observability */}
      <aside className="space-y-6">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Cache (Head → Tail)</h2>
          <CacheViewer />
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Stats</h2>
          <CacheStats />
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Manual Put</h2>
          <PutForm />
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Logs</h2>
          <LogsPanel />
        </div>
      </aside>
    </div>
  );
}
