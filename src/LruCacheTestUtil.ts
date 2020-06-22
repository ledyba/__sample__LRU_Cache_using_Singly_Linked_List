
import LruCache from "./LruCache"

export default function runTest(createCache: (capacity: number) => LruCache<number>) {
  test('basic', () => {
    const cache = createCache(2);
    expect(cache.size).toBe(0);
    expect(cache.getEntry(1)).toBe(false);
    expect(cache.getEntry(1)).toBe(true);
    expect(cache.size).toBe(1);
    expect(cache.getEntry(2)).toBe(false);
    expect(cache.getEntry(2)).toBe(true);
    expect(cache.size).toBe(2);
    expect(cache.getEntry(3)).toBe(false);
    expect(cache.getEntry(3)).toBe(true);
    expect(cache.size).toBe(2);
  });
  
  test('cache with one entry', () => {
    const cache = createCache(1);
    expect(cache.size).toBe(0);
    expect(cache.getEntry(1)).toBe(false);
    expect(cache.getEntry(1)).toBe(true);
    expect(cache.size).toBe(1);
    expect(cache.getEntry(2)).toBe(false);
    expect(cache.getEntry(2)).toBe(true);
    expect(cache.size).toBe(1);
    expect(cache.getEntry(1)).toBe(false);
    expect(cache.getEntry(1)).toBe(true);
    expect(cache.size).toBe(1);
  });
  
  test('allow zero entry', () => {
    const cache = createCache(0);
    expect(cache.size).toBe(0);
    expect(cache.getEntry(1)).toBe(false);
    expect(cache.getEntry(1)).toBe(false);
    expect(cache.size).toBe(0);
  });
  
  test('test LRU', () => {
    const cache = createCache(2);
    expect(cache.size).toBe(0);
    expect(cache.getEntry(1)).toBe(false);
    expect(cache.getEntry(1)).toBe(true);
    expect(cache.size).toBe(1);

    expect(cache.getEntry(2)).toBe(false);
    expect(cache.getEntry(2)).toBe(true);
    expect(cache.size).toBe(2);

    expect(cache.getEntry(3)).toBe(false);
    expect(cache.getEntry(3)).toBe(true);
    expect(cache.size).toBe(2);

    // id=1 is last used!
    expect(cache.has(1)).toBe(false);
    expect(cache.getEntry(1)).toBe(false);
    expect(cache.getEntry(1)).toBe(true);
    expect(cache.size).toBe(2);

    // id=2 is last used!
    expect(cache.has(2)).toBe(false);
    expect(cache.getEntry(2)).toBe(false);
    expect(cache.getEntry(2)).toBe(true);
    expect(cache.size).toBe(2);

    // id=3 is last used!
    expect(cache.getEntry(3)).toBe(false);
    expect(cache.getEntry(3)).toBe(true);
    expect(cache.size).toBe(2);
  });
  test('fuzzing', () => {
    const cache = createCache(10);
    const recents = new Array(10);
    for(let i = 0; i < 10000; ++i) {
      const id = (Math.random() * 1000) | 0;
      recents[i % 10] = id;
      cache.getEntry(id);
    }
    expect(cache.size).toBe(10);
    for(let id = 0; id < 1000; ++id) {
      expect(cache.has(id)).toBe(recents.indexOf(id) >= 0);
    }
  });
}
