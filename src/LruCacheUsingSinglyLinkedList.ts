import LruCache from "./LruCache";
import assert from 'assert'
import {fail} from 'assert'

class CacheEntry<K> {
  readonly id: K;
  next: CacheEntry<K> | null = null;
  constructor(id: K) {
    this.id = id;
  }
}

export default class Cache<K> implements LruCache<K> {
  private capacity_:number = 0;
  private readonly map:Map<K, CacheEntry<K> | null> = new Map();
  private first: CacheEntry<K> | null = null;
  private last: CacheEntry<K> | null = null;
  constructor(size: number) {
    this.capacity_ = size;
  }
  public has(id: K): boolean {
    return this.map.get(id) !== undefined;
  }

  public getEntry(id: K): boolean {
    const prev = this.map.get(id);
    if(prev === undefined) {
      const entry = new CacheEntry(id);
      this.map.set(id, this.first);
      if(this.first) {
        this.first.next = entry;
      }
      this.first = entry;
      this.first.next = null;
      if(this.last == null) {
        this.last = entry;
      }
      if(this.map.size > this.capacity_) {
        // delete the last used entry
        this.map.delete(this.last.id);
        this.last = this.last.next;
        if(this.last) {
          this.map.set(this.last.id, null);
        } else {
          this.first = null;
          this.last = null;
        }
      }
      return false;
    } else if(prev === null) {
      if(this.first === this.last && this.first !== null && this.last !== null) {
        // already on the first, because there are just only one entry.
        return true;
      }
      const nextLast = this.last!.next!;
      this.map.set(nextLast.id, null);
      this.map.set(this.last!.id, this.first);
      this.first!.next = this.last;
      this.first = this.last;
      this.last = nextLast;
      return true;
    } else {
      const entry = prev.next;
      if(entry === null) {
        fail("prev.next can not be null. Entry is not the front.");
      }
      if(this.first === null || this.last === null) {
        fail("this.first or this.last cannot be null. Because cache is not empty.");
      }
      if(this.first === entry) {
        // It's already first.
        assert(this.first.next === null, "first.next should be always null.");
        return true;
      }
      assert(entry.next, "entry.next should be not null, if it's not the front.");
      const next = entry.next!;
      prev.next = next;
      this.map.set(next.id, prev);
      this.map.set(entry.id, this.first);
      this.first.next = entry;
      this.first = entry;
      this.first.next = null;
      return true;
    }
  }

  get capacity():number {
    return this.capacity_;
  }
  get size():number {
    return this.map.size;
  }
}
