import { defineExercise } from '../../_loader';
export default defineExercise({
  id: 'is-palindrome', version: 1, title: 'Is Palindrome',
  summary: 'Check whether a given string is a palindrome.', topic: 'strings', difficulty: 'easy',
  tags: ['two-pointers', 'string-comparison'], estimatedMinutes: 12, order: 203, mode: 'function_implementation',
  hints: [
    'Use two pointers, `left` starting at 0 and `right` starting at `length - 1`.',
    'Compare the characters using `str.charAt(left)` and `str.charAt(right)`.',
    'If the characters differ, return `false`. Otherwise, increment `left` and decrement `right`.',
    'Stop when the pointers cross (`left >= right`). If everything matches, return `true`.'
  ],
  learningGoals: ['Compare characters from both ends'],
  statement: 'Given a string `s`, return `true` if it reads the same forwards and backwards, `false` otherwise. Consider only lowercase letters.',
  constraints: ['The string contains only lowercase English letters.'],
  examples: [{ input: 's = "racecar"', output: 'true' }, { input: 's = "hello"', output: 'false' }],
  starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    boolean isPalindrome(String s) {\n        // Write your code here\n        return false;\n    }\n}` },
  requiredStructure: { className: 'Solution', methodName: 'isPalindrome', signature: 'boolean isPalindrome(String s)' },
  evaluation: { comparator: 'exact_json' },
});
