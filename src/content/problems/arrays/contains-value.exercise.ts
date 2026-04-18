import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'contains-value',
  version: 1,
  title: 'Contains Value',
  summary: 'Return true when target exists in the array, otherwise false.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'cse201'],
  estimatedMinutes: 10,
  order: 403,
  mode: 'function_implementation',
  hints: [
    'This problem requires a basic linear search.',
    'Use a `for` loop to check each element in the array one by one.',
    'If the current element equals the target value, immediately return `true`.',
    'If the loop finishes checking all elements without finding the target, return `false`.'
  ],
  
  learningGoals: ['Linear Array Traversal', 'Early exit when condition met'],
  statement: 'Given an array of integers `numbers` and an integer `target`, return `true` if `target` exists in the array, and `false` otherwise.',
  constraints: ['The array may be empty.'],
  examples: [
    { input: 'numbers = [4, 7, 1, 6], target = 9', output: 'false' },
    { input: 'numbers = [8, 2, 5, 2, 9], target = 2', output: 'true' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {\n    boolean containsValue(int[] numbers, int target) {\n        // Write your code here\n        return false;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'containsValue',
    signature: 'boolean containsValue(int[] numbers, int target)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250418,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            // Alternate: present vs absent target
            int target = (i % 2 == 0) ? arr[rng.nextInt(len)] : (1001 + rng.nextInt(1000));
            boolean expected = false;
            for (int x : arr) if (x == target) { expected = true; break; }
            try {
                boolean actual = s.containsValue(arr, target);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
