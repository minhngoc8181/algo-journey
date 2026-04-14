import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'contains-value',
  version: 1,
  title: 'Contains Value',
  summary: 'Return true when target exists in the array, otherwise false.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'cse201'],
  estimatedMinutes: 10,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Linear Array Traversal', 'Early exit when condition met'],
  statement: 'Given an array of integers `numbers` and an integer `target`, return `true` if `target` exists in the array, and `false` otherwise.',
  constraints: ['The array may be empty.'],
  examples: [
    { input: 'numbers = [4, 7, 1, 6], target = 9', output: 'false' },
    { input: 'numbers = [8, 2, 5, 2, 9], target = 2', output: 'true' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\n\nclass Solution {\n    boolean containsValue(List<Integer> numbers, int target) {\n        // Write your code here\n        return false;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'containsValue',
    signature: 'boolean containsValue(List<Integer> numbers, int target)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
