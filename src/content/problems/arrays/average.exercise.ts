import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'average',
  version: 1,
  title: 'Calculate Average',
  summary: 'Return the arithmetic mean (integer division) of a non-empty array.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['accumulator', 'math', 'cse201'],
  estimatedMinutes: 10,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Accumulate sum and divide by count'],
  statement: 'Given a non-empty array of integers `numbers`, calculate and return the average of its elements. Perform integer division (truncate towards zero).',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4]', output: '2', explanation: '(1+2+3+4) / 4 = 10 / 4 = 2 (integer division)' },
    { input: 'numbers = [-5, 10, -5, 10]', output: '2', explanation: '(-5+10-5+10) / 4 = 10 / 4 = 2' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\n\nclass Solution {\n    int averageOfElements(List<Integer> numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'averageOfElements',
    signature: 'int averageOfElements(List<Integer> numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
