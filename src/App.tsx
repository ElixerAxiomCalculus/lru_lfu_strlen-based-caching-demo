import React from "react";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Cache Simulator</h1>
          <a className="text-sm text-slate-500" href="#">LRU • LFU • Size-based</a>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Home />
      </main>
      <footer className="mx-auto max-w-6xl px-6 py-6 text-xs text-slate-500">
        Built for your submitted C logic (no fixes, behavior mirrored).
      </footer>
    </div>
  );
}
