import { defineExercise } from '../../_loader';
export default defineExercise({ id: 'fizz-buzz', version: 1, title: 'FizzBuzz', summary: 'Print numbers from 1 to n with Fizz/Buzz replacements.', topic: 'loops', difficulty: 'easy', tags: ['conditionals', 'modulo'], estimatedMinutes: 10, order: 1000, mode: 'function_implementation',
  hints: [
    'Use a loop to iterate from 1 to `n`.',
    'Order matters! Check divisibility by 15 (both 3 and 5) first.',
    'Then check divisibility by 3, and then by 5.',
    'If none of the above are true, output the number itself as a string.'
  ], learningGoals: ['Use loops with conditional logic', 'Handle multiple cases'], statement: 'Given an integer `n`, return an array of strings where for each number from 1 to n: if divisible by 3 print "Fizz", if divisible by 5 print "Buzz", if divisible by both print "FizzBuzz", otherwise print the number as a string.', constraints: ['1 ≤ n ≤ 100'], examples: [{ input: 'n = 5', output: '["1", "2", "Fizz", "4", "Buzz"]' }], starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    String[] fizzBuzz(int n) {\n        // Write your code here\n        return new String[0];\n    }\n}` }, requiredStructure: { className: 'Solution', methodName: 'fizzBuzz', signature: 'String[] fizzBuzz(int n)' }, evaluation: { comparator: 'exact_json' } });
