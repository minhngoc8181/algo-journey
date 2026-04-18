import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'index-of-min',
  version: 1,
  title: 'Index of Minimum',
  summary: 'Return the index of the first minimum value.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'extreme', 'cse201'],
  estimatedMinutes: 10,
  order: 407,
  mode: 'function_implementation',
  hints: [
    'Initialize `min_index` to 0. Assume the first element is the minimum.',
    'Loop from index 1 to the end of the array.',
    'If `numbers[i] < numbers[min_index]`, update `min_index = i`.',
    'Return `min_index` at the end.'
  ],
  
  learningGoals: ['Track the index of the running minimum'],
  statement: 'Given an array of integers `numbers`, find and return the index of its minimum value. If the minimum value occurs more than once, return the index of its first occurrence. The array is guaranteed to be non-empty.',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [1, -7, 3, -7, 4]', output: '1', explanation: 'Minimum is -7. It repeats, but index 1 is the first.' },
    { input: 'numbers = [6, 4, 2, 0]', output: '3' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {\n    int indexOfMinValue(int[] numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'indexOfMinValue',
    signature: 'int indexOfMinValue(int[] numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250424,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2000001) - 1000000;
            int expected = 0;
            for (int j = 1; j < len; j++) if (arr[j] < arr[expected]) expected = j;
            try {
                int actual = s.indexOfMinValue(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
