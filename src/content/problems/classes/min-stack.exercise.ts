import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'min-stack',
  version: 1,
  title: 'Min Stack',
  summary: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
  topic: 'classes',
  difficulty: 'medium',
  tags: ['stack', 'design', 'cse201'],
  estimatedMinutes: 25,
  order: 437,
  mode: 'class_implementation',

  learningGoals: ['Combine multiple data structures', 'Maintain O(1) constraints for state retrieval'],
  statement: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.
Implement the \`MinStack\` class:\n\n- \`MinStack()\` initializes the stack object.
- \`void push(int val)\` pushes the element val onto the stack.
- \`void pop()\` removes the element on the top of the stack.
- \`int top()\` gets the top element of the stack.
- \`int getMin()\` retrieves the minimum element in the stack.

You must implement a solution with \`O(1)\` time complexity for each function.`,
  constraints: [
    'Methods pop, top and getMin operations will always be called on non-empty stacks.',
  ],
  examples: [
    { 
      input: 'MinStack minStack = new MinStack();\nminStack.push(-2);\nminStack.push(0);\nminStack.push(-3);\nminStack.getMin(); // return -3\nminStack.pop();\nminStack.top();    // return 0\nminStack.getMin(); // return -2', 
      output: '[null, null, null, null, -3, null, 0, -2]'
    },
  ],

  starter: {
    file: 'MinStack.java',
    code: `class MinStack {

    public MinStack() {
        
    }
    
    public void push(int val) {
        
    }
    
    public void pop() {
        
    }
    
    public int top() {
        return -1;
    }
    
    public int getMin() {
        return -1;
    }
}`,
  },

  requiredStructure: {
    className: 'MinStack',
    requiredMethods: [
      'MinStack()',
      'void push(int val)',
      'void pop()',
      'int top()',
      'int getMin()'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 2,
      seed: 848484,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 2; i++) {
            int opsCount = 20000;
            java.util.ArrayList<String> actual = new java.util.ArrayList<>();
            java.util.ArrayList<String> expected = new java.util.ArrayList<>();
            MinStack obj = new MinStack();
            actual.add("null");
            expected.add("null");
            
            java.util.Stack<Integer> valStack = new java.util.Stack<>();
            java.util.Stack<Integer> minStack = new java.util.Stack<>();

            for (int k = 0; k < opsCount; k++) {
                int opType = valStack.isEmpty() ? 0 : rng.nextInt(4);
                if (opType == 0) { // push
                    int val = rng.nextInt(1000) - 500;
                    obj.push(val);
                    valStack.push(val);
                    if (minStack.isEmpty() || val <= minStack.peek()) {
                        minStack.push(val);
                    }
                    actual.add("null");
                    expected.add("null");
                } else if (opType == 1) { // pop
                    obj.pop();
                    int popped = valStack.pop();
                    if (popped == minStack.peek()) minStack.pop();
                    actual.add("null");
                    expected.add("null");
                } else if (opType == 2) { // top
                    actual.add(String.valueOf(obj.top()));
                    expected.add(String.valueOf(valStack.peek()));
                } else { // getMin
                    actual.add(String.valueOf(obj.getMin()));
                    expected.add(String.valueOf(minStack.peek()));
                }
            }
            boolean pass = actual.equals(expected);
            System.out.println("AJ|stress-" + i + "|" + pass + "|" + actual.toString() + "|" + expected.toString());
        }`
    }
  }
});
