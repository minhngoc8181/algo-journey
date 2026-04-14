import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'count-unique',
  version: 1,
  title: 'Count Unique Values',
  summary: 'Return how many distinct values appear in the array.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['counting', 'set', 'cse201'],
  estimatedMinutes: 15,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Use a collection to track seen elements', 'Deduplicate values'],
  statement: 'Given an array of integers `numbers`, find and return the total number of unique values that appear in the array.',
  constraints: ['The array may be empty.'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4]', output: '4', explanation: 'All 4 numbers are unique.' },
    { input: 'numbers = [5, 5, 5, 5]', output: '1', explanation: 'Only the value 5 appears.' },
    { input: 'numbers = [1, 2, 1, 2, 3]', output: '3', explanation: 'The unique values are 1, 2, and 3.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.ArrayList;\n\nclass Solution {\n    int countUniqueValues(List<Integer> numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'countUniqueValues',
    signature: 'int countUniqueValues(List<Integer> numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
