import { defineExercise } from '../../_loader';
export default defineExercise({
  id: 'contains-duplicate', version: 1, title: 'Contains Duplicate',
  summary: 'Check if any value appears at least twice in the array.', topic: 'arrays', difficulty: 'easy',
  tags: ['hash-set'], estimatedMinutes: 10, order: 1000, mode: 'function_implementation',
  hints: [
    'You could use nested loops to compare every pair of elements, but this is slow (O(N^2)).',
    'A better approach is to use a `HashSet` to keep track of elements you have already seen.',
    'Iterate through the array. For each element, check if it is already in the `HashSet`.',
    'If it is, you found a duplicate! Return `true`. Otherwise, add it to the set and continue. Return `false` if the loop finishes.'
  ],
  learningGoals: ['Use a HashSet for O(n) lookup', 'Detect duplicates'],
  statement: 'Given an integer array `arr`, return `true` if any value appears at least twice, and `false` if every element is distinct.',
  constraints: ['1 ≤ arr.length ≤ 10000'],
  examples: [{ input: 'arr = [1, 2, 3, 1]', output: 'true' }, { input: 'arr = [1, 2, 3, 4]', output: 'false' }],
  starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    boolean containsDuplicate(int[] arr) {\n        // Write your code here\n        return false;\n    }\n}` },
  requiredStructure: { className: 'Solution', methodName: 'containsDuplicate', signature: 'boolean containsDuplicate(int[] arr)' },
  evaluation: { comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250422,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(len * 2);
            // Force dup 80% of the time
            if (rng.nextInt(10) < 8) arr[rng.nextInt(len)] = arr[rng.nextInt(len)];
            java.util.HashSet<Integer> seen = new java.util.HashSet<>();
            boolean expected = false;
            for (int x : arr) if (!seen.add(x)) { expected = true; break; }
            try {
                boolean actual = s.containsDuplicate(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
