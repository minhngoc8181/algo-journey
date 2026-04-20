import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'queue-using-stacks',
  version: 1,
  title: 'Implement Queue using Stacks',
  summary: 'Implement a first-in-first-out (FIFO) queue using only two stacks.',
  topic: 'design',
  difficulty: 'medium',
  tags: ['stack', 'design', 'queue', 'cse201'],
  estimatedMinutes: 25,
  order: 438,
  mode: 'class_implementation',
  hints: [
    "You need two Stacks. Let's call them `pushStack` and `popStack`.",
    'For `push()`, simply push the element onto `pushStack` (O(1)).',
    'For `pop()` and `peek()`, you need the oldest element. If `popStack` is empty, pop everything one by one from `pushStack` and push them onto `popStack`. This automatically reverses their order!',
    'Then, simply `pop()` or `peek()` from `popStack`.'
  ],

  learningGoals: ['Understand how to reverse data flow using stacks', 'Amortized time complexity'],
  statement: `Implement a first-in-first-out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (\`push\`, \`peek\`, \`pop\`, and \`empty\`).

Implement the \`MyQueue\` class:\n\n- \`MyQueue()\` Initializes the object.
- \`void push(int x)\` Pushes element x to the back of the queue.
- \`int pop()\` Removes the element from the front of the queue and returns it.
- \`int peek()\` Returns the element at the front of the queue.
- \`boolean empty()\` Returns \`true\` if the queue is empty, \`false\` otherwise.

**Notes:**
- You must use **only** standard operations of a stack, which means only \`push to top\`, \`peek/pop from top\`, \`size\`, and \`is empty\` operations are valid.`,
  constraints: [
    'All calls to \`pop\` and \`peek\` are valid (i.e., the queue is not empty when they are called).',
  ],
  examples: [
    { 
      input: 'MyQueue myQueue = new MyQueue();\nmyQueue.push(1);\nmyQueue.push(2);\nmyQueue.peek(); // return 1\nmyQueue.pop(); // return 1\nmyQueue.empty(); // return false', 
      output: '[null, null, null, 1, 1, false]'
    },
  ],

  starter: {
    file: 'MyQueue.java',
    code: `import java.util.Stack;

class MyQueue {

    public MyQueue() {
        
    }
    
    public void push(int x) {
        
    }
    
    public int pop() {
        return -1;
    }
    
    public int peek() {
        return -1;
    }
    
    public boolean empty() {
        return false;
    }
}`,
  },

  requiredStructure: {
    className: 'MyQueue',
    requiredMethods: [
      'MyQueue()',
      'void push(int x)',
      'int pop()',
      'int peek()',
      'boolean empty()'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 554433,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 100 : 5000;
            MyQueue obj = new MyQueue();
            
            java.util.ArrayList<Integer> refQueue = new java.util.ArrayList<>();

            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int opType = refQueue.isEmpty() ? 0 : rng.nextInt(4);
                if (opType == 0) { // push
                    int val = rng.nextInt(1000) - 500;
                    obj.push(val);
                    refQueue.add(val);
                } else if (opType == 1) { // pop
                    int actualPop = obj.pop();
                    int expectedPop = refQueue.remove(0);
                    expTrace.add(expectedPop);
                    actTrace.add(actualPop);
                } else if (opType == 2) { // peek
                    int actualPeek = obj.peek();
                    int expectedPeek = refQueue.get(0);
                    expTrace.add(expectedPeek);
                    actTrace.add(actualPeek);
                } else { // empty
                    boolean actualEmpty = obj.empty();
                    boolean expectedEmpty = refQueue.isEmpty();
                    expTrace.add(expectedEmpty);
                    actTrace.add(actualEmpty);
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
                if (actStr.length() > 2000) actStr = actStr.substring(0, 2000) + "...";
                if (expStr.length() > 2000) expStr = expStr.substring(0, 2000) + "...";
                if (mismatchIdx != -1) {
                    actStr = "[Mismatch at idx " + mismatchIdx + "] " + actStr;
                    expStr = "[Mismatch at idx " + mismatchIdx + "] " + expStr;
                }
            }
            System.out.println("AJ|stress-" + i + "|" + pass + "|" + actStr + "|" + expStr);
        }`
    }
  }
});
