import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'shortest-subarray-sum',
  version: 1,
  title: 'Shortest Subarray With Sum ≥ Target',
  summary: 'Find the length of the shortest contiguous subarray whose sum is at least a target value.',
  topic: 'arrays',
  difficulty: 'hard',
  tags: ['sliding-window', 'two-pointers', 'cse201'],
  estimatedMinutes: 25,
  order: 430,
  mode: 'function_implementation',
  hints: [
    'Since all numbers are positive, we can use the "sliding window" (two-pointer) approach optimally.',
    'Keep a window from `left` to `right`. Expand `right` and add its value to your `current_sum`.',
    'Whenever `current_sum >= target`, you found a valid subarray! Record the window length `right - left + 1`.',
    'Then, try shrinking the window by moving `left` forward (and subtracting `numbers[left]` from `current_sum`) to find if there is an even shorter valid subarray.',
    'Return 0 if no subarray meets the condition.'
  ],
  
  learningGoals: ['Apply sliding window techniques to variable-length subarrays'],
  statement: 'Given an array of **positive** integers `numbers` and an integer `target`, return the length of the shortest contiguous subarray whose sum is greater than or equal to `target`. If there is no such subarray, return `0`.',
  constraints: ['All elements in the array are positive integers.', 'target > 0'],
  examples: [
    { input: 'numbers = [2, 3, 1, 2, 4, 3], target = 7', output: '2', explanation: 'The shortest subarray with a sum >= 7 is [4, 3] which has length 2.' },
    { input: 'numbers = [1, 4, 4], target = 4', output: '1', explanation: 'The subarray [4] has length 1.' },
    { input: 'numbers = [1, 1, 1, 1, 1], target = 11', output: '0', explanation: 'No subarray sums to 11.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {\n    int shortestSubarraySum(int[] numbers, int target) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'shortestSubarraySum',
    signature: 'int shortestSubarraySum(int[] numbers, int target)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250440,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(100) + 1; // positive only
            int target = len / 2 * 50; // roughly achievable
            int left2 = 0, cur = 0, minLen = len + 1;
            for (int right = 0; right < len; right++) {
                cur += arr[right];
                while (cur >= target) {
                    int wl = right - left2 + 1;
                    if (wl < minLen) minLen = wl;
                    cur -= arr[left2++];
                }
            }
            int expected = minLen > len ? 0 : minLen;
            try {
                int actual = s.shortestSubarraySum(arr, target);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
