import { defineExercise } from '../../_loader';
export default defineExercise({
  id: 'count-occurrences', version: 1, title: 'Count Occurrences',
  summary: 'Count how many times a target appears in an array.', topic: 'arrays', difficulty: 'easy',
  tags: ['linear-search', 'counting', 'cse201'], estimatedMinutes: 10, order: 410, mode: 'function_implementation',
  hints: [
    'Declare a `count` variable and set it to 0 to keep track of occurrences.',
    'Use a loop to iterate through the array.',
    'Every time you see an element matching the target, increment the `count`.',
    'Return the `count` at the end of the loop.'
  ],
  learningGoals: ['Count matching elements during iteration'],
  statement: 'Given an integer array `arr` and a `target`, return the number of times `target` appears in `arr`.',
  constraints: [],
  examples: [{ input: 'arr = [1, 2, 3, 2, 1], target = 2', output: '2' }],
  starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    int countOccurrences(int[] arr, int target) {\n        // Write your code here\n        return 0;\n    }\n}` },
  requiredStructure: { className: 'Solution', methodName: 'countOccurrences', signature: 'int countOccurrences(int[] arr, int target)' },
  evaluation: { comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250420,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(201) - 100;
            int target = arr[rng.nextInt(len)];
            int expected = 0;
            for (int x : arr) if (x == target) expected++;
            try {
                int actual = s.countOccurrences(arr, target);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
