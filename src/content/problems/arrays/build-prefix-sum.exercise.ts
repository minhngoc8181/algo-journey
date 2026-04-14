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
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Understand the prefix sum concept', 'Accumulate sums optimally'],
  statement: 'Given an array of `n` integers `numbers`, return a prefix sum array of length `n+1` where `prefix[0] = 0` and `prefix[i]` equals the sum of elements from index `0` to `i-1`.',
  constraints: ['The array may be empty (returns `[0]`).'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4]', output: '[0, 1, 3, 6, 10]', explanation: 'prefix[0] = 0. prefix[1] = 0+1=1. prefix[2]=1+2=3. prefix[3]=3+3=6. prefix[4]=6+4=10.' },
    { input: 'numbers = [-1, 2, -3]', output: '[0, -1, 1, -2]' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.ArrayList;\n\nclass Solution {\n    List<Integer> buildPrefixSum(List<Integer> numbers) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'buildPrefixSum',
    signature: 'List<Integer> buildPrefixSum(List<Integer> numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
