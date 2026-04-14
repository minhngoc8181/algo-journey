import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'most-frequent',
  version: 1,
  title: 'Most Frequent Value',
  summary: 'Return the value with the highest frequency. If frequencies tie, return the smaller value.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['counting', 'map', 'cse201'],
  estimatedMinutes: 15,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Use a map to count frequencies', 'Handle tie breakers'],
  statement: 'Given a non-empty array of integers `numbers`, find and return the value that appears most frequently in the array. If there is a tie between multiple values, return the smallest value among the tied winners.',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [2, 3, 2, 3, 3, 1]', output: '3', explanation: '3 appears three times.' },
    { input: 'numbers = [5, 1, 5, 1, 2]', output: '1', explanation: 'Both 5 and 1 appear twice. 1 is smaller, so it wins.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.Map;\nimport java.util.HashMap;\n\nclass Solution {\n    int mostFrequentValue(List<Integer> numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'mostFrequentValue',
    signature: 'int mostFrequentValue(List<Integer> numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
