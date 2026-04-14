import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'pairs-with-sum',
  version: 1,
  title: 'Pairs with Given Sum',
  summary: 'Return unique pairs [a, b] that sum to a target value.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['two-pointers', 'hashing', 'cse201'],
  estimatedMinutes: 20,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Find complementing values optimally', 'Guarantee pair uniqueness'],
  statement: 'Given an array of integers `numbers` and an integer `target`, return a list of all unique pairs `[a, b]` (with `a <= b`) such that `a + b == target`. The order of pairs in the output list does not matter.',
  constraints: ['A given pair of values should only appear once in the output.', 'Ensure `a <= b` for each pair.'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4, 5], target = 6', output: '[[1, 5], [2, 4]]' },
    { input: 'numbers = [3, 3, 3, 3], target = 6', output: '[[3, 3]]', explanation: 'Duplicate elements form a single unique pair.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.ArrayList;\n\nclass Solution {\n    List<List<Integer>> pairsWithTargetSum(int[] numbers, int target) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'pairsWithTargetSum',
    signature: 'List<List<Integer>> pairsWithTargetSum(int[] numbers, int target)',
  },

  evaluation: {
    comparator: 'unordered_json',
    javaGenerator: {
      count: 5,
      seed: 20250444,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            // pairs-with-sum is O(n^2) for brute-force; use moderate sizes
            int len = (i >= 3) ? (5000 + rng.nextInt(2001)) : (2000 + rng.nextInt(1001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(201) - 100;
            int target = rng.nextInt(101) - 50;
            java.util.HashSet<String> seenKeys = new java.util.HashSet<>();
            java.util.ArrayList<int[]> expPairs = new java.util.ArrayList<>();
            for (int x2 = 0; x2 < len; x2++) for (int y2 = x2+1; y2 < len; y2++) {
                if (arr[x2] + arr[y2] == target) {
                    int a2 = Math.min(arr[x2], arr[y2]), b2 = Math.max(arr[x2], arr[y2]);
                    String key = a2 + ":" + b2;
                    if (seenKeys.add(key)) expPairs.add(new int[]{a2, b2});
                }
            }
            try {
                java.util.List<java.util.List<Integer>> actual = s.pairsWithTargetSum(arr, target);
                boolean pass = actual != null && actual.size() == expPairs.size();
                System.out.println("AJ|stress-" + i + "|" + pass + "|size=" + (actual==null?-1:actual.size()) + "|size=" + expPairs.size());
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
