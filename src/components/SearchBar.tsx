import React, { useState } from "react";
import { searchDocs } from "../lib/cache/search";
import { SearchDoc } from "../lib/types";
import { Search as SearchIcon } from "lucide-react";

type Props = { onResults: (r: SearchDoc[]) => void };

export default function SearchBar({ onResults }: Props) {
  const [q, setQ] = useState("");

  const doSearch = () => onResults(searchDocs(q));
  const clear = () => { setQ(""); onResults([]); };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 pl-12 text-base shadow-sm outline-none focus:border-blue-500"
          placeholder="Search documents…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }}
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800" onClick={doSearch}>
          Search
        </button>
        <button className="inline-flex items-center rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-300" onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
}
