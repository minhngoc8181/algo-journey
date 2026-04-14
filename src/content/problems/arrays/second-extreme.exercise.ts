import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'second-extreme',
  version: 1,
  title: 'Second Extreme Value',
  summary: 'Return the second distinct largest or smallest value.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['sorting', 'finding', 'cse201'],
  estimatedMinutes: 20,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Filter unique distinct values', 'Find second extreme bounds'],
  statement: 'Given an array of integers `numbers` and a string `mode` ("largest" or "smallest"), return the second distinct extreme value (either the second distinct largest or the second distinct smallest). If no such second distinct value exists (e.g. fewer than 2 distinct values), return `null`.',
  constraints: ['The array can contain duplicate values.', 'If fewer than 2 unique values exist, return `null`.'],
  examples: [
    { input: 'numbers = [4, 1, 9, 2, 9], mode = "largest"', output: '4', explanation: 'The largest is 9, the second distinct largest is 4.' },
    { input: 'numbers = [5, 5, 5], mode = "smallest"', output: 'null', explanation: 'No second distinct value exists.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.ArrayList;\nimport java.util.Collections;\n\nclass Solution {\n    Integer secondExtreme(List<Integer> numbers, String mode) {\n        // Write your code here\n        return null;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'secondExtreme',
    signature: 'Integer secondExtreme(List<Integer> numbers, String mode)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
