import { defineExercise } from '../../_loader';
export default defineExercise({
  id: 'sum-array', version: 1, title: 'Sum of Array',
  summary: 'Compute the sum of all elements in an integer array.', topic: 'arrays', difficulty: 'easy',
  tags: ['accumulator', 'cse201'], estimatedMinutes: 8, order: 0, mode: 'function_implementation',
  learningGoals: ['Use an accumulator variable', 'Iterate through all elements'],
  statement: 'Given an integer array `arr`, return the sum of all its elements.',
  constraints: ['The array may be empty (return 0).'],
  examples: [{ input: 'arr = [1, 2, 3, 4, 5]', output: '15' }, { input: 'arr = []', output: '0' }],
  starter: { file: 'Solution.java', code: `class Solution {\n    int sumArray(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}` },
  requiredStructure: { className: 'Solution', methodName: 'sumArray', signature: 'int sumArray(int[] arr)' },
  evaluation: { comparator: 'exact_json' },
});
