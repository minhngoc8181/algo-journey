import { defineTests } from '../../_test-utils';

export default defineTests('lru-cache', (t) => {
  t.visible('example-1', { 
    operations: [
      ['LRUCache', 2],
      ['put', 1, 1],
      ['put', 2, 2],
      ['get', 1],
      ['put', 3, 3],
      ['get', 2],
      ['put', 4, 4],
      ['get', 1],
      ['get', 3],
      ['get', 4]
    ],
    expected: [null, null, null, 1, null, -1, null, -1, 3, 4] 
  });

  t.hidden('capacity-1', {
    operations: [
      ['LRUCache', 1],
      ['put', 10, 100],
      ['get', 10],
      ['put', 20, 200],
      ['get', 10],
      ['get', 20]
    ],
    expected: [null, null, 100, null, -1, 200]
  });

  t.hidden('update-value', {
    operations: [
      ['LRUCache', 2],
      ['put', 1, 10],
      ['put', 1, 20],
      ['get', 1],
      ['put', 2, 30],
      ['put', 3, 40],
      ['get', 1],
      ['get', 2]
    ],
    // put 1, 10 (cache: [1(10)])
    // put 1, 20 (cache: [1(20)])
    // get 1 -> 20
    // put 2, 30 (cache: [2(30), 1(20)])
    // put 3, 40 (evicts 1, cache: [3(40), 2(30)])
    // get 1 -> -1
    // get 2 -> 30
    expected: [null, null, null, 20, null, null, -1, 30]
  });
});
