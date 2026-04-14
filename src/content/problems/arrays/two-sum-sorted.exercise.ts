import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'two-sum-sorted',
  version: 1,
  title: 'Two Sum (Sorted)',
  summary: 'Find two indices in a sorted array that sum to a target.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['two-pointers', 'cse201'],
  estimatedMinutes: 20,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Use the two-pointer technique to find pairs efficiently', 'Take advantage of sorted data'],
  statement: 'Given a sorted array of integers `numbers` and a `target` sum, find two distinct indices `[i, j]` such that `numbers[i] + numbers[j] == target` (with `i < j`). Return `[-1, -1]` if no such pair exists.',
  constraints: ['The array is sorted in non-decreasing order.', 'If there are multiple valid pairs, returning any correct pair is acceptable (though typically the two-pointer approach finds the outermost valid pair first).'],
  examples: [
    { input: 'numbers = [-3, 1, 4, 7, 11], target = 8', output: '[1, 3]', explanation: 'numbers[1] + numbers[3] = 1 + 7 = 8.' },
    { input: 'numbers = [1, 2, 3, 4, 5], target = 20', output: '[-1, -1]', explanation: 'No two elements sum to 20.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `class Solution {\n    int[] twoSumSorted(int[] numbers, int target) {\n        // Write your code here\n        return new int[]{-1, -1};\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'twoSumSorted',
    signature: 'int[] twoSumSorted(int[] numbers, int target)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250433,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2000001) - 1000000;
            java.util.Arrays.sort(arr);
            // Pick two random indices to form target
            int p = rng.nextInt(len / 2), q = len / 2 + rng.nextInt(len / 2);
            int target = arr[p] + arr[q];
            int lo = 0, hi = len - 1; int[] expected = {-1, -1};
            while (lo < hi) {
                int s2 = arr[lo] + arr[hi];
                if (s2 == target) { expected[0] = lo; expected[1] = hi; break; }
                else if (s2 < target) lo++; else hi--;
            }
            try {
                int[] actual = s.twoSumSorted(arr, target);
                boolean pass = actual != null && actual.length == 2 && actual[0] == expected[0] && actual[1] == expected[1];
                System.out.println("AJ|stress-" + i + "|" + pass + "|[" + (actual==null?"null":actual[0]+","+actual[1]) + "]|[" + expected[0] + "," + expected[1] + "]");
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
