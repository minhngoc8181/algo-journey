import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'remove-duplicates',
  version: 1,
  title: 'Remove Duplicates',
  summary: 'Return a new array keeping only the first occurrence of each value.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['deduplication', 'cse201'],
  estimatedMinutes: 15,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Filter out elements that have been seen already linearly'],
  statement: 'Given an array of integers `numbers`, return a new array (or list) which contains the exact same elements in the original order, but with all duplicate occurrences removed (keep only the first occurrence).',
  constraints: ['The array may be empty.'],
  examples: [
    { input: 'numbers = [5, 5, 2, 2, 1]', output: '[5, 2, 1]' },
    { input: 'numbers = [-3, 0, 2, -1]', output: '[-3, 0, 2, -1]' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.ArrayList;\n\nclass Solution {\n    List<Integer> removeDuplicates(int[] numbers) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'removeDuplicates',
    signature: 'List<Integer> removeDuplicates(int[] numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250436,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(1000);
            // Reference: preserve first occurrence order using seen set
            java.util.LinkedHashSet<Integer> seen = new java.util.LinkedHashSet<>();
            for (int x : arr) seen.add(x);
            int[] expected = new int[seen.size()];
            int idx = 0; for (int x : seen) expected[idx++] = x;
            try {
                java.util.List<Integer> actualList = s.removeDuplicates(arr);
                int[] actual = actualList.stream().mapToInt(Integer::intValue).toArray();
                boolean pass = java.util.Arrays.equals(actual, expected);
                System.out.println("AJ|stress-" + i + "|" + pass + "|size=" + actual.length + "|size=" + expected.length);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
