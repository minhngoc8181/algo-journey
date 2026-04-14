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
    code: `import java.util.List;\nimport java.util.ArrayList;\n\nclass Solution {\n    List<Integer> rangeSumQueries(List<Integer> numbers, List<List<Integer>> queries) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'rangeSumQueries',
    signature: 'List<Integer> rangeSumQueries(List<Integer> numbers, List<List<Integer>> queries)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
