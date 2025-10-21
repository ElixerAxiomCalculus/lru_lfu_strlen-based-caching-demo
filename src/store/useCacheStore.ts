import { create } from "zustand";
import { EvictionPolicy } from "../lib/types";
import { Cache } from "../lib/cache/Cache";

type Log = { t: number; msg: string };

type State = {
  policy: EvictionPolicy;
  capacity: number;
  cache: Cache;
  hits: number;
  misses: number;
  logs: Log[];
  setPolicy: (p: EvictionPolicy) => void;
  setCapacity: (c: number) => void;
  clearCache: () => void;
  getViaCache: (key: number, valueProducer: () => { value: string; size: number }) => string | null;
  putManual: (key: number, value: string, size: number) => void;
  append: (msg: string) => void;
};

export const useCacheStore = create<State>((set, get) => ({
  policy: EvictionPolicy.LRU,
  capacity: 3,
  cache: new Cache(3, EvictionPolicy.LRU),
  hits: 0,
  misses: 0,
  logs: [],
  append: (msg) => set((s) => ({ logs: [...s.logs, { t: Date.now(), msg }] })),
  setPolicy: (p) =>
    set((s) => ({
      policy: p,
      cache: new Cache(s.capacity, p),
      hits: 0,
      misses: 0,
      logs: [],
    })),
  setCapacity: (c) =>
    set((s) => ({
      capacity: c,
      cache: new Cache(c, s.policy),
      hits: 0,
      misses: 0,
      logs: [],
    })),
  clearCache: () =>
    set((s) => ({
      cache: new Cache(s.capacity, s.policy),
      hits: 0,
      misses: 0,
      logs: [],
    })),
  getViaCache: (key, valueProducer) => {
    const { cache, append } = get();
    const got = cache.get(key);
    if (got !== null) {
      set((st) => ({ hits: st.hits + 1 }));
      append(`HIT key ${key}`);
      return got;
    }
    set((st) => ({ misses: st.misses + 1 }));
    append(`MISS key ${key}`);
    const { value, size } = valueProducer();
    cache.put(key, value, size);
    append(`PUT key ${key} size ${size}`);
    return cache.get(key);
  },
  putManual: (key, value, size) => {
    const { cache, append } = get();
    cache.put(key, value, size);
    append(`PUT key ${key} size ${size}`);
  },
}));
