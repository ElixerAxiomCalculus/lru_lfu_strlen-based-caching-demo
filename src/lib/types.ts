export enum EvictionPolicy { LRU = "LRU", LFU = "LFU", SIZE_BASED = "SIZE_BASED" }

export type CacheNode = {
  key: number;
  value: string;
  size: number;
  frequency: number;
  prev: CacheNode | null;
  next: CacheNode | null;
};

export interface ICache {
  capacity: number;
  count: number;
  head: CacheNode | null;
  tail: CacheNode | null;
  table: Array<CacheNode | null>;
  policy: EvictionPolicy;
  get(key: number): string | null;
  put(key: number, value: string, size: number): void;
  clear(): void;
  snapshot(): CacheNode[];
}

export type SearchDoc = {
  id: number;
  title: string;
  text: string;
  size: number;
  url?: string;
};
