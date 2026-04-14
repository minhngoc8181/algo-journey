import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'count-max-occurrences',
  version: 1,
  title: 'Count Max Occurrences',
  summary: 'Find the maximum value first, then count how often it appears.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'counting', 'cse201'],
  estimatedMinutes: 10,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Combine multiple logical passes over an array'],
  statement: 'Given a non-empty array of integers `numbers`, find its maximum value, and then return how many times that maximum value appears in the array.',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [1, 9, 2, 9, 3]', output: '2', explanation: 'The maximum value is 9. It occurs 2 times.' },
    { input: 'numbers = [5, 5, 5, 5]', output: '4', explanation: 'The maximum value is 5. It occurs 4 times.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\n\nclass Solution {\n    int countMaxOccurrences(List<Integer> numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'countMaxOccurrences',
    signature: 'int countMaxOccurrences(List<Integer> numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
