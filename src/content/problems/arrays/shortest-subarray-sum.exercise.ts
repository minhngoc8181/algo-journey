import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'shortest-subarray-sum',
  version: 1,
  title: 'Shortest Subarray With Sum ≥ Target',
  summary: 'Find the length of the shortest contiguous subarray whose sum is at least a target value.',
  topic: 'arrays',
  difficulty: 'hard',
  tags: ['sliding-window', 'two-pointers', 'cse201'],
  estimatedMinutes: 25,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Apply sliding window techniques to variable-length subarrays'],
  statement: 'Given an array of **positive** integers `numbers` and an integer `target`, return the length of the shortest contiguous subarray whose sum is greater than or equal to `target`. If there is no such subarray, return `0`.',
  constraints: ['All elements in the array are positive integers.', 'target > 0'],
  examples: [
    { input: 'numbers = [2, 3, 1, 2, 4, 3], target = 7', output: '2', explanation: 'The shortest subarray with a sum >= 7 is [4, 3] which has length 2.' },
    { input: 'numbers = [1, 4, 4], target = 4', output: '1', explanation: 'The subarray [4] has length 1.' },
    { input: 'numbers = [1, 1, 1, 1, 1], target = 11', output: '0', explanation: 'No subarray sums to 11.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\n\nclass Solution {\n    int shortestSubarraySum(List<Integer> numbers, int target) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'shortestSubarraySum',
    signature: 'int shortestSubarraySum(List<Integer> numbers, int target)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
