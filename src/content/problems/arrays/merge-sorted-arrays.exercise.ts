import { defineExercise } from '../../_loader';
export default defineExercise({
  id: 'merge-sorted-arrays', version: 1, title: 'Merge Sorted Arrays',
  summary: 'Merge two sorted arrays into a single sorted array.', topic: 'arrays', difficulty: 'medium',
  tags: ['two-pointers', 'merge', 'cse201'], estimatedMinutes: 15, order: 20, mode: 'function_implementation',
  learningGoals: ['Two-pointer merge technique', 'Build result array'],
  statement: 'Given two sorted integer arrays `a` and `b`, merge them into a single sorted array and return it.',
  constraints: ['Both arrays are sorted in ascending order.', 'Either array may be empty.'],
  examples: [{ input: 'a = [1, 3, 5], b = [2, 4, 6]', output: '[1, 2, 3, 4, 5, 6]' }, { input: 'a = [1], b = []', output: '[1]' }],
  starter: { file: 'Solution.java', code: `class Solution {\n    int[] mergeSorted(int[] a, int[] b) {\n        // Write your code here\n        return new int[0];\n    }\n}` },
  requiredStructure: { className: 'Solution', methodName: 'mergeSorted', signature: 'int[] mergeSorted(int[] a, int[] b)' },
  evaluation: { comparator: 'exact_json' },
});
