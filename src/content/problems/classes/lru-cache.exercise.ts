import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'lru-cache',
  version: 1,
  title: 'LRU Cache',
  summary: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
  topic: 'classes',
  difficulty: 'medium',
  tags: ['hash-table', 'linked-list', 'design', 'doubly-linked-list', 'cse201'],
  estimatedMinutes: 45,
  order: 447,
  mode: 'class_implementation',

  learningGoals: ['Combine Maps and Doubly Linked Lists to achieve O(1) time complexity', 'Manage complex state of head/tail pointers and map synchronization'],
  statement: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with **positive** size \`capacity\`.
- \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, **evict** the least recently used key.

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
        // Create an internal class for tracking LRU state independently to test learner's LRU
        class LRUTracker {
            int capacity;
            java.util.LinkedHashMap<Integer, Integer> map;
            public LRUTracker(int limit) {
                this.capacity = limit;
                this.map = new java.util.LinkedHashMap<Integer, Integer>(limit, 0.75f, true);
            }
            public int get(int key) { return map.getOrDefault(key, -1); }
            public void put(int key, int value) { 
                map.put(key, value); 
                if (map.size() > capacity) {
                    java.util.Iterator<Integer> it = map.keySet().iterator();
                    if (it.hasNext()) {
                        it.next();
                        it.remove();
                    }
                }
            }
        }

        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 200 : 10000;
            int capacity = rng.nextInt(300) + 1;
            
            LRUCache obj = new LRUCache(capacity);
            LRUTracker tracker = new LRUTracker(capacity);
            
            boolean pass = true;
            String firstMismatchAct = "[]";
            String firstMismatchExp = "[]";

            for (int k = 0; k < opsCount; k++) {
                int type = rng.nextInt(3); // 0,1=put, 2=get
                int key = rng.nextInt(capacity * 2); // Make keys bound close to capacity to force evictions
                
                if (type < 2) { // put
                    int val = rng.nextInt(10000);
                    tracker.put(key, val);
                    obj.put(key, val);
                } else { // get
                    int expectedAns = tracker.get(key);
                    int actualAns = obj.get(key);
                    
                    if (expectedAns != actualAns) {
                        pass = false;
                        firstMismatchAct = "[get " + key + " -> " + actualAns + "]";
                        firstMismatchExp = "[get " + key + " -> " + expectedAns + "]";
                        break;
                    }
                }
            }
            System.out.println("AJ|test-" + i + "|" + pass + "|" + firstMismatchAct + "|" + firstMismatchExp);
        }`
    }
  }
});
