import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'sum-subarray-minimums',
  version: 1,
  title: 'Sum of Subarray Minimums',
  summary: 'Calculate the sum of the minimum value of every contiguous subarray.',
  topic: 'mono-stack',
  difficulty: 'hard',
  tags: ['mono-stack', 'stack', 'math', 'cse201'],
  estimatedMinutes: 35,
  order: 438,
  mode: 'function_implementation',
  hints: [
    'Instead of iterating over all subarrays (O(N²)), think about the **contribution** of each element. How many subarrays have `arr[i]` as their minimum?',
    'For each element `arr[i]`, find the distance to the **previous smaller element** (left boundary) and the **next smaller or equal element** (right boundary). Use `<=` for one side to handle duplicates.',
    'If `left[i]` is the number of elements to the left (including `i`) until a smaller element, and `right[i]` is the number to the right, then `arr[i]` is the minimum in `left[i] * right[i]` subarrays.',
    'Sum up `arr[i] * left[i] * right[i]` for all `i`. Use modulo `10^9 + 7` to prevent overflow.',
  ],

  learningGoals: ['Calculate element contribution using monotonic stack boundaries', 'Handle duplicate elements with strict vs non-strict comparisons'],
  statement: 'Given an array of integers `arr`, find the sum of `min(subarray)` for every contiguous subarray of `arr`.\n\nSince the answer may be very large, return it **modulo `10^9 + 7`**.',
  constraints: ['`1 <= arr.length <= 100000`', '`1 <= arr[i] <= 30000`'],
  examples: [
    { input: 'arr = [3, 1, 2, 4]', output: '17', explanation: 'Subarrays and their mins: [3]→3, [1]→1, [2]→2, [4]→4, [3,1]→1, [1,2]→1, [2,4]→2, [3,1,2]→1, [1,2,4]→1, [3,1,2,4]→1. Sum = 3+1+2+4+1+1+2+1+1+1 = 17.' },
    { input: 'arr = [11, 81, 94, 43, 3]', output: '444', explanation: 'The sum of minimums of all 15 subarrays is 444.' },
  ],

  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {\n    int sumSubarrayMins(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}`,
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'sumSubarrayMins',
    signature: 'int sumSubarrayMins(int[] arr)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250476,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        long MOD = 1000000007L;
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (50000 + rng.nextInt(50001)) : (1000 + rng.nextInt(4001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(30000) + 1;
            // Reference: mono stack contribution
            int[] left = new int[len];
            int[] right = new int[len];
            java.util.Deque<Integer> stack = new java.util.ArrayDeque<>();
            // Previous less element (strict <)
            for (int j = 0; j < len; j++) {
                while (!stack.isEmpty() && arr[stack.peek()] >= arr[j]) stack.pop();
                left[j] = stack.isEmpty() ? (j + 1) : (j - stack.peek());
                stack.push(j);
            }
            stack.clear();
            // Next less or equal element (<=)
            for (int j = len - 1; j >= 0; j--) {
                while (!stack.isEmpty() && arr[stack.peek()] > arr[j]) stack.pop();
                right[j] = stack.isEmpty() ? (len - j) : (stack.peek() - j);
                stack.push(j);
            }
            long expected = 0;
            for (int j = 0; j < len; j++) {
                expected = (expected + (long)arr[j] * left[j] % MOD * right[j]) % MOD;
            }
            int exp = (int)expected;
            try {
                int actual = s.sumSubarrayMins(arr);
                boolean pass = (actual == exp);
                System.out.println("AJ|stress-" + i + "|" + pass + "|" + actual + "|" + exp);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
