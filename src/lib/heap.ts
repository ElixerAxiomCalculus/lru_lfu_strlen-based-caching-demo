export class BinaryHeap<T> {
  private data: T[] = []
  private indexMap: Map<T, number> = new Map()
  private cmp: (a: T, b: T) => number

  constructor(cmp: (a: T, b: T) => number) {
    this.cmp = cmp
  }

  size() { return this.data.length }
  peek() { return this.data[0] }
  toArray() { return this.data.slice() }
  has(x: T) { return this.indexMap.has(x) }

  push(x: T) {
    this.data.push(x)
    this.indexMap.set(x, this.data.length - 1)
    this.bubbleUp(this.data.length - 1)
  }

  pop(): T | undefined {
    if (this.data.length === 0) return undefined
    const root = this.data[0]
    const last = this.data.pop() as T
    this.indexMap.delete(root)
    if (this.data.length > 0) {
      this.data[0] = last
      this.indexMap.set(last, 0)
      this.bubbleDown(0)
    }
    return root
  }

  update(x: T) {
    const i = this.indexMap.get(x)
    if (i === undefined) return
    if (i > 0 && this.cmp(this.data[i], this.data[this.parent(i)]) < 0) {
      this.bubbleUp(i)
    } else {
      this.bubbleDown(i)
    }
  }

  private parent(i: number) { return Math.floor((i - 1) / 2) }
  private left(i: number) { return 2 * i + 1 }
  private right(i: number) { return 2 * i + 2 }

  private swap(i: number, j: number) {
    const vi = this.data[i], vj = this.data[j]
    this.data[i] = vj
    this.data[j] = vi
    this.indexMap.set(vj, i)
    this.indexMap.set(vi, j)
  }

  private bubbleUp(i: number) {
    while (i > 0) {
      const p = this.parent(i)
      if (this.cmp(this.data[i], this.data[p]) < 0) {
        this.swap(i, p)
        i = p
      } else break
    }
  }

  private bubbleDown(i: number) {
    const n = this.data.length
    while (true) {
      const l = this.left(i), r = this.right(i)
      let m = i
      if (l < n && this.cmp(this.data[l], this.data[m]) < 0) m = l
      if (r < n && this.cmp(this.data[r], this.data[m]) < 0) m = r
      if (m !== i) {
        this.swap(i, m)
        i = m
      } else break
    }
  }
}