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
    code: `class Solution {\n    int maxSumSubarrayK(int[] numbers, int k) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'maxSumSubarrayK',
    signature: 'int maxSumSubarrayK(int[] numbers, int k)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250432,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int k = rng.nextInt(Math.min(len / 2, 1000)) + 1;
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            int win = 0; for (int j = 0; j < k; j++) win += arr[j];
            int expected = win;
            for (int j = k; j < len; j++) { win += arr[j] - arr[j-k]; if (win > expected) expected = win; }
            try {
                int actual = s.maxSumSubarrayK(arr, k);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
