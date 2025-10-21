import { BinaryHeap } from './heap'
import type { ICache, CacheEntry, Policy } from './types'

class DLLNode<K, V> {
  key: K
  value: V
  prev: DLLNode<K, V> | null = null
  next: DLLNode<K, V> | null = null
  constructor(key: K, value: V) {
    this.key = key
    this.value = value
  }
}

export class LRUCache<K, V> implements ICache<K, V> {
  private map: Map<K, DLLNode<K, V>> = new Map()
  private head: DLLNode<K, V> | null = null
  private tail: DLLNode<K, V> | null = null
  private cap: number
  private hits = 0
  private misses = 0
  private putsCount = 0
  private evicts = 0
  constructor(capacity: number) { this.cap = Math.max(1, capacity) }
  capacity() { return this.cap }
  size() { return this.map.size }
  has(key: K) { return this.map.has(key) }
  clear() { this.map.clear(); this.head = null; this.tail = null; this.hits = 0; this.misses = 0; this.putsCount = 0; this.evicts = 0 }
  private moveToHead(node: DLLNode<K, V>) {
    if (node === this.head) return
    if (node.prev) node.prev.next = node.next
    if (node.next) node.next.prev = node.prev
    if (this.tail === node) this.tail = node.prev
    node.prev = null
    node.next = this.head
    if (this.head) this.head.prev = node
    this.head = node
    if (!this.tail) this.tail = node
  }
  private removeTail(): DLLNode<K, V> | null {
    if (!this.tail) return null
    const t = this.tail
    const prev = t.prev
    if (prev) prev.next = null
    this.tail = prev
    if (this.head === t) this.head = null
    t.prev = null; t.next = null
    return t
  }
  get(key: K): V | undefined {
    const n = this.map.get(key)
    if (!n) { this.misses++; return undefined }
    this.hits++
    this.moveToHead(n)
    return n.value
  }
  put(key: K, value: V) {
    let n = this.map.get(key)
    this.putsCount++
    if (n) {
      n.value = value
      this.moveToHead(n)
      return
    }
    n = new DLLNode(key, value)
    this.map.set(key, n)
    n.next = this.head
    if (this.head) this.head.prev = n
    this.head = n
    if (!this.tail) this.tail = n
    if (this.map.size > this.cap) {
      const removed = this.removeTail()
      if (removed) { this.map.delete(removed.key); this.evicts++ }
    }
  }
  entries(): CacheEntry<K, V>[] {
    const out: CacheEntry<K, V>[] = []
    let cur = this.head
    while (cur) { out.push({ key: cur.key, value: cur.value }); cur = cur.next }
    return out
  }
  snapshot() {
    const nodes: { key: K; value: V }[] = []
    let cur = this.head
    while (cur) { nodes.push({ key: cur.key, value: cur.value }); cur = cur.next }
    return { type: 'LRU', orderHeadToTail: nodes }
  }
  stats() { return { hits: this.hits, misses: this.misses, puts: this.putsCount, evictions: this.evicts, policy: 'LRU' as Policy } }
}

type HeapNode<K, V> = { key: K; value: V; freq: number; time: number; length?: number }

