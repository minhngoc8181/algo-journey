import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'simple-counter',
  version: 1,
  title: 'Simple Counter',
  summary: 'Implement a counter class with increment and getValue.',
  topic: 'design',
  difficulty: 'easy',
  tags: ['constructor', 'state', 'cse201'],
  estimatedMinutes: 15,
  order: 436,
  mode: 'class_implementation',

  learningGoals: ['Understand basic class structure', 'Manage internal state'],
  statement: 'Implement a class `Counter` with a constructor that takes an initial value, a method `increment()` to increase the value by 1, and a method `getValue()` to return the current value.',
  constraints: ['The initial value is a non-negative integer.', 'increment() can be called multiple times.'],
  examples: [
    { 
      input: 'Counter c = new Counter(5);\nc.increment();\nc.getValue();', 
      output: '6', 
      explanation: 'Initial value is 5. After one increment, it becomes 6.' 
    },
  ],

  starter: {
    file: 'Counter.java',
    code: `class Counter {
    
    // Constructor
    Counter(int start) {
        
    }

    void increment() {
        
    }

    int getValue() {
        return -1;
    }
}`,
  },

  requiredStructure: {
    className: 'Counter',
    requiredMethods: [
      'Counter(int start)',
      'void increment()',
      'int getValue()'
    ],
  },

  evaluation: { comparator: 'exact_json' }
});
