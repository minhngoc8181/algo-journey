import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'daily-temperatures',
  version: 1,
  title: 'Daily Temperatures',
  summary: 'Find how many days you have to wait for a warmer temperature.',
  topic: 'mono-stack',
  difficulty: 'medium',
  tags: ['mono-stack', 'stack', 'cse201'],
  estimatedMinutes: 20,
  order: 435,
  mode: 'function_implementation',
  hints: [
    'This is a "next greater element" problem, but instead of returning the greater value, you return the **distance** (number of days) to it.',
    'Use a stack of indices. Iterate through the array: for each day `i`, pop indices from the stack while `temperatures[i] > temperatures[stack.top()]`.',
    'For each popped index `j`, the answer is `i - j`.',
    'Any index remaining in the stack at the end has answer `0` (no warmer day exists).',
  ],

  learningGoals: ['Transform next-greater-element into distance calculation', 'Practice the monotonic stack pattern'],
  statement: 'Given an array of integers `temperatures` representing daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`-th day to get a warmer temperature. If there is no future day with a warmer temperature, set `answer[i] = 0`.',
  constraints: ['`1 <= temperatures.length <= 100000`', '`30 <= temperatures[i] <= 100`'],
  examples: [
    { input: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]', output: '[1, 1, 4, 2, 1, 1, 0, 0]', explanation: 'For day 0 (73°), the next warmer day is day 1 (74°), so answer is 1. For day 2 (75°), the next warmer day is day 6 (76°), so answer is 4.' },
    { input: 'temperatures = [30, 40, 50, 60]', output: '[1, 1, 1, 0]', explanation: 'Each day (except the last) has a warmer day immediately after.' },
  ],

  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {\n    int[] dailyTemperatures(int[] temperatures) {\n        // Write your code here\n        return new int[0];\n    }\n}`,
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'dailyTemperatures',
    signature: 'int[] dailyTemperatures(int[] temperatures)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250473,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (50000 + rng.nextInt(50001)) : (1000 + rng.nextInt(4001));
            int[] temps = new int[len];
            for (int j = 0; j < len; j++) temps[j] = 30 + rng.nextInt(71);
            // Reference: mono stack
            int[] expected = new int[len];
            java.util.Deque<Integer> stack = new java.util.ArrayDeque<>();
            for (int j = 0; j < len; j++) {
                while (!stack.isEmpty() && temps[stack.peek()] < temps[j]) {
                    int idx = stack.pop();
                    expected[idx] = j - idx;
                }
                stack.push(j);
            }
            try {
                int[] actual = s.dailyTemperatures(temps);
                boolean pass = java.util.Arrays.equals(actual, expected);
                System.out.println("AJ|stress-" + i + "|" + pass + "|" + (actual==null?"null":actual.length) + "|" + expected.length);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
