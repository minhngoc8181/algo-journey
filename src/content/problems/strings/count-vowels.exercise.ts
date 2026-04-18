import { defineExercise } from '../../_loader';
export default defineExercise({ id: 'count-vowels', version: 1, title: 'Count Vowels', summary: 'Count the number of vowels in a string.', topic: 'strings', difficulty: 'easy', tags: ['string-traversal'], estimatedMinutes: 8, order: 206, mode: 'function_implementation',
  hints: [
    'Initialize a counter variable to 0.',
    'Loop through each character of the string. You might want to convert the string to lowercase first using `toLowerCase()`.',
    'Check if the character is \'a\', \'e\', \'i\', \'o\', or \'u\'. If so, increment the counter.',
    'Return the resulting count.'
  ], learningGoals: ['Iterate through characters', 'Check membership in a set'], statement: 'Given a string `s`, return the number of vowels (a, e, i, o, u) in the string. Count both uppercase and lowercase vowels.', constraints: ['The string may contain any characters.'], examples: [{ input: 's = "Hello World"', output: '3' }, { input: 's = "aeiou"', output: '5' }], starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    int countVowels(String s) {\n        // Write your code here\n        return 0;\n    }\n}` }, requiredStructure: { className: 'Solution', methodName: 'countVowels', signature: 'int countVowels(String s)' }, evaluation: { comparator: 'exact_json' } });
