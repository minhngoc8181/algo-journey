import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'stock-span',
  version: 1,
  title: 'Stock Span',
  summary: 'Calculate the span of stock prices for each day.',
  topic: 'mono-stack',
  difficulty: 'medium',
  tags: ['mono-stack', 'stack', 'cse201'],
  estimatedMinutes: 25,
  order: 434,
  mode: 'function_implementation',
  hints: [
    'The span of day `i` is the number of consecutive days just before (and including) day `i` where the price was less than or equal to `prices[i]`.',
    'This is equivalent to finding the **previous greater element**: the span is `i - index_of_previous_greater_element`. If none exists, the span is `i + 1`.',
    'Use a stack that stores indices. Pop while `prices[stack.top()] <= prices[i]`. The answer for day `i` is `i - stack.top()` (or `i + 1` if stack is empty).',
  ],

  learningGoals: ['Apply the previous-greater-element pattern', 'Transform a monotonic stack result into span lengths'],
  statement: 'Given an array `prices` where `prices[i]` is the stock price on day `i`, compute the **span** of the stock for each day.\n\nThe span of day `i` is defined as the maximum number of consecutive days just before day `i` (including day `i` itself) for which the stock price was **less than or equal to** the price on day `i`.\n\nReturn an array of spans.',
  constraints: ['`1 <= prices.length <= 100000`', '`1 <= prices[i] <= 10^5`'],
  examples: [
    { input: 'prices = [100, 80, 60, 70, 60, 75, 85]', output: '[1, 1, 1, 2, 1, 4, 6]', explanation: 'Day 5 (price=75): days 4,3,2 have prices 60,70,60 all ≤75, so span = 4. Day 6 (price=85): days 5,4,3,2,1 have prices 75,60,70,60,80 all ≤85, so span = 6.' },
    { input: 'prices = [10, 20, 30, 40]', output: '[1, 2, 3, 4]', explanation: 'Strictly increasing — each day\'s span extends to the beginning.' },
  ],

  starter: {
    file: 'Solution.java',
    code: `class Solution {\n    int[] stockSpan(int[] prices) {\n        // Write your code here\n        return new int[0];\n    }\n}`,
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'stockSpan',
    signature: 'int[] stockSpan(int[] prices)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250472,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (50000 + rng.nextInt(50001)) : (1000 + rng.nextInt(4001));
            int[] prices = new int[len];
            for (int j = 0; j < len; j++) prices[j] = rng.nextInt(100000) + 1;
            // Reference: mono stack for previous greater element
            int[] expected = new int[len];
            java.util.Deque<Integer> stack = new java.util.ArrayDeque<>();
            for (int j = 0; j < len; j++) {
                while (!stack.isEmpty() && prices[stack.peek()] <= prices[j]) {
                    stack.pop();
                }
                expected[j] = stack.isEmpty() ? (j + 1) : (j - stack.peek());
                stack.push(j);
            }
            try {
                int[] actual = s.stockSpan(prices);
                boolean pass = java.util.Arrays.equals(actual, expected);
                System.out.println("AJ|stress-" + i + "|" + pass + "|" + (actual==null?"null":actual.length) + "|" + expected.length);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
