import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'intersect-sorted',
  version: 1,
  title: 'Intersection of Two Sorted Arrays',
  summary: 'Find the common elements between two sorted arrays, keeping duplicates based on the minimum count.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['two-pointers', 'cse201'],
  estimatedMinutes: 20,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Traverse two arrays simultaneously', 'Maintain sorted order while finding overlaps'],
  statement: 'Given two sorted arrays of integers `left` and `right`, return a new sorted array containing their intersection (common elements). Keep duplicates: if an element appears multiple times in both arrays, it should appear `min(countInLeft, countInRight)` times in the output.',
  constraints: ['Both input arrays are sorted in non-decreasing order.'],
  examples: [
    { input: 'left = [1, 2, 3, 4], right = [2, 4, 6, 8]', output: '[2, 4]', explanation: 'The elements 2 and 4 are common to both arrays.' },
    { input: 'left = [1, 1, 2, 3], right = [1, 1, 3, 3]', output: '[1, 1, 3]', explanation: '1 appears twice in both, and 3 appears once in left and twice in right.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.ArrayList;\n\nclass Solution {\n    List<Integer> intersectSorted(List<Integer> left, List<Integer> right) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'intersectSorted',
    signature: 'List<Integer> intersectSorted(List<Integer> left, List<Integer> right)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
