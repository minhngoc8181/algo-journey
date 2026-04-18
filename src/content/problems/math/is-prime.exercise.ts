import { defineExercise } from '../../_loader';
export default defineExercise({ id: 'is-prime', version: 1, title: 'Is Prime', summary: 'Determine whether a given number is prime.', topic: 'math', difficulty: 'easy', tags: ['loop', 'optimization'], estimatedMinutes: 10, order: 1000, mode: 'function_implementation',
  hints: [
    'A number less than 2 is not prime. Return `false` immediately.',
    'You only need to check divisibility from `2` up to the square root of `n`.',
    'If `n` is divisible by any number in this range (`n % i == 0`), it is not prime. Return `false`.',
    'If the loop finishes without finding any divisors, the number is prime. Return `true`.'
  ], learningGoals: ['Trial division up to sqrt(n)'], statement: 'Given an integer `n`, return `true` if `n` is a prime number, `false` otherwise.', constraints: ['n ≥ 0'], examples: [{ input: 'n = 7', output: 'true' }, { input: 'n = 4', output: 'false' }], starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    boolean isPrime(int n) {\n        // Write your code here\n        return false;\n    }\n}` }, requiredStructure: { className: 'Solution', methodName: 'isPrime', signature: 'boolean isPrime(int n)' }, evaluation: { comparator: 'exact_json' } });
