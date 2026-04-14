import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'sort-descending',
  version: 1,
  title: 'Sort Descending',
  summary: 'Return a new array sorted from largest to smallest.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['sorting', 'cse201'],
  estimatedMinutes: 20,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Understand comparison-based sorting', 'Sort an array in descending order'],
  statement: 'Given an array of integers `numbers`, return a new array sorted in strictly descending order (from largest to smallest). The original array should not be modified.',
  constraints: ['The array may contain duplicate elements.', 'The array might be empty.'],
  examples: [
    { input: 'numbers = [4, 1, 3, 2]', output: '[4, 3, 2, 1]' },
    { input: 'numbers = [-3, 0, 2, -1]', output: '[2, 0, -1, -3]' },
    { input: 'numbers = [5, 5, 2, 2, 1]', output: '[5, 5, 2, 2, 1]' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.Arrays;\n\nclass Solution {\n    int[] sortDescending(int[] numbers) {\n        // Write your code here\n        return new int[0];\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'sortDescending',
    signature: 'int[] sortDescending(int[] numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250430,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2000001) - 1000000;
            int[] expected = arr.clone();
            java.util.Arrays.sort(expected);
            int lo = 0, hi = expected.length - 1;
            while (lo < hi) { int t = expected[lo]; expected[lo++] = expected[hi]; expected[hi--] = t; }
            try {
                int[] actual = s.sortDescending(arr.clone());
                System.out.println("AJ|stress-" + i + "|" + java.util.Arrays.equals(actual, expected) + "|" + actual.length + " elems|" + expected.length + " elems");
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
