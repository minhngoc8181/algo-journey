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
  order: 423,
  mode: 'function_implementation',
  hints: [
    'Handle empty arrays first. If empty, the longest run is 0.',
    'Keep track of `current_run` and `max_run`. Initialize both to 1.',
    'Loop through the array from index 1. If `numbers[i] == numbers[i-1]`, increment `current_run`.',
    'If they are not equal, update `max_run = Math.max(max_run, current_run)` and reset `current_run` to 1.',
    'After the loop, do one final update of `max_run` to account for runs ending at the very end.'
  ],
  
  learningGoals: ['Track local state and global maximum', 'Iterate and compare adjacent elements'],
  statement: 'Given a non-empty array of integers `numbers`, find and return the length of the longest consecutive run of identical elements.',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [1, 1, 2, 2, 2, 3]', output: '3', explanation: 'The longest run is 2, 2, 2 which has a length of 3.' },
    { input: 'numbers = [1, 2, 3, 4]', output: '1', explanation: 'No repeated neighbors, so every run has length 1.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {\n    int longestConsecutiveRun(int[] numbers) {\n        // Write your code here\n        return 1;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'longestConsecutiveRun',
    signature: 'int longestConsecutiveRun(int[] numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250425,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(10); // small range => duplicates
            int expected = (len == 0) ? 0 : 1;
            int cur = 1;
            for (int j = 1; j < len; j++) {
                if (arr[j] == arr[j-1]) { cur++; if (cur > expected) expected = cur; }
                else cur = 1;
            }
            try {
                int actual = s.longestConsecutiveRun(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
