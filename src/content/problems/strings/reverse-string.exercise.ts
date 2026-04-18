import { defineExercise } from '../../_loader';
export default defineExercise({ id: 'reverse-string', version: 1, title: 'Reverse String', summary: 'Reverse a string without using built-in reverse.', topic: 'strings', difficulty: 'easy', tags: ['string-builder'], estimatedMinutes: 10, order: 205,  mode: 'function_implementation',
  hints: [
    'Strings in Java are immutable. Convert the string to a character array using `s.toCharArray()`.',
    'Use the two-pointer technique (`left` at 0, `right` at `length - 1`) to swap characters from the ends towards the middle.',
    'After the pointers cross, convert the modified character array back to a string (e.g. `new String(arr)`) and return it.'
  ], learningGoals: ['Build a reversed string character by character'], statement: 'Given a string `s`, return the string reversed.', constraints: [], examples: [{ input: 's = "hello"', output: '"olleh"' }], starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    String reverseString(String s) {\n        // Write your code here\n        return "";\n    }\n}` }, requiredStructure: { className: 'Solution', methodName: 'reverseString', signature: 'String reverseString(String s)' }, evaluation: { comparator: 'exact_json' } });
