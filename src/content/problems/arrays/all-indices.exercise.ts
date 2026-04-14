import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'all-indices',
  version: 1,
  title: 'All Indices of Value',
  summary: 'Return an array containing every index where target appears.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'cse201'],
  estimatedMinutes: 10,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Accumulate results into a collection'],
  statement: 'Given an array of integers `numbers` and an integer `target`, return a list containing every index where `target` appears. The resulting list should be sorted in ascending order.',
  constraints: ['The input array may be empty.', 'The target may not exist in the array (return an empty list).'],
  examples: [
    { input: 'numbers = [8, 2, 5, 2, 9], target = 2', output: '[1, 3]' },
    { input: 'numbers = [4, 7, 1, 6], target = 9', output: '[]' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.ArrayList;\n\nclass Solution {\n    List<Integer> allIndicesOfValue(List<Integer> numbers, int target) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'allIndicesOfValue',
    signature: 'List<Integer> allIndicesOfValue(List<Integer> numbers, int target)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
