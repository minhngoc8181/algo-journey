import { defineExercise } from '../../_loader';
export default defineExercise({
  id: 'max-element', version: 1, title: 'Maximum Element',
  summary: 'Find the maximum element in an array.', topic: 'arrays', difficulty: 'easy',
  tags: ['linear-search', 'extreme', 'cse201'], estimatedMinutes: 10, order: 2, mode: 'function_implementation',
  learningGoals: ['Track running maximum while iterating'],
  statement: 'Given an integer array `arr`, return the maximum element.',
  constraints: ['The array has at least one element.'],
  examples: [{ input: 'arr = [3, 1, 4, 1, 5, 9]', output: '9' }],
  starter: { file: 'Solution.java', code: `class Solution {\n    int maxElement(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}` },
  requiredStructure: { className: 'Solution', methodName: 'maxElement', signature: 'int maxElement(int[] arr)' },
  evaluation: { comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250417,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2000001) - 1000000;
            int expected = arr[0];
            for (int x : arr) if (x > expected) expected = x;
            try {
                int actual = s.maxElement(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
