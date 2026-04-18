import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'find-min',
  version: 1,
  title: 'Find Minimum Value',
  summary: 'Return the minimum number in a non-empty array.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'extreme', 'cse201'],
  estimatedMinutes: 10,
  order: 405,
  mode: 'function_implementation',
  hints: [
    'Initialize a variable `min_val` assuming the first element `numbers[0]` is the minimum.',
    'Loop from index 1 to the end of the array.',
    'If you find an element smaller than your assumed `min_val`, update `min_val`.',
    'Return `min_val` at the end.'
  ],
  
  learningGoals: ['Track running minimum while iterating'],
  statement: 'Given an array of integers `numbers`, find and return the minimum value. The array is guaranteed to be non-empty.',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [3, 8, 1, 6]', output: '1' },
    { input: 'numbers = [-4, -9, -2, -9]', output: '-9' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {\n    int findMinValue(int[] numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'findMinValue',
    signature: 'int findMinValue(int[] numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250416,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2000001) - 1000000;
            int expected = arr[0];
            for (int x : arr) if (x < expected) expected = x;
            try {
                int actual = s.findMinValue(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
