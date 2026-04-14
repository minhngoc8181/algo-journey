import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'longest-run',
  version: 1,
  title: 'Longest Consecutive Run',
  summary: 'Return the length of the longest streak of equal neighboring values.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['linear-search', 'counting', 'cse201'],
  estimatedMinutes: 15,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Track local state and global maximum', 'Iterate and compare adjacent elements'],
  statement: 'Given a non-empty array of integers `numbers`, find and return the length of the longest consecutive run of identical elements.',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [1, 1, 2, 2, 2, 3]', output: '3', explanation: 'The longest run is 2, 2, 2 which has a length of 3.' },
    { input: 'numbers = [1, 2, 3, 4]', output: '1', explanation: 'No repeated neighbors, so every run has length 1.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\n\nclass Solution {\n    int longestConsecutiveRun(List<Integer> numbers) {\n        // Write your code here\n        return 1;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'longestConsecutiveRun',
    signature: 'int longestConsecutiveRun(List<Integer> numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
