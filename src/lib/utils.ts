import { CacheNode } from "./types";

export function createNode(key: number, value: string, size: number): CacheNode {
  return { key, value, size, frequency: 1, prev: null, next: null };
}

export function addToFront(ctx: { head: CacheNode | null; tail: CacheNode | null }, node: CacheNode) {
  node.next = ctx.head;
  node.prev = null;
  if (ctx.head) ctx.head.prev = node;
  ctx.head = node;
  if (!ctx.tail) ctx.tail = node;
}

export function removeNode(ctx: { head: CacheNode | null; tail: CacheNode | null }, node: CacheNode) {
  if (node.prev) node.prev.next = node.next; else ctx.head = node.next;
  if (node.next) node.next.prev = node.prev; else ctx.tail = node.prev;
  node.prev = null; node.next = null;
}

export function moveToFront(ctx: { head: CacheNode | null; tail: CacheNode | null }, node: CacheNode) {
  removeNode(ctx, node);
  addToFront(ctx, node);
}

export function hash(key: number, capacity: number) {
  const mod = key % capacity;
  return mod >= 0 ? mod : (mod + capacity);
}
