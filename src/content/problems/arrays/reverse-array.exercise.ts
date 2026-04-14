import { defineExercise } from '../../_loader';
export default defineExercise({
  id: 'reverse-array', version: 1, title: 'Reverse Array',
  summary: 'Reverse an integer array in place.', topic: 'arrays', difficulty: 'easy',
  tags: ['two-pointers', 'in-place', 'cse201'], estimatedMinutes: 10, order: 3, mode: 'function_implementation',
  learningGoals: ['Use two pointers to swap elements', 'Modify array in place'],
  statement: 'Given an integer array `arr`, reverse it in place and return the array.',
  constraints: ['Modify the original array.'],
  examples: [{ input: 'arr = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' }],
  starter: { file: 'Solution.java', code: `class Solution {\n    int[] reverseArray(int[] arr) {\n        // Write your code here\n        return arr;\n    }\n}` },
  requiredStructure: { className: 'Solution', methodName: 'reverseArray', signature: 'int[] reverseArray(int[] arr)' },
  evaluation: { comparator: 'exact_json' },
});
