import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'rotate',
  version: 1,
  title: 'Rotate Array',
  summary: 'Return a new array rotated left or right by k positions.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['array-manipulation', 'cse201'],
  estimatedMinutes: 20,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Understand modulo arithmetic for array bounds', 'Copy slices of an array'],
  statement: 'Given an array of integers `numbers`, an integer `k`, and a string `direction` ("left" or "right"), return a new array that is the original array rotated by `k` positions in the specified direction.',
  constraints: ['The array may be empty.', '`k` can be strictly larger than the array length (wrap-around).'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4, 5], k = 1, direction = "left"', output: '[2, 3, 4, 5, 1]' },
    { input: 'numbers = [1, 2, 3, 4, 5], k = 2, direction = "right"', output: '[4, 5, 1, 2, 3]' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `class Solution {\n    int[] rotateArray(int[] numbers, int k, String direction) {\n        // Write your code here\n        return new int[0];\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'rotateArray',
    signature: 'int[] rotateArray(int[] numbers, int k, String direction)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250435,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            int k = rng.nextInt(len + 1);
            String dir = (rng.nextInt(2) == 0) ? "left" : "right";
            int shift = (dir.equals("left") ? k : len - k) % len;
            int[] expected = new int[len];
            for (int j = 0; j < len; j++) expected[j] = arr[(j + shift) % len];
            try {
                int[] actual = s.rotateArray(arr.clone(), k, dir);
                System.out.println("AJ|stress-" + i + "|" + java.util.Arrays.equals(actual, expected) + "|ok|ok");
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
