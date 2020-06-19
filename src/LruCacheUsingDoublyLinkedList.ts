import LruCache from "./LruCache";

class CacheEntry<K> {
  readonly id: K;
  next: CacheEntry<K> | null = null;
  prev: CacheEntry<K> | null = null;
  constructor(id: K) {
    this.id = id;
  }
}

export default class Cache<K> implements LruCache<K> {
  private capacity_:number = 0;
  private readonly map:Map<K, CacheEntry<K>> = new Map();
  private first: CacheEntry<K> | null = null;
  private last: CacheEntry<K> | null = null;
  constructor(capacity: number) {
    this.capacity_ = capacity;
  }

  public has(id: K): boolean {
    return this.map.has(id);
  }

  public getEntry(id: K): boolean {
    const cache = this.map.get(id);
    if(!!cache) {
      this.pushFirst(cache);
      return true;
    }
    const entry = new CacheEntry(id);
    this.map.set(id, entry);
    this.pushFirst(entry);
    if(this.map.size > this.capacity_ && this.capacity_ > 0) {
      this.map.delete(this.popLast()!.id);
    }
    return false;
  }

  private popLast() : CacheEntry<K> | null {
    const last = this.last;
    if(!last) {
      return null;
    }
    const nextLast = last.next;
    if(nextLast) {
      nextLast.prev = null;
      this.last = nextLast;
    } else {
      this.last = null;
    }
    return last;
  }

  private pushFirst(entry: CacheEntry<K>) {
    if(!!entry.next) {
      entry.next.prev = entry.prev;
    }
    if(!!entry.prev) {
      entry.prev.next = entry.next;
    }
    entry.next = null;
    entry.prev = this.first;
    this.first = entry;
    if(!this.last) {
      this.last = entry;
    }
  }

  get capacity():number {
    return this.capacity_;
  }
  get size():number {
    return this.map.size;
  }
}
