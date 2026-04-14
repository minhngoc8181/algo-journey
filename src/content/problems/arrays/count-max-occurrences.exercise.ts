import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'count-max-occurrences',
  version: 1,
  title: 'Count Max Occurrences',
  summary: 'Find the maximum value first, then count how often it appears.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'counting', 'cse201'],
  estimatedMinutes: 10,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Combine multiple logical passes over an array'],
  statement: 'Given a non-empty array of integers `numbers`, find its maximum value, and then return how many times that maximum value appears in the array.',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [1, 9, 2, 9, 3]', output: '2', explanation: 'The maximum value is 9. It occurs 2 times.' },
    { input: 'numbers = [5, 5, 5, 5]', output: '4', explanation: 'The maximum value is 5. It occurs 4 times.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `class Solution {\n    int countMaxOccurrences(int[] numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'countMaxOccurrences',
    signature: 'int countMaxOccurrences(int[] numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250429,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(1000);
            int max = arr[0];
            for (int x : arr) if (x > max) max = x;
            int expected = 0;
            for (int x : arr) if (x == max) expected++;
            try {
                int actual = s.countMaxOccurrences(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
