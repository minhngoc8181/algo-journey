import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'second-extreme',
  version: 1,
  title: 'Second Extreme Value',
  summary: 'Return the second distinct largest or smallest value.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['sorting', 'finding', 'cse201'],
  estimatedMinutes: 20,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Filter unique distinct values', 'Find second extreme bounds'],
  statement: 'Given an array of integers `numbers` and a string `mode` ("largest" or "smallest"), return the second distinct extreme value (either the second distinct largest or the second distinct smallest). If no such second distinct value exists (e.g. fewer than 2 distinct values), return `null`.',
  constraints: ['The array can contain duplicate values.', 'If fewer than 2 unique values exist, return `null`.'],
  examples: [
    { input: 'numbers = [4, 1, 9, 2, 9], mode = "largest"', output: '4', explanation: 'The largest is 9, the second distinct largest is 4.' },
    { input: 'numbers = [5, 5, 5], mode = "smallest"', output: 'null', explanation: 'No second distinct value exists.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.TreeSet;\n\nclass Solution {\n    Integer secondExtreme(int[] numbers, String mode) {\n        // Write your code here\n        return null;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'secondExtreme',
    signature: 'Integer secondExtreme(int[] numbers, String mode)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250443,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(10000) - 5000;
            String mode = (rng.nextInt(2) == 0) ? "largest" : "smallest";
            java.util.TreeSet<Integer> uniq = new java.util.TreeSet<>();
            for (int x : arr) uniq.add(x);
            Integer expected = null;
            if (uniq.size() >= 2) {
                expected = mode.equals("largest") ? uniq.lower(uniq.last()) : uniq.higher(uniq.first());
            }
            try {
                Integer actual = s.secondExtreme(arr, mode);
                boolean pass = (actual == null && expected == null) || (actual != null && actual.equals(expected));
                System.out.println("AJ|stress-" + i + "|" + pass + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
