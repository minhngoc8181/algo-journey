import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'remove-duplicates',
  version: 1,
  title: 'Remove Duplicates',
  summary: 'Return a new array keeping only the first occurrence of each value.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['deduplication', 'cse201'],
  estimatedMinutes: 15,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Filter out elements that have been seen already linearly'],
  statement: 'Given an array of integers `numbers`, return a new array (or list) which contains the exact same elements in the original order, but with all duplicate occurrences removed (keep only the first occurrence).',
  constraints: ['The array may be empty.'],
  examples: [
    { input: 'numbers = [5, 5, 2, 2, 1]', output: '[5, 2, 1]' },
    { input: 'numbers = [-3, 0, 2, -1]', output: '[-3, 0, 2, -1]' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.ArrayList;\n\nclass Solution {\n    List<Integer> removeDuplicates(List<Integer> numbers) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'removeDuplicates',
    signature: 'List<Integer> removeDuplicates(List<Integer> numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
