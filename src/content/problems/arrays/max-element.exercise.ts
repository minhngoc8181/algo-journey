import { defineExercise } from '../../_loader';
export default defineExercise({
  id: 'max-element', version: 1, title: 'Maximum Element',
  summary: 'Find the maximum element in an array.', topic: 'arrays', difficulty: 'easy',
  tags: ['linear-search', 'extreme', 'cse201'], estimatedMinutes: 10, order: 2, mode: 'function_implementation',
  learningGoals: ['Track running maximum while iterating'],
  statement: 'Given an integer array `arr`, return the maximum element.',
  constraints: ['The array has at least one element.'],
  examples: [{ input: 'arr = [3, 1, 4, 1, 5, 9]', output: '9' }],
  starter: { file: 'Solution.java', code: `class Solution {\n    int maxElement(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}` },
  requiredStructure: { className: 'Solution', methodName: 'maxElement', signature: 'int maxElement(int[] arr)' },
  evaluation: { comparator: 'exact_json' },
});
