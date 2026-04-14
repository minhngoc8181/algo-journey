import { defineExercise } from '../../_loader';
export default defineExercise({
  id: 'sum-array', version: 1, title: 'Sum of Array',
  summary: 'Compute the sum of all elements in an integer array.', topic: 'arrays', difficulty: 'easy',
  tags: ['accumulator', 'cse201'], estimatedMinutes: 8, order: 0, mode: 'function_implementation',
  learningGoals: ['Use an accumulator variable', 'Iterate through all elements'],
  statement: 'Given an integer array `arr`, return the sum of all its elements.',
  constraints: ['The array may be empty (return 0).'],
  examples: [{ input: 'arr = [1, 2, 3, 4, 5]', output: '15' }, { input: 'arr = []', output: '0' }],
  starter: { file: 'Solution.java', code: `class Solution {\n    int sumArray(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}` },
  requiredStructure: { className: 'Solution', methodName: 'sumArray', signature: 'int sumArray(int[] arr)' },
  evaluation: { comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250414,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            int expected = 0;
            for (int x : arr) expected += x;
            try {
                int actual = s.sumArray(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
