import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'last-index-of',
  version: 1,
  title: 'Last Index Of',
  summary: 'Return the last index where target appears, or -1 if it does not exist.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'cse201'],
  estimatedMinutes: 10,
  order: 402,
  mode: 'function_implementation',
  hints: [
    'Use a `for` loop, but start from the end of the array (`length - 1`) and decrement down to 0.',
    'If `numbers[i] == target`, immediately return `i` since this is the first match from the end.',
    'If the loop finishes without finding the target, return `-1`.'
  ],
  
  learningGoals: ['Iterate array backwards', 'Return early when found'],
  statement: 'Given an array of integers `numbers` and an integer `target`, return the last index at which `target` appears in the array. If it does not exist, return `-1`.',
  constraints: [],
  examples: [
    { input: 'numbers = [8, 2, 5, 2, 9], target = 2', output: '3', explanation: 'Target 2 appears at index 1 and 3. The last index is 3.' },
    { input: 'numbers = [4, 7, 1, 6], target = 9', output: '-1' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {\n    int lastIndexOfValue(int[] numbers, int target) {\n        // Write your code here\n        return -1;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'lastIndexOfValue',
    signature: 'int lastIndexOfValue(int[] numbers, int target)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250419,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(201) - 100;
            int target = arr[rng.nextInt(len)];
            int expected = -1;
            for (int j = arr.length - 1; j >= 0; j--) if (arr[j] == target) { expected = j; break; }
            try {
                int actual = s.lastIndexOfValue(arr, target);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
