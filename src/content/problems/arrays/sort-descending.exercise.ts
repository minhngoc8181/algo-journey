import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'sort-descending',
  version: 1,
  title: 'Sort Descending',
  summary: 'Return a new array sorted from largest to smallest.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['sorting', 'cse201'],
  estimatedMinutes: 20,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Understand comparison-based sorting', 'Sort an array in descending order'],
  statement: 'Given an array of integers `numbers`, return a new array sorted in strictly descending order (from largest to smallest). The original array should not be modified.',
  constraints: ['The array may contain duplicate elements.', 'The array might be empty.'],
  examples: [
    { input: 'numbers = [4, 1, 3, 2]', output: '[4, 3, 2, 1]' },
    { input: 'numbers = [-3, 0, 2, -1]', output: '[2, 0, -1, -3]' },
    { input: 'numbers = [5, 5, 2, 2, 1]', output: '[5, 5, 2, 2, 1]' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.ArrayList;\nimport java.util.Collections;\n\nclass Solution {\n    List<Integer> sortDescending(List<Integer> numbers) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'sortDescending',
    signature: 'List<Integer> sortDescending(List<Integer> numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
