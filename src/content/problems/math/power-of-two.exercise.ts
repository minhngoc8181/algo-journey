import { defineExercise } from '../../_loader';
export default defineExercise({ id: 'power-of-two', version: 1, title: 'Power of Two', summary: 'Determine if a given integer is a power of two.', topic: 'math', difficulty: 'easy', tags: ['bit-manipulation'], estimatedMinutes: 8, order: 201, mode: 'function_implementation',
  hints: [
    'A power of two must be greater than 0. If `n <= 0`, return `false`.',
    'Keep dividing `n` by 2 as long as it is perfectly divisible by 2.',
    'If `n` eventually becomes 1, it was an exact power of two!',
    'If it becomes anything else (meaning it had an odd factor), return `false`.'
  ], learningGoals: ['Use bit manipulation or loop'], statement: 'Given an integer `n`, return `true` if it is a power of two, `false` otherwise.', constraints: ['-2^31 ≤ n ≤ 2^31 - 1'], examples: [{ input: 'n = 16', output: 'true' }, { input: 'n = 6', output: 'false' }], starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    boolean isPowerOfTwo(int n) {\n        // Write your code here\n        return false;\n    }\n}` }, requiredStructure: { className: 'Solution', methodName: 'isPowerOfTwo', signature: 'boolean isPowerOfTwo(int n)' }, evaluation: { comparator: 'exact_json' } });
