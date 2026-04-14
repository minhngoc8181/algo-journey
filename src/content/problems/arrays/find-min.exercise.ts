import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'find-min',
  version: 1,
  title: 'Find Minimum Value',
  summary: 'Return the minimum number in a non-empty array.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'extreme', 'cse201'],
  estimatedMinutes: 10,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Track running minimum while iterating'],
  statement: 'Given an array of integers `numbers`, find and return the minimum value. The array is guaranteed to be non-empty.',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [3, 8, 1, 6]', output: '1' },
    { input: 'numbers = [-4, -9, -2, -9]', output: '-9' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\n\nclass Solution {\n    int findMinValue(List<Integer> numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'findMinValue',
    signature: 'int findMinValue(List<Integer> numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
