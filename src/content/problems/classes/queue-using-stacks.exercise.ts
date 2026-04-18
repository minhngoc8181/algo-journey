import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'queue-using-stacks',
  version: 1,
  title: 'Implement Queue using Stacks',
  summary: 'Implement a first-in-first-out (FIFO) queue using only two stacks.',
  topic: 'classes',
  difficulty: 'medium',
  tags: ['stack', 'design', 'queue', 'cse201'],
  estimatedMinutes: 25,
  order: 438,
  mode: 'class_implementation',

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

  evaluation: { comparator: 'exact_json' }
});
