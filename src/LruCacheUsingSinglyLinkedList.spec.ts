import runTest from './LruCacheTestUtil'
import Cache from "./LruCacheUsingSinglyLinkedList"

runTest((capacity:number) => {
  return new Cache(capacity);
});
