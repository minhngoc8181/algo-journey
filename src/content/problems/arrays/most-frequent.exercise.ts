import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'most-frequent',
  version: 1,
  title: 'Most Frequent Value',
  summary: 'Return the value with the highest frequency. If frequencies tie, return the smaller value.',
  topic: 'arrays',
  difficulty: 'easy',
  tags: ['counting', 'map', 'cse201'],
  estimatedMinutes: 15,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Use a map to count frequencies', 'Handle tie breakers'],
  statement: 'Given a non-empty array of integers `numbers`, find and return the value that appears most frequently in the array. If there is a tie between multiple values, return the smallest value among the tied winners.',
  constraints: ['The array has at least one element.'],
  examples: [
    { input: 'numbers = [2, 3, 2, 3, 3, 1]', output: '3', explanation: '3 appears three times.' },
    { input: 'numbers = [5, 1, 5, 1, 2]', output: '1', explanation: 'Both 5 and 1 appear twice. 1 is smaller, so it wins.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.Map;\nimport java.util.HashMap;\n\nclass Solution {\n    int mostFrequentValue(int[] numbers) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'mostFrequentValue',
    signature: 'int mostFrequentValue(int[] numbers)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250437,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(500);
            java.util.HashMap<Integer, Integer> freq = new java.util.HashMap<>();
            for (int x : arr) freq.put(x, freq.getOrDefault(x, 0) + 1);
            int bestVal = arr[0], bestCnt = 0;
            for (java.util.Map.Entry<Integer,Integer> e2 : freq.entrySet()) {
                if (e2.getValue() > bestCnt || (e2.getValue() == bestCnt && e2.getKey() < bestVal)) {
                    bestCnt = e2.getValue(); bestVal = e2.getKey();
                }
            }
            int expected = bestVal;
            try {
                int actual = s.mostFrequentValue(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
