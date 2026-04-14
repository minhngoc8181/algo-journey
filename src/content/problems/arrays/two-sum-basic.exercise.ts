import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'two-sum-basic',
  version: 1,
  title: 'Two Sum Basic',
  summary: 'Find two indices whose values add up to a target.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['array-traversal', 'hash-map'],
  estimatedMinutes: 15,
  order: 2,
  mode: 'function_implementation',

  learningGoals: ['Use nested loops or HashMap for lookup', 'Return indices'],
  statement: 'Given an integer array `numbers` and a `target`, return the indices of two numbers that add up to the target. You may assume exactly one valid answer exists.',
  constraints: ['Return indices in any order.', 'You may not use the same element twice.'],
  examples: [
    { input: 'numbers = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'numbers[0] + numbers[1] = 9' },
  ],

  starter: {
    file: 'Solution.java',
    code: `class Solution {
    int[] twoSum(int[] numbers, int target) {
        // Write your code here
        return new int[]{-1, -1};
    }
}`,
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'twoSum',
    signature: 'int[] twoSum(int[] numbers, int target)',
  },

  evaluation: { comparator: 'unordered_json',
    javaGenerator: {
      count: 5,
      seed: 20250441,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            // Guarantee a valid pair exists
            int p = rng.nextInt(len / 2), q = len / 2 + rng.nextInt(len / 2);
            int target = arr[p] + arr[q];
            java.util.HashMap<Integer, Integer> map = new java.util.HashMap<>();
            int[] expected = {-1, -1};
            for (int j = 0; j < len; j++) {
                int comp = target - arr[j];
                if (map.containsKey(comp)) { expected[0] = map.get(comp); expected[1] = j; break; }
                map.put(arr[j], j);
            }
            try {
                int[] actual = s.twoSum(arr, target);
                boolean pass = actual != null && actual.length == 2 &&
                    actual[0] >= 0 && actual[1] > actual[0] &&
                    arr[actual[0]] + arr[actual[1]] == target;
                System.out.println("AJ|stress-" + i + "|" + pass + "|sum=" + (actual==null?-1:(arr[actual[0]]+arr[actual[1]])) + "|target=" + target);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
