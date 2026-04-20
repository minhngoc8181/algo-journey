import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'front-middle-back-queue',
  version: 1,
  title: 'Design Front Middle Back Queue',
  summary: 'Design a queue that supports pushing and popping from the front, middle, and back.',
  topic: 'design',
  difficulty: 'medium',
  tags: ['array', 'linked-list', 'design', 'queue', 'cse201'],
  estimatedMinutes: 30,
  order: 444,
  mode: 'class_implementation',
  hints: [
    'You can use two basic standard structures, like two `Deque`s (or `ArrayDeque`s) to represent the `leftHalf` and `rightHalf` of the queue.',
    'Keep `leftHalf` and `rightHalf` balanced such that their sizes are equal or `leftHalf` has exactly one more element.',
    'When adding to the middle, balance the deques, then push to the back of `leftHalf` (or front of `rightHalf`), then rebalance again!'
  ],

  learningGoals: ['Understand doubly linked lists and complex index management', 'Optimize data structure for middle insertions'],
  statement: `Design a queue that supports \`push\` and \`pop\` operations in the front, middle, and back.

Implement the \`FrontMiddleBackQueue\` class:\n\n- \`FrontMiddleBackQueue()\` Initializes the queue.
- \`void pushFront(int val)\` Adds \`val\` to the front of the queue.
- \`void pushMiddle(int val)\` Adds \`val\` to the middle of the queue.
- \`void pushBack(int val)\` Adds \`val\` to the back of the queue.
- \`int popFront()\` Removes the front element of the queue and returns it. If the queue is empty, return \`-1\`.
- \`int popMiddle()\` Removes the middle element of the queue and returns it. If the queue is empty, return \`-1\`.
- \`int popBack()\` Removes the back element of the queue and returns it. If the queue is empty, return \`-1\`.

**Notice** that when there are two middle position choices, the operation is performed on the frontmost middle position choice. For example:\n\nPushing \`6\` into the middle of \`[1, 2, 3, 4, 5]\` results in \`[1, 2, 6, 3, 4, 5]\`.
- Popping the middle from \`[1, 2, 3, 4, 5, 6]\` returns \`3\` and results in \`[1, 2, 4, 5, 6]\`.`,
  constraints: [
    '\`1 <= val <= 10^9\`',
    'At most \`1000\` calls will be made to \`pushFront\`, \`pushMiddle\`, \`pushBack\`, \`popFront\`, \`popMiddle\`, and \`popBack\`.'
  ],
  examples: [
    { 
      input: `FrontMiddleBackQueue q = new FrontMiddleBackQueue();
q.pushFront(1);   // [1]
q.pushBack(2);    // [1, 2]
q.pushMiddle(3);  // [1, 3, 2]
q.pushMiddle(4);  // [1, 4, 3, 2]
q.popFront();     // return 1 -> [4, 3, 2]
q.popMiddle();    // return 3 -> [4, 2]
q.popMiddle();    // return 4 -> [2]
q.popBack();      // return 2 -> []
q.popFront();     // return -1 -> [] (The queue is empty)`, 
      output: '[null, null, null, null, null, 1, 3, 4, 2, -1]'
    },
  ],

  starter: {
    file: 'FrontMiddleBackQueue.java',
    code: `class FrontMiddleBackQueue {

    public FrontMiddleBackQueue() {
        
    }
    
    public void pushFront(int val) {
        
    }
    
    public void pushMiddle(int val) {
        
    }
    
    public void pushBack(int val) {
        
    }
    
    public int popFront() {
        return -1;
    }
    
    public int popMiddle() {
        return -1;
    }
    
    public int popBack() {
        return -1;
    }
}`,
  },

  requiredStructure: {
    className: 'FrontMiddleBackQueue',
    requiredMethods: [
      'FrontMiddleBackQueue()',
      'void pushFront(int val)',
      'void pushMiddle(int val)',
      'void pushBack(int val)',
      'int popFront()',
      'int popMiddle()',
      'int popBack()'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 1234567,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            // Keep operations size reasonable because ArrayList insert/remove at middle is O(N)
            // making 20000 operations perfectly fine for Java but let's bound it to 5000 just in case.
            int opsCount = (i < 5) ? 100 : 5000;
            
            FrontMiddleBackQueue obj = new FrontMiddleBackQueue();
            java.util.ArrayList<Integer> refList = new java.util.ArrayList<>();
            
            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int type = rng.nextInt(6);
                int val = rng.nextInt(100000) + 1;
                
                int expectedAns = -2;
                int actualAns = -2;

                if (type == 0) { // pushFront
                    refList.add(0, val);
                    obj.pushFront(val);
                } else if (type == 1) { // pushBack
                    refList.add(val);
                    obj.pushBack(val);
                } else if (type == 2) { // pushMiddle
                    refList.add(refList.size() / 2, val);
                    obj.pushMiddle(val);
                } else if (type == 3) { // popFront
                    expectedAns = refList.isEmpty() ? -1 : refList.remove(0);
                    actualAns = obj.popFront();
                } else if (type == 4) { // popBack
                    expectedAns = refList.isEmpty() ? -1 : refList.remove(refList.size() - 1);
                    actualAns = obj.popBack();
                } else if (type == 5) { // popMiddle
                    expectedAns = refList.isEmpty() ? -1 : refList.remove((refList.size() - 1) / 2);
                    actualAns = obj.popMiddle();
                }
                
                expTrace.add(expectedAns);
                    actTrace.add(actualAns);
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
                if (actStr.length() > 2000) actStr = actStr.substring(0, 2000) + "...";
                if (expStr.length() > 2000) expStr = expStr.substring(0, 2000) + "...";
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
