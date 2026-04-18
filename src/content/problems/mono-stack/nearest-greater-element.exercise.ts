import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'nearest-greater-element',
  version: 1,
  title: 'Nearest Greater Element',
  summary: 'For each element, find the nearest greater element to its right.',
  topic: 'mono-stack',
  difficulty: 'easy',
  tags: ['mono-stack', 'stack', 'cse201'],
  estimatedMinutes: 20,
  order: 433,
  mode: 'function_implementation',
  hints: [
    'Use a stack to keep track of elements (or their indices) for which you have not yet found the next greater element.',
    'Iterate through the array from left to right. For each element, pop from the stack while the current element is greater than the stack top — that means the current element is the answer for those popped elements.',
    'After processing all elements, any remaining indices in the stack have no greater element to their right — their answer is `-1`.',
  ],

  learningGoals: ['Understand the monotonic stack template', 'Use a stack to track unresolved elements efficiently'],
  statement: 'Given an array of integers `nums`, for each element find the **next greater element** to its right. The next greater element of `nums[i]` is the first element to the right that is strictly greater than `nums[i]`. If no such element exists, the answer is `-1`.\n\nReturn an array `result` where `result[i]` is the next greater element for `nums[i]`.',
  constraints: ['`1 <= nums.length <= 100000`', '`-10^9 <= nums[i] <= 10^9`'],
  examples: [
    { input: 'nums = [2, 1, 2, 4, 3]', output: '[4, 2, 4, -1, -1]', explanation: 'For nums[0]=2, the next greater is 4. For nums[1]=1, the next greater is 2. For nums[3]=4 and nums[4]=3, there is no greater element to the right.' },
    { input: 'nums = [5, 4, 3, 2, 1]', output: '[-1, -1, -1, -1, -1]', explanation: 'Descending array — no element has a greater element to its right.' },
  ],

  starter: {
    file: 'Solution.java',
    code: `class Solution {\n    int[] nextGreaterElement(int[] nums) {\n        // Write your code here\n        return new int[0];\n    }\n}`,
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'nextGreaterElement',
    signature: 'int[] nextGreaterElement(int[] nums)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250471,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (50000 + rng.nextInt(50001)) : (1000 + rng.nextInt(4001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2000001) - 1000000;
            // Reference: mono stack
            int[] expected = new int[len];
            java.util.Arrays.fill(expected, -1);
            java.util.Deque<Integer> stack = new java.util.ArrayDeque<>();
            for (int j = 0; j < len; j++) {
                while (!stack.isEmpty() && arr[stack.peek()] < arr[j]) {
                    expected[stack.pop()] = arr[j];
                }
                stack.push(j);
            }
            try {
                int[] actual = s.nextGreaterElement(arr);
                boolean pass = java.util.Arrays.equals(actual, expected);
                System.out.println("AJ|stress-" + i + "|" + pass + "|" + (actual==null?"null":actual.length) + "|" + expected.length);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
