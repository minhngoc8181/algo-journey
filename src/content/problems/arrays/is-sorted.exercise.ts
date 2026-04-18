import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'is-sorted',
  version: 1,
  title: 'Check Array Is Sorted',
  summary: 'Return true when the array is already sorted in non-decreasing order.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'cse201'],
  estimatedMinutes: 10,
  order: 419,
  mode: 'function_implementation',
  hints: [
    'Loop through the array from index 0 to `length - 2`.',
    'Compare `arr[i]` and `arr[i+1]`. If `arr[i] > arr[i+1]`, the array is not sorted, so return `false`.',
    'If the loop completes without finding any such out-of-order pair, return `true`.'
  ],
  
  learningGoals: ['Check adjacent elements', 'Early exit when condition fails'],
  statement: 'Given an array of integers `numbers`, return `true` if the array is sorted in non-decreasing order (elements are equal to or larger than the previous element), and `false` otherwise.',
  constraints: ['The array may have less than 2 elements (which are inherently sorted).'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4]', output: 'true' },
    { input: 'numbers = [1, 1, 2, 2, 3]', output: 'true', explanation: 'Non-decreasing array with duplicates.' },
    { input: 'numbers = [1, 3, 2, 4]', output: 'false', explanation: '3 is greater than 2.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {\n    boolean isSortedAscending(int[] numbers) {\n        // Write your code here\n        return true;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'isSortedAscending',
    signature: 'boolean isSortedAscending(int[] numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250421,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            // Half sorted, half not
            boolean sorted = (i % 2 == 0);
            if (sorted) {
                arr[0] = rng.nextInt(10);
                for (int j = 1; j < len; j++) arr[j] = arr[j-1] + rng.nextInt(5);
            } else {
                for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
                arr[rng.nextInt(len)] = -999999; // guarantee unsorted
            }
            boolean expected = true;
            for (int j = 1; j < len; j++) if (arr[j] < arr[j-1]) { expected = false; break; }
            try {
                boolean actual = s.isSortedAscending(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
