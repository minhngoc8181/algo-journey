import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'lru-cache',
  version: 1,
  title: 'LRU Cache',
  summary: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
  topic: 'design',
  difficulty: 'medium',
  tags: ['hash-table', 'linked-list', 'design', 'doubly-linked-list', 'cse201'],
  estimatedMinutes: 45,
  order: 447,
  mode: 'class_implementation',
  hints: [
    'An optimal LRU Cache uses a combination of a `HashMap` and a **Doubly-Linked List**.',
    'The `HashMap` maps keys to their Corresponding Node in the linked list, giving O(1) access.',
    'The Doubly-Linked List keeps track of the "most recently used" order.',
    'Whenever a key is accessed or added, move its node to the "head" (most recently used) side of the list. If capacity is exceeded, remove the node at the "tail" (least recently used).'
  ],

  learningGoals: ['Combine Maps and Doubly Linked Lists to achieve O(1) time complexity', 'Manage complex state of head/tail pointers and map synchronization'],
  statement: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:

- \`LRUCache(int capacity)\` Initialize the LRU cache with **positive** size \`capacity\`.
- \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. 

    Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, **evict** the least recently used key.

The functions \`get\` and \`put\` must each run in \`O(1)\` average time complexity.`,
  constraints: [
    '\`1 <= capacity <= 3000\`',
    '\`0 <= key <= 10^4\`',
    '\`0 <= value <= 10^5\`',
    'At most \`10^5\` calls will be made to \`get\` and \`put\`. (For this testing environment, up to 10,000)'
  ],
  examples: [
    { 
      input: `LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2}
lRUCache.get(1);    // return 1
lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2);    // returns -1 (not found)
lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
lRUCache.get(1);    // return -1 (not found)
lRUCache.get(3);    // return 3
lRUCache.get(4);    // return 4`, 
      output: '[null, null, null, 1, null, -1, null, -1, 3, 4]'
    },
  ],

  starter: {
    file: 'LRUCache.java',
    code: `class LRUCache {

    public LRUCache(int capacity) {
        
    }
    
    public int get(int key) {
        return -1;
    }
    
    public void put(int key, int value) {
        
    }
}`,
  },

  requiredStructure: {
    className: 'LRUCache',
    requiredMethods: [
      'LRUCache(int capacity)',
      'int get(int key)',
      'void put(int key, int value)'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 554433,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        // Reference implementation using LinkedHashMap with access-order
        class LRUTracker {
            int capacity;
            java.util.LinkedHashMap<Integer, Integer> map;
            public LRUTracker(int limit) {
                this.capacity = limit;
                // access-order=true: get() moves entry to tail (most-recent)
                this.map = new java.util.LinkedHashMap<Integer, Integer>(limit, 0.75f, true);
            }
            public int get(int key) {
                // Use get() (not getOrDefault) so access-order is updated
                Integer v = map.get(key); return v == null ? -1 : v;
            }
            public void put(int key, int value) {
                map.put(key, value);
                // Evict LRU entry (head of access-ordered map) when over capacity
                if (map.size() > capacity) {
                    java.util.Iterator<Integer> it = map.keySet().iterator();
                    if (it.hasNext()) { it.next(); it.remove(); }
                }
            }
        }

        for (int i = 0; i < 20; i++) {
            // Mix sizes: small (forces many evictions) and larger
            int opsCount = (i < 10) ? 500 : 2000;
            // Small capacity forces aggressive eviction; larger capacity tests bulk behavior
            int capacity = (i < 5) ? (rng.nextInt(5) + 2)    // 2–6 → very tight
                         : (i < 10) ? (rng.nextInt(20) + 5)  // 5–24 → moderate
                         :            (rng.nextInt(100) + 20);// 20–119 → larger

            LRUCache  obj     = new LRUCache(capacity);
            LRUTracker tracker = new LRUTracker(capacity);

            // key universe slightly larger than capacity to ensure evictions happen
            int keyRange = capacity + rng.nextInt(capacity + 1) + 1;

            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int type = rng.nextInt(3); // 0,1=put, 2=get
                int key  = rng.nextInt(keyRange);

                if (type < 2) {
                    int val = rng.nextInt(100000);
                    tracker.put(key, val);
                    obj.put(key, val);
                } else {
                    int exp = tracker.get(key);
                    int act = obj.get(key);
                    expTrace.add(exp);
                    actTrace.add(act);
                }
                if (expTrace.size() == traceSizeBefore) {
                    expTrace.add(null);
                    actTrace.add(null);
                }
            }

            boolean pass = actTrace.equals(expTrace);
            String actStr = actTrace.toString();
            String expStr = expTrace.toString();
            if (!pass) {
                int mismatchIdx = -1;
                for (int m = 0; m < actTrace.size(); m++) {
                    if (actTrace.get(m) == null && expTrace.get(m) == null) continue;
                    if (actTrace.get(m) == null || !actTrace.get(m).equals(expTrace.get(m))) { mismatchIdx = m; break; }
                }
                if (mismatchIdx != -1) {
                    actStr = "[Mismatch at idx " + mismatchIdx + "] " + actStr;
                    expStr = "[Mismatch at idx " + mismatchIdx + "] " + expStr;
                }
            }
            System.out.println("AJ|test-" + i + "|" + pass + "|" + actStr + "|" + expStr);
        }`

    }
  }
});
