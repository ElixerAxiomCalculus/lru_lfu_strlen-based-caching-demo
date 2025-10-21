import { ICache, CacheNode, EvictionPolicy } from "../types";
import { addToFront, removeNode, createNode, hash } from "../utils";

export class SizeBased implements ICache {
  capacity: number;
  count: number;
  policy: EvictionPolicy = EvictionPolicy.SIZE_BASED;
  head: CacheNode | null = null;
  tail: CacheNode | null = null;
  table: Array<CacheNode | null>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.count = 0;
    this.table = new Array(capacity).fill(null);
  }

  private evictSizeBased() {
    if (!this.head) return;

    let nodeToEvict: CacheNode = this.head as CacheNode;
    let minSize = Number.MAX_SAFE_INTEGER;

    for (let cur: CacheNode | null = this.head; cur !== null; cur = cur.next) {
      if (cur.size < minSize) {
        minSize = cur.size;
        nodeToEvict = cur;
      }
    }

    const idx = hash(nodeToEvict.key, this.capacity);
    this.table[idx] = null;
    removeNode(this, nodeToEvict);
    this.count--;
  }

  get(key: number) {
    const idx = hash(key, this.capacity);
    const node = this.table[idx];
    if (node && node.key === key) {
      node.frequency++;
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
      return;
    }
    if (this.count >= this.capacity) this.evictSizeBased();
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
    for (let cur = this.head; cur !== null; cur = cur.next) arr.push({ ...cur });
    return arr;
  }
}
