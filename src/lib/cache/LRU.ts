import { ICache, CacheNode, EvictionPolicy } from "../types";
import { addToFront, moveToFront, removeNode, createNode, hash } from "../utils";

export class LRU implements ICache {
  capacity: number;
  count: number;
  policy: EvictionPolicy = EvictionPolicy.LRU;
  head: CacheNode | null = null;
  tail: CacheNode | null = null;
  table: Array<CacheNode | null>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.count = 0;
    this.table = new Array(capacity).fill(null);
  }

  private evictLRU() {
    if (!this.tail) return;
    const node = this.tail;
    const idx = hash(node.key, this.capacity);
    this.table[idx] = null;
    removeNode(this, node);
    this.count--;
  }

  get(key: number) {
    const idx = hash(key, this.capacity);
    const node = this.table[idx];
    if (node && node.key === key) {
      node.frequency++;
      moveToFront(this, node);
      return node.value;
    }
    return null;
  }

  put(key: number, value: string, size: number) {
    const idx = hash(key, this.capacity);
    const node = this.table[idx];
    if (node && node.key === key) {
      node.value = value;
      node.size = size;
      node.frequency++;
      moveToFront(this, node);
      return;
    }
    if (this.count >= this.capacity) this.evictLRU();
    const nn = createNode(key, value, size);
    addToFront(this, nn);
    this.table[idx] = nn;
    this.count++;
  }

  clear() {
    this.head = null; this.tail = null; this.count = 0;
    this.table = new Array(this.capacity).fill(null);
  }

  snapshot() {
    const arr: CacheNode[] = [];
    let cur = this.head;
    while (cur) { arr.push({ ...cur }); cur = cur.next; }
    return arr;
  }
}
