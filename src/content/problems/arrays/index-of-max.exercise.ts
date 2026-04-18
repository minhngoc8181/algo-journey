import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'index-of-max',
  version: 1,
  title: 'Index of Maximum',
  summary: 'Return the index of the first maximum value.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'extreme', 'cse201'],
  estimatedMinutes: 10,
  order: 406,
  mode: 'function_implementation',
  hints: [
    'Initialize `max_index` to 0. Assume the first element is the maximum.',
    'Loop from index 1 to the end of the array.',
    'If `numbers[i] > numbers[max_index]`, update `max_index = i`.',
    'Return `max_index` at the end.'
  ],
  
  learningGoals: ['Track the index of the running maximum'],
  statement: 'Given an array of integers `numbers`, find and return the index of its maximum value. If the maximum value occurs more than once, return the index of its first occurrence. The array is guaranteed to be non-empty.',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [7, 1, 7, 3, 7]', output: '0', explanation: 'Maximum is 7. It repeats, but index 0 is the first.' },
    { input: 'numbers = [2, 9, 4, 9, 1]', output: '1' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {\n    int indexOfMaxValue(int[] numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'indexOfMaxValue',
    signature: 'int indexOfMaxValue(int[] numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250423,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2000001) - 1000000;
            int expected = 0;
            for (int j = 1; j < len; j++) if (arr[j] > arr[expected]) expected = j;
            try {
                int actual = s.indexOfMaxValue(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
