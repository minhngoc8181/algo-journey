import { defineExercise } from '../../_loader';
export default defineExercise({ id: 'is-even', version: 1, title: 'Is Even', summary: 'Determine whether a number is even or odd.', topic: 'conditionals', difficulty: 'easy', tags: ['modulo'], estimatedMinutes: 5, order: 101, mode: 'function_implementation',
  hints: [
    'Use the modulo operator `%` to find the remainder of division.',
    'If `number % 2 == 0`, it is an even number. Return `true`.',
    'Otherwise, it is an odd number. Return `false`.'
  ], learningGoals: ['Use modulo operator'], statement: 'Given an integer `n`, return `true` if it is even, `false` otherwise.', constraints: [], examples: [{ input: 'n = 4', output: 'true' }, { input: 'n = 7', output: 'false' }], starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    boolean isEven(int n) {\n        // Write your code here\n        return false;\n    }\n}` }, requiredStructure: { className: 'Solution', methodName: 'isEven', signature: 'boolean isEven(int n)' }, evaluation: { comparator: 'exact_json' } });
