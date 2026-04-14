import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'rotate',
  version: 1,
  title: 'Rotate Array',
  summary: 'Return a new array rotated left or right by k positions.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['array-manipulation', 'cse201'],
  estimatedMinutes: 20,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Understand modulo arithmetic for array bounds', 'Copy slices of an array'],
  statement: 'Given an array of integers `numbers`, an integer `k`, and a string `direction` ("left" or "right"), return a new array that is the original array rotated by `k` positions in the specified direction.',
  constraints: ['The array may be empty.', '`k` can be strictly larger than the array length (wrap-around).'],
  examples: [
    { input: 'numbers = [1, 2, 3, 4, 5], k = 1, direction = "left"', output: '[2, 3, 4, 5, 1]' },
    { input: 'numbers = [1, 2, 3, 4, 5], k = 2, direction = "right"', output: '[4, 5, 1, 2, 3]' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.ArrayList;\n\nclass Solution {\n    List<Integer> rotateArray(List<Integer> numbers, int k, String direction) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'rotateArray',
    signature: 'List<Integer> rotateArray(List<Integer> numbers, int k, String direction)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
