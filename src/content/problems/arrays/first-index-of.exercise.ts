import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'first-index-of',
  version: 1,
  title: 'First Index Of',
  summary: 'Return the first index of target in the array.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'cse201'],
  estimatedMinutes: 10,
  order: 1,
  mode: 'function_implementation',

  learningGoals: ['Iterate through an array', 'Use comparison to find a match'],
  statement: 'Given an integer array `numbers` and a `target` value, return the first index where `target` appears. If it does not appear, return `-1`.',
  constraints: [
    'The array may be empty.',
    'If target appears multiple times, return the first index.',
  ],
  examples: [
    { input: 'numbers = [4, 2, 9, 2], target = 2', output: '1' },
    { input: 'numbers = [1, 3, 5], target = 4', output: '-1' },
  ],

  starter: {
    file: 'Solution.java',
    code: `class Solution {
    int firstIndexOf(int[] numbers, int target) {
        // Write your code here
        return -1;
    }
}`,
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'firstIndexOf',
    signature: 'int firstIndexOf(int[] numbers, int target)',
  },

  evaluation: { comparator: 'exact_json' },
});
