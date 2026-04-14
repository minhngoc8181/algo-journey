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
    code: `import java.util.List;\nimport java.util.ArrayList;\n\nclass Solution {\n    List<List<Integer>> pairsWithTargetSum(List<Integer> numbers, int target) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'pairsWithTargetSum',
    signature: 'List<List<Integer>> pairsWithTargetSum(List<Integer> numbers, int target)',
  },

  evaluation: {
    comparator: 'unordered_json',
  },
});
