import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'first-index-of',
  version: 1,
  title: 'First Index Of',
  summary: 'Return the first index of target in the array.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'cse201'],
  estimatedMinutes: 10,
  order: 401,
  mode: 'function_implementation',
  hints: [
    'Use a `for` loop to check each element starting from index 0.',
    'If you find an element `numbers[i] == target`, immediately return the index `i`.',
    'If the loop finishes without finding the target, return `-1`.'
  ],

  learningGoals: ['Iterate through an array', 'Use comparison to find a match'],
  statement: 'Given an integer array `numbers` and a `target` value, return the first index where `target` appears. If it does not appear, return `-1`.',
  constraints: [
    'The array may be empty.',
    'If target appears multiple times, return the first index.',
  ],
  examples: [
    { input: 'numbers = [4, 2, 9, 2], target = 2', output: '1' },
    { input: 'numbers = [1, 3, 5], target = 4', output: '-1' },
  ],

  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {
    int firstIndexOf(int[] numbers, int target) {
        // Write your code here
        return -1;
    }
}`,
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'firstIndexOf',
    signature: 'int firstIndexOf(int[] numbers, int target)',
  },

  evaluation: {
    comparator: 'exact_json',
    /**
     * Large-array stress tests (up to 100K elements) using Java's RNG.
     * Generated programmatically inside Wasm — no literals, no IO imports.
     * Reference: linear scan O(n). Tests algorithmic complexity.
     */
    javaGenerator: {
      count: 10,
      seed: 20250414,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 10; i++) {
            int len = (i >= 8) ? (80000 + rng.nextInt(20001)) : (500 + rng.nextInt(1500));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(1001) - 500;
            int tgt = arr.length > 0 ? arr[rng.nextInt(arr.length)] : rng.nextInt(1001) + 1000;
            // Reference: O(n) linear scan (always correct)
            int expected = -1;
            for (int j = 0; j < arr.length; j++) {
                if (arr[j] == tgt) { expected = j; break; }
            }
            try {
                int actual = s.firstIndexOf(arr, tgt);
                boolean pass = (actual == expected);
                System.out.println("AJ|stress-" + i + "|" + pass + "|" + actual + "|" + expected);
            } catch (Exception e) {
                System.out.println("AJ_ERROR|stress-" + i + ": " + e);
            }
        }`,
    },
  },
});
