import runTest from './LruCacheTestUtil'
import Cache from "./LruCacheUsingDoublyLinkedList"

runTest((capacity:number) => {
  return new Cache(capacity);
});
