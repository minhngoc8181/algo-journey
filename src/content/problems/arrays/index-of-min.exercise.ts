import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'index-of-min',
  version: 1,
  title: 'Index of Minimum',
  summary: 'Return the index of the first minimum value.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'extreme', 'cse201'],
  estimatedMinutes: 10,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Track the index of the running minimum'],
  statement: 'Given an array of integers `numbers`, find and return the index of its minimum value. If the minimum value occurs more than once, return the index of its first occurrence. The array is guaranteed to be non-empty.',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [1, -7, 3, -7, 4]', output: '1', explanation: 'Minimum is -7. It repeats, but index 1 is the first.' },
    { input: 'numbers = [6, 4, 2, 0]', output: '3' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\n\nclass Solution {\n    int indexOfMinValue(List<Integer> numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'indexOfMinValue',
    signature: 'int indexOfMinValue(List<Integer> numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