export class LFUHeapCache<K, V> implements ICache<K, V> {
  private map: Map<K, HeapNode<K, V>> = new Map()
  private heap: BinaryHeap<HeapNode<K, V>>
  private cap: number
  private t = 0
  private hits = 0
  private misses = 0
  private putsCount = 0
  private evicts = 0
  constructor(capacity: number) {
    this.cap = Math.max(1, capacity)
    this.heap = new BinaryHeap((a, b) => {
      if (a.freq !== b.freq) return a.freq - b.freq
      return a.time - b.time
    })
  }
  capacity() { return this.cap }
  size() { return this.map.size }
  has(key: K) { return this.map.has(key) }
  clear() { this.map.clear(); this.heap = new BinaryHeap(this.heapCmp); this.t = 0; this.hits = 0; this.misses = 0; this.putsCount = 0; this.evicts = 0 }
  private heapCmp = (a: HeapNode<K, V>, b: HeapNode<K, V>) => a.freq !== b.freq ? a.freq - b.freq : a.time - b.time
  get(key: K): V | undefined {
    const n = this.map.get(key)
    if (!n) { this.misses++; return undefined }
    this.hits++
    n.freq += 1
    n.time = ++this.t
    this.heap.update(n)
    return n.value
  }
  put(key: K, value: V) {
    this.putsCount++
    const existing = this.map.get(key)
    if (existing) {
      existing.value = value
      existing.freq += 1
      existing.time = ++this.t
      this.heap.update(existing)
      return
    }
    if (this.map.size >= this.cap) {
      const root = this.heap.pop()
      if (root) { this.map.delete(root.key); this.evicts++ }
    }
    const n: HeapNode<K, V> = { key, value, freq: 1, time: ++this.t }
    this.map.set(key, n)
    this.heap.push(n)
  }
  entries(): CacheEntry<K, V>[] {
    const arr = Array.from(this.map.values())
    arr.sort((a, b) => a.freq === b.freq ? a.time - b.time : a.freq - b.freq)
    return arr.map(n => ({ key: n.key, value: n.value, freq: n.freq, time: n.time }))
  }
  snapshot() {
    return { type: 'LFU', heap: this.heap.toArray().map(n => ({ key: n.key, freq: n.freq, time: n.time })) }
  }
  stats() { return { hits: this.hits, misses: this.misses, puts: this.putsCount, evictions: this.evicts, policy: 'LFU' as Policy } }
}

export class LengthTimeHeapCache<K, V extends string> implements ICache<K, V> {
  private map: Map<K, HeapNode<K, V>> = new Map()
  private heap: BinaryHeap<HeapNode<K, V>>
  private cap: number
  private t = 0
  private hits = 0
  private misses = 0
  private putsCount = 0
  private evicts = 0
  constructor(capacity: number) {
    this.cap = Math.max(1, capacity)
    this.heap = new BinaryHeap((a, b) => {
      const la = a.length ?? String(a.value).length
      const lb = b.length ?? String(b.value).length
      if (la !== lb) return la - lb
      return a.time - b.time
    })
  }
  capacity() { return this.cap }
  size() { return this.map.size }
  has(key: K) { return this.map.has(key) }
  clear() { this.map.clear(); this.heap = new BinaryHeap(this.heapCmp); this.t = 0; this.hits = 0; this.misses = 0; this.putsCount = 0; this.evicts = 0 }
  private heapCmp = (a: HeapNode<K, V>, b: HeapNode<K, V>) => {
    const la = a.length ?? String(a.value).length
    const lb = b.length ?? String(b.value).length
    return la !== lb ? la - lb : a.time - b.time
  }
  get(key: K): V | undefined {
    const n = this.map.get(key)
    if (!n) { this.misses++; return undefined }
    this.hits++
    n.time = ++this.t
    this.heap.update(n)
    return n.value
  }
  put(key: K, value: V) {
    this.putsCount++
    const existing = this.map.get(key)
    if (existing) {
      existing.value = value
      existing.length = String(value).length
      existing.time = ++this.t
      this.heap.update(existing)
      return
    }
    if (this.map.size >= this.cap) {
      const root = this.heap.pop()
      if (root) { this.map.delete(root.key); this.evicts++ }
    }
    const n: HeapNode<K, V> = { key, value, freq: 0, time: ++this.t, length: String(value).length }
    this.map.set(key, n)
    this.heap.push(n)
  }
  entries(): CacheEntry<K, V>[] {
    const arr = Array.from(this.map.values())
    arr.sort((a, b) => {
      const la = a.length ?? String(a.value).length
      const lb = b.length ?? String(b.value).length
      if (la !== lb) return la - lb
      return a.time - b.time
    })
    return arr.map(n => ({ key: n.key, value: n.value, length: n.length, time: n.time }))
  }
  snapshot() {
    return { type: 'STRING_LENGTH_TIME', heap: this.heap.toArray().map(n => ({ key: n.key, length: n.length, time: n.time })) }
  }
  stats() { return { hits: this.hits, misses: this.misses, puts: this.putsCount, evictions: this.evicts, policy: 'STRING_LENGTH_TIME' as Policy } }
}

export function createCache<K, V>(policy: Policy, capacity: number): ICache<K, V> {
  if (policy === 'LRU') return new LRUCache<K, V>(capacity)
  if (policy === 'LFU') return new LFUHeapCache<K, V>(capacity)
  return new LengthTimeHeapCache<K, V & string>(capacity)
}