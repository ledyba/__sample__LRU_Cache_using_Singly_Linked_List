import { Suite, Event, Target } from 'benchmark'

import LruCacheUsingSinglyLinkedList from './LruCacheUsingSinglyLinkedList'
import LruCacheUsingDoublyLinkedList from './LruCacheUsingDoublyLinkedList'

function double() {
  let c = new LruCacheUsingDoublyLinkedList(1000);
  for(let i = 0; i < 100000; ++i) {
    c.getEntry((Math.random() * 1000) | 0);
  }
}

function single() {
  let c = new LruCacheUsingSinglyLinkedList(1000);
  for(let i = 0; i < 100000; ++i) {
    c.getEntry((Math.random() * 1000) | 0);
  }
}

const suite = new Suite("Benchmark");
suite
  .add("Doubly Linked List", double)
  .add("Sindly Linked List", single)
  .on('cycle', (event: Event) => {
    console.log(String(event.target));
  })
  .on('complete', (event: Event) => {
    // FIXME: @types/benchmark looks broken!
    const fastest = suite.filter('fastest') as any;
    console.log(`[Done] Fastest: ${fastest[0].name}`);
  })
  .run();