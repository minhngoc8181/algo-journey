import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'is-sorted',
  version: 1,
  title: 'Check Array Is Sorted',
  summary: 'Return true when the array is already sorted in non-decreasing order.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'cse201'],
  estimatedMinutes: 10,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Check adjacent elements', 'Early exit when condition fails'],
  statement: 'Given an array of integers `numbers`, return `true` if the array is sorted in non-decreasing order (elements are equal to or larger than the previous element), and `false` otherwise.',
  constraints: ['The array may have less than 2 elements (which are inherently sorted).'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4]', output: 'true' },
    { input: 'numbers = [1, 1, 2, 2, 3]', output: 'true', explanation: 'Non-decreasing array with duplicates.' },
    { input: 'numbers = [1, 3, 2, 4]', output: 'false', explanation: '3 is greater than 2.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\n\nclass Solution {\n    boolean isSortedAscending(List<Integer> numbers) {\n        // Write your code here\n        return true;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'isSortedAscending',
    signature: 'boolean isSortedAscending(List<Integer> numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
