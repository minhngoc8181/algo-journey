import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'count-unique',
  version: 1,
  title: 'Count Unique Values',
  summary: 'Return how many distinct values appear in the array.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['counting', 'set', 'cse201'],
  estimatedMinutes: 15,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Use a collection to track seen elements', 'Deduplicate values'],
  statement: 'Given an array of integers `numbers`, find and return the total number of unique values that appear in the array.',
  constraints: ['The array may be empty.'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4]', output: '4', explanation: 'All 4 numbers are unique.' },
    { input: 'numbers = [5, 5, 5, 5]', output: '1', explanation: 'Only the value 5 appears.' },
    { input: 'numbers = [1, 2, 1, 2, 3]', output: '3', explanation: 'The unique values are 1, 2, and 3.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `class Solution {\n    int countUniqueValues(int[] numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'countUniqueValues',
    signature: 'int countUniqueValues(int[] numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250428,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(1000);
            java.util.HashSet<Integer> seen = new java.util.HashSet<>();
            for (int x : arr) seen.add(x);
            int expected = seen.size();
            try {
                int actual = s.countUniqueValues(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
