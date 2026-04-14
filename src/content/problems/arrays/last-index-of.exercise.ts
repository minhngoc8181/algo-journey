import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'last-index-of',
  version: 1,
  title: 'Last Index Of',
  summary: 'Return the last index where target appears, or -1 if it does not exist.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'cse201'],
  estimatedMinutes: 10,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Iterate array backwards', 'Return early when found'],
  statement: 'Given an array of integers `numbers` and an integer `target`, return the last index at which `target` appears in the array. If it does not exist, return `-1`.',
  constraints: [],
  examples: [
    { input: 'numbers = [8, 2, 5, 2, 9], target = 2', output: '3', explanation: 'Target 2 appears at index 1 and 3. The last index is 3.' },
    { input: 'numbers = [4, 7, 1, 6], target = 9', output: '-1' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\n\nclass Solution {\n    int lastIndexOfValue(List<Integer> numbers, int target) {\n        // Write your code here\n        return -1;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'lastIndexOfValue',
    signature: 'int lastIndexOfValue(List<Integer> numbers, int target)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
