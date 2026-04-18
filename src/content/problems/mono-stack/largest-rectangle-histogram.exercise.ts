import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'largest-rectangle-histogram',
  version: 1,
  title: 'Largest Rectangle in Histogram',
  summary: 'Find the largest rectangular area in a histogram.',
  topic: 'mono-stack',
  difficulty: 'hard',
  tags: ['mono-stack', 'stack', 'cse201'],
  estimatedMinutes: 35,
  order: 437,
  mode: 'function_implementation',
  hints: [
    'For each bar, think about how far it can extend to the left and right while still being the shortest bar. The area for that bar is `height[i] * (rightBound - leftBound - 1)`.',
    'To find the left and right boundaries efficiently, use a monotonic stack. The **previous smaller element** gives the left boundary, and the **next smaller element** gives the right boundary.',
    'You can do this in a single pass: maintain an increasing stack of indices. When you encounter a bar shorter than the stack top, pop the top — the popped bar\'s rectangle extends from the new stack top (left boundary) to the current index (right boundary).',
    'Push a sentinel value (e.g., height = 0) at the end to force all remaining bars to be processed.',
  ],

  learningGoals: ['Solve a classic hard problem using monotonic stack', 'Understand how left/right boundaries define maximum rectangles'],
  statement: 'Given an array of integers `heights` representing the heights of bars in a histogram (each bar has width 1), find the area of the **largest rectangle** that can be formed within the histogram.\n\nThe rectangle must be formed by consecutive bars.',
  constraints: ['`1 <= heights.length <= 100000`', '`0 <= heights[i] <= 10000`'],
  examples: [
    { input: 'heights = [2, 1, 5, 6, 2, 3]', output: '10', explanation: 'The largest rectangle is formed by bars at indices 2 and 3 (heights 5 and 6), with area = 5 × 2 = 10.' },
    { input: 'heights = [2, 4]', output: '4', explanation: 'The largest rectangle is the single bar of height 4, area = 4 × 1 = 4.' },
  ],

  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {\n    int largestRectangleArea(int[] heights) {\n        // Write your code here\n        return 0;\n    }\n}`,
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'largestRectangleArea',
    signature: 'int largestRectangleArea(int[] heights)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250475,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (50000 + rng.nextInt(50001)) : (1000 + rng.nextInt(4001));
            int[] h = new int[len];
            for (int j = 0; j < len; j++) h[j] = rng.nextInt(10001);
            // Reference: mono stack O(n)
            int expected = 0;
            java.util.Deque<Integer> stack = new java.util.ArrayDeque<>();
            for (int j = 0; j <= len; j++) {
                int cur = (j == len) ? 0 : h[j];
                while (!stack.isEmpty() && h[stack.peek()] > cur) {
                    int height = h[stack.pop()];
                    int width = stack.isEmpty() ? j : (j - stack.peek() - 1);
                    expected = Math.max(expected, height * width);
                }
                stack.push(j);
            }
            try {
                int actual = s.largestRectangleArea(h);
                boolean pass = (actual == expected);
                System.out.println("AJ|stress-" + i + "|" + pass + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
