import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'index-of-max',
  version: 1,
  title: 'Index of Maximum',
  summary: 'Return the index of the first maximum value.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'extreme', 'cse201'],
  estimatedMinutes: 10,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Track the index of the running maximum'],
  statement: 'Given an array of integers `numbers`, find and return the index of its maximum value. If the maximum value occurs more than once, return the index of its first occurrence. The array is guaranteed to be non-empty.',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [7, 1, 7, 3, 7]', output: '0', explanation: 'Maximum is 7. It repeats, but index 0 is the first.' },
    { input: 'numbers = [2, 9, 4, 9, 1]', output: '1' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\n\nclass Solution {\n    int indexOfMaxValue(List<Integer> numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'indexOfMaxValue',
    signature: 'int indexOfMaxValue(List<Integer> numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
