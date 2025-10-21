import { EvictionPolicy, ICache } from "../types";
import { LRU } from "./LRU";
import { LFU } from "./LFU";
import { SizeBased } from "./SizeBased";

export class Cache {
  impl: ICache;
  constructor(capacity: number, policy: EvictionPolicy) {
    if (policy === EvictionPolicy.LRU) this.impl = new LRU(capacity);
    else if (policy === EvictionPolicy.LFU) this.impl = new LFU(capacity);
    else this.impl = new SizeBased(capacity);
  }
  get(key: number) { return this.impl.get(key); }
  put(key: number, value: string, size: number) { this.impl.put(key, value, size); }
  clear() { this.impl.clear(); }
  snapshot() { return this.impl.snapshot(); }
}
