import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'range-sum-queries',
  version: 1,
  title: 'Range Sum Queries',
  summary: 'Efficiently compute the sum of elements in a range using prefix sums.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['prefix-sum', 'cse201'],
  estimatedMinutes: 25,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Understand and implement the prefix sum technique', 'Optimize multiple range queries'],
  statement: 'Given an array of integers `numbers` and a list of queries where each query is a pair of indices `[l, r]`, return a new list of integers where the `i`-th integer is the sum of the elements in `numbers` from index `l` to `r` (inclusive). Use the prefix sum technique for maximum efficiency.',
  constraints: ['`0 <= l <= r < numbers.length`'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4, 5], queries = [[0, 4], [1, 3], [2, 2]]', output: '[15, 9, 3]', explanation: 'Sum of [0,4] is 15. Sum of [1,3] is 2+3+4=9. Sum of [2,2] is 3.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.ArrayList;\n\nclass Solution {\n    List<Integer> rangeSumQueries(int[] numbers, int[][] queries) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'rangeSumQueries',
    signature: 'List<Integer> rangeSumQueries(int[] numbers, int[][] queries)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250439,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            int qCount = 50 + rng.nextInt(51);
            int[][] queries = new int[qCount][2];
            for (int q = 0; q < qCount; q++) {
                int l = rng.nextInt(len), r = l + rng.nextInt(len - l);
                queries[q][0] = l; queries[q][1] = r;
            }
            // Reference: prefix sum
            int[] prefix = new int[len + 1];
            for (int j = 0; j < len; j++) prefix[j+1] = prefix[j] + arr[j];
            int[] expected = new int[qCount];
            for (int q = 0; q < qCount; q++) expected[q] = prefix[queries[q][1]+1] - prefix[queries[q][0]];
            try {
                java.util.List<Integer> actual = s.rangeSumQueries(arr, queries);
                boolean pass = actual != null && actual.size() == qCount;
                if (pass) for (int q = 0; q < qCount; q++) if (actual.get(q) != expected[q]) { pass = false; break; }
                System.out.println("AJ|stress-" + i + "|" + pass + "|size=" + (actual==null?-1:actual.size()) + "|size=" + qCount);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
