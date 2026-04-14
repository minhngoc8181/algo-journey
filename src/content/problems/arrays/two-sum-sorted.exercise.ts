import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'two-sum-sorted',
  version: 1,
  title: 'Two Sum (Sorted)',
  summary: 'Find two indices in a sorted array that sum to a target.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['two-pointers', 'cse201'],
  estimatedMinutes: 20,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Use the two-pointer technique to find pairs efficiently', 'Take advantage of sorted data'],
  statement: 'Given a sorted array of integers `numbers` and a `target` sum, find two distinct indices `[i, j]` such that `numbers[i] + numbers[j] == target` (with `i < j`). Return `[-1, -1]` if no such pair exists.',
  constraints: ['The array is sorted in non-decreasing order.', 'If there are multiple valid pairs, returning any correct pair is acceptable (though typically the two-pointer approach finds the outermost valid pair first).'],
  examples: [
    { input: 'numbers = [-3, 1, 4, 7, 11], target = 8', output: '[1, 3]', explanation: 'numbers[1] + numbers[3] = 1 + 7 = 8.' },
    { input: 'numbers = [1, 2, 3, 4, 5], target = 20', output: '[-1, -1]', explanation: 'No two elements sum to 20.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.ArrayList;\nimport java.util.Arrays;\n\nclass Solution {\n    List<Integer> twoSumSorted(List<Integer> numbers, int target) {\n        // Write your code here\n        return Arrays.asList(-1, -1);\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'twoSumSorted',
    signature: 'List<Integer> twoSumSorted(List<Integer> numbers, int target)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
