import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'average',
  version: 1,
  title: 'Calculate Average',
  summary: 'Return the arithmetic mean (integer division) of a non-empty array.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['accumulator', 'math', 'cse201'],
  estimatedMinutes: 10,
  order: 409,
  mode: 'function_implementation',
  hints: [
    'Check if the array is empty to avoid division by zero.',
    'Declare a variable (e.g. `sum` of type `double`) to accumulate the total of all elements.',
    'Iterate over every element in the array and add it to your `sum`.',
    'Calculate and return the average by dividing `sum` by the array length.'
  ],
  
  learningGoals: ['Accumulate sum and divide by count'],
  statement: 'Given a non-empty array of integers `numbers`, calculate and return the average of its elements. Perform integer division (truncate towards zero).',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4]', output: '2', explanation: '(1+2+3+4) / 4 = 10 / 4 = 2 (integer division)' },
    { input: 'numbers = [-5, 10, -5, 10]', output: '2', explanation: '(-5+10-5+10) / 4 = 10 / 4 = 2' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.*;\n\nclass Solution {\n    int averageOfElements(int[] numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'averageOfElements',
    signature: 'int averageOfElements(int[] numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250415,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            long sum = 0; for (int x : arr) sum += x;
            int expected = (int)(sum / len);
            try {
                int actual = s.averageOfElements(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
