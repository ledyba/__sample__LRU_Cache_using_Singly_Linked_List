export default interface LruCache<K> {
  has(id: K): boolean;
  getEntry(id: K): boolean;
  capacity: number;
  size: number;
}
