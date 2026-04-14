import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'max-sum-subarray-k',
  version: 1,
  title: 'Maximum Sum of Subarray of Size K',
  summary: 'Find the maximum sum achievable by adding exactly k consecutive elements.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['sliding-window', 'cse201'],
  estimatedMinutes: 20,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Understand the sliding window technique', 'Optimize sum recalculations'],
  statement: 'Given an array of integers `numbers` and an integer `k`, return the maximum sum of any contiguous subarray of exactly `k` elements.',
  constraints: ['`1 <= k <= numbers.length`'],
  examples: [
    { input: 'numbers = [2, 1, 5, 1, 3, 2], k = 3', output: '9', explanation: 'The subarray [5, 1, 3] has the maximum sum of 9.' },
    { input: 'numbers = [-1, -2, -3, -4], k = 2', output: '-3', explanation: 'The subarray [-1, -2] has the maximum sum of -3.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\n\nclass Solution {\n    int maxSumSubarrayK(List<Integer> numbers, int k) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'maxSumSubarrayK',
    signature: 'int maxSumSubarrayK(List<Integer> numbers, int k)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
