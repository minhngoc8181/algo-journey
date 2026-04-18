import { defineExercise } from '../../_loader';
export default defineExercise({ id: 'fibonacci', version: 1, title: 'Fibonacci Number', summary: 'Return the n-th Fibonacci number.', topic: 'recursion', difficulty: 'easy', tags: ['dynamic-programming'], estimatedMinutes: 12, order: 1000, mode: 'function_implementation',
  hints: [
    'Base cases: If `n == 0`, return 0. If `n == 1`, return 1.',
    'Recursive case: return `fibonacci(n - 1) + fibonacci(n - 2)`.',
    'Note: For larger `n`, pure recursion is slow. For better performance, consider using an array or just two variables to store previous results (Dynamic Programming)!'
  ], learningGoals: ['Recursive vs iterative approach', 'Memoization concept'], statement: 'Given a non-negative integer `n`, return the n-th Fibonacci number. F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).', constraints: ['0 ≤ n ≤ 30'], examples: [{ input: 'n = 6', output: '8' }, { input: 'n = 0', output: '0' }], starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    int fibonacci(int n) {\n        // Write your code here\n        return 0;\n    }\n}` }, requiredStructure: { className: 'Solution', methodName: 'fibonacci', signature: 'int fibonacci(int n)' }, evaluation: { comparator: 'exact_json' } });
