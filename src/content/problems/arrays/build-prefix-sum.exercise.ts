import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'build-prefix-sum',
  version: 1,
  title: 'Build Prefix Sum',
  summary: 'Return a prefix sum array where prefix[i] is the sum of elements from 0 to i-1.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['prefix-sum', 'cse201'],
  estimatedMinutes: 20,
  order: 431,
  mode: 'function_implementation',
  hints: [
    'Create a new array `ans` of size `n + 1` to hold the prefix sums.',
    'The first element `ans[0]` is naturally 0. Loop through the input array starting from `i = 0`.',
    'For each element, calculate the next prefix sum: `ans[i + 1] = ans[i] + numbers[i]`.',
    'Return the resulting `ans` array.'
  ],
  
  learningGoals: ['Understand the prefix sum concept', 'Accumulate sums optimally'],
  statement: 'Given an array of `n` integers `numbers`, return a prefix sum array of length `n+1` where `prefix[0] = 0` and `prefix[i]` equals the sum of elements from index `0` to `i-1`.',
  constraints: ['The array may be empty (returns `[0]`).'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4]', output: '[0, 1, 3, 6, 10]', explanation: 'prefix[0] = 0. prefix[1] = 0+1=1. prefix[2]=1+2=3. prefix[3]=3+3=6. prefix[4]=6+4=10.' },
    { input: 'numbers = [-1, 2, -3]', output: '[0, -1, 1, -2]' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {\n    int[] buildPrefixSum(int[] numbers) {\n        // Write your code here\n        return new int[0];\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'buildPrefixSum',
    signature: 'int[] buildPrefixSum(int[] numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250431,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            int[] expected = new int[len + 1];
            for (int j = 0; j < len; j++) expected[j + 1] = expected[j] + arr[j];
            try {
                int[] actual = s.buildPrefixSum(arr);
                System.out.println("AJ|stress-" + i + "|" + java.util.Arrays.equals(actual, expected) + "|len=" + (actual==null?-1:actual.length) + "|len=" + expected.length);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
