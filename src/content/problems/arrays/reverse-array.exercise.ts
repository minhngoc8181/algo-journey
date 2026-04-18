import { defineExercise } from '../../_loader';
export default defineExercise({
  id: 'reverse-array', version: 1, title: 'Reverse Array',
  summary: 'Reverse an integer array in place.', topic: 'arrays', difficulty: 'easy',
  tags: ['two-pointers', 'in-place', 'cse201'], estimatedMinutes: 10, order: 414, mode: 'function_implementation',
  hints: [
    'Use the two-pointer technique: one pointer `left` at the start (0), and one pointer `right` at the end (`length - 1`).',
    'Swap the elements at `left` and `right`.',
    'Increment `left` and decrement `right`.',
    'Repeat this until `left` meets or passes `right`.'
  ],
  learningGoals: ['Use two pointers to swap elements', 'Modify array in place'],
  statement: 'Given an integer array `arr`, reverse it in place and return the array.',
  constraints: ['Modify the original array.'],
  examples: [{ input: 'arr = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' }],
  starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    int[] reverseArray(int[] arr) {\n        // Write your code here\n        return arr;\n    }\n}` },
  requiredStructure: { className: 'Solution', methodName: 'reverseArray', signature: 'int[] reverseArray(int[] arr)' },
  evaluation: { comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250426,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            int[] expected = new int[len];
            for (int j = 0; j < len; j++) expected[j] = arr[arr.length - 1 - j];
            try {
                int[] actual = s.reverseArray(arr.clone());
                System.out.println("AJ|stress-" + i + "|" + java.util.Arrays.equals(actual, expected) + "|" + java.util.Arrays.toString(actual) + "|" + java.util.Arrays.toString(expected));
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
