import { defineExercise } from '../../_loader';
export default defineExercise({
  id: 'count-occurrences', version: 1, title: 'Count Occurrences',
  summary: 'Count how many times a target appears in an array.', topic: 'arrays', difficulty: 'easy',
  tags: ['linear-search', 'counting', 'cse201'], estimatedMinutes: 10, order: 5, mode: 'function_implementation',
  learningGoals: ['Count matching elements during iteration'],
  statement: 'Given an integer array `arr` and a `target`, return the number of times `target` appears in `arr`.',
  constraints: [],
  examples: [{ input: 'arr = [1, 2, 3, 2, 1], target = 2', output: '2' }],
  starter: { file: 'Solution.java', code: `class Solution {\n    int countOccurrences(int[] arr, int target) {\n        // Write your code here\n        return 0;\n    }\n}` },
  requiredStructure: { className: 'Solution', methodName: 'countOccurrences', signature: 'int countOccurrences(int[] arr, int target)' },
  evaluation: { comparator: 'exact_json' },
});
