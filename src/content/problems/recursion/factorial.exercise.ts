import { defineExercise } from '../../_loader';
export default defineExercise({ id: 'factorial', version: 1, title: 'Factorial', summary: 'Compute the factorial of a non-negative integer.', topic: 'recursion', difficulty: 'easy', tags: ['math'], estimatedMinutes: 10, order: 202, mode: 'function_implementation',
  hints: [
    'Identify the base case: if `n == 0` or `n == 1`, return 1.',
    'Identify the recursive case: return `n * factorial(n - 1)`.',
    'Make sure the problem size reduces on each recursive call so it eventually hits the base case!'
  ], learningGoals: ['Base case and recursive case', 'Understand recursion depth'], statement: 'Given a non-negative integer `n`, return `n!` (n factorial). By definition, `0! = 1`.', constraints: ['0 ≤ n ≤ 12'], examples: [{ input: 'n = 5', output: '120' }, { input: 'n = 0', output: '1' }], starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    int factorial(int n) {\n        // Write your code here\n        return 0;\n    }\n}` }, requiredStructure: { className: 'Solution', methodName: 'factorial', signature: 'int factorial(int n)' }, evaluation: { comparator: 'exact_json' } });
