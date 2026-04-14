import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'missing-number',
  version: 1,
  title: 'Missing Number',
  summary: 'The array contains every number from 0 to n except one. Return the missing number.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['math', 'cse201'],
  estimatedMinutes: 10,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Understand arithmetic sum', 'Deduce missing elements optimally'],
  statement: 'Given an array of integers `numbers` containing `n` distinct numbers taken from the range `0` to `n` (inclusive), return the single number that is missing from the array.',
  constraints: ['The array has length `n`.', 'All numbers are unique and fall in the range `[0, n]`.'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4]', output: '0', explanation: 'n = 4. The range [0,4] is missing 0.' },
    { input: 'numbers = [0, 1, 2, 3]', output: '4', explanation: 'n = 4. The range [0,4] is missing 4.' },
    { input: 'numbers = [4, 2, 1, 0]', output: '3', explanation: 'n = 4. The range [0,4] is missing 3.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\n\nclass Solution {\n    int missingNumber(List<Integer> numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'missingNumber',
    signature: 'int missingNumber(List<Integer> numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
