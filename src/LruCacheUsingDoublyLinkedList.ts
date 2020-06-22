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
    if(cache !== undefined) {
      this.pushFirst(cache);
      return true;
    } else {
      const entry = new CacheEntry(id);
      this.map.set(id, entry);
      this.pushFirst(entry);
      this.makeRoom();
      return false;
    }
  }

  private makeRoom() {
    while(this.map.size > this.capacity_ && this.last !== null) {
      this.map.delete(this.last.id);
      if(this.last.next) {
        this.last = this.last.next;
        this.last.prev = null;
      } else {
        this.last = null;
        this.first = null;
      }
    }
  }

  private pushFirst(entry: CacheEntry<K>) {
    if(entry === this.first) { // entry is already the first
      return;
    }
    if(entry === this.last) { // entry is the last
      if(this.last.next !== null){
        this.last.next.prev = null;
        this.last = this.last.next;
      }
      this.first!.next = entry;
      entry.prev = this.first;
      this.first = entry;
      this.first.next = null;
      return;
    }
    if(this.first === null || this.last === null) { // cache is empty.
      this.first = entry;
      this.last = entry;
      this.first.next = null;
      this.last.next = null;
      return;
    }
    if(entry.next !== null) {
      entry.next.prev = entry.prev;
    }
    if(entry.prev !== null) {
      entry.prev.next = entry.next;
    }
    entry.prev = this.first;
    this.first.next = entry;
    this.first = entry;
    this.first.next = null;
}
  get capacity():number {
    return this.capacity_;
  }
  get size():number {
    return this.map.size;
  }
}
