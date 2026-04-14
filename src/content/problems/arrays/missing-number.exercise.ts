import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'missing-number',
  version: 1,
  title: 'Missing Number',
  summary: 'The array contains every number from 0 to n except one. Return the missing number.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['math', 'cse201'],
  estimatedMinutes: 10,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Understand arithmetic sum', 'Deduce missing elements optimally'],
  statement: 'Given an array of integers `numbers` containing `n` distinct numbers taken from the range `0` to `n` (inclusive), return the single number that is missing from the array.',
  constraints: ['The array has length `n`.', 'All numbers are unique and fall in the range `[0, n]`.'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4]', output: '0', explanation: 'n = 4. The range [0,4] is missing 0.' },
    { input: 'numbers = [0, 1, 2, 3]', output: '4', explanation: 'n = 4. The range [0,4] is missing 4.' },
    { input: 'numbers = [4, 2, 1, 0]', output: '3', explanation: 'n = 4. The range [0,4] is missing 3.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `class Solution {\n    int missingNumber(int[] numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'missingNumber',
    signature: 'int missingNumber(int[] numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250427,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            // Build [0..len] then remove one
            int missing = rng.nextInt(len + 1);
            int[] arr = new int[len];
            int idx = 0;
            for (int j = 0; j <= len; j++) if (j != missing) arr[idx++] = j;
            // shuffle
            for (int j = len - 1; j > 0; j--) {
                int k = rng.nextInt(j + 1);
                int tmp = arr[j]; arr[j] = arr[k]; arr[k] = tmp;
            }
            int expected = missing;
            try {
                int actual = s.missingNumber(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
