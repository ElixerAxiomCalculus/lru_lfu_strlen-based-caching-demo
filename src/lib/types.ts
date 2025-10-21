export type Policy = 'LRU' | 'LFU' | 'STRING_LENGTH_TIME'

export type CacheEntry<K, V> = {
  key: K
  value: V
  freq?: number
  length?: number
  time?: number
}

export interface ICache<K, V> {
  get(key: K): V | undefined
  put(key: K, value: V): void
  has(key: K): boolean
  size(): number
  capacity(): number
  clear(): void
  entries(): CacheEntry<K, V>[]
  snapshot(): unknown
  stats(): { hits: number; misses: number; puts: number; evictions: number; policy: Policy }
}