import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'find-cycle-length',
  version: 1,
  title: 'Detect Cycle Length',
  summary: 'Use fast-slow pointers to find the length of a cycle in a functional graph.',
  topic: 'arrays',
  difficulty: 'hard',
  tags: ['two-pointers', 'cycle-detection', 'cse201'],
  estimatedMinutes: 25,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ["Understand Floyd's cycle-finding algorithm", 'Detect cycle length dynamically'],
  statement: 'Given an array of integers `arr`, you can interpret it as a functional graph where `arr[i]` points to the next index to visit. Starting from index `0`, use fast and slow pointers to traverse the graph and find the length of the cycle. The array is guaranteed to contain a cycle accessible from index `0`.',
  constraints: ['The array will always contain a valid cycle accessible from `arr[0]`.', '`0 <= arr[i] < arr.length`'],
  examples: [
    { input: 'arr = [1, 2, 3, 4, 3]', output: '2', explanation: 'Path: 0->1->2->3->4->3... The cycle is 3->4->3 of length 2.' },
    { input: 'arr = [1, 2, 3, 4, 1]', output: '4', explanation: 'Path: 0->1->2->3->4->1... The cycle is 1->2->3->4->1 of length 4.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `class Solution {\n    int findCycleLength(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'findCycleLength',
    signature: 'int findCycleLength(int[] arr)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250445,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            // Build functional graph: arr[j] = next node, guaranteed cycle from index 0
            int[] arr = new int[len];
            // Create a cycle of random length, then a tail leading into it
            int cycleLen = 2 + rng.nextInt(Math.min(len / 2, 1000));
            int tailLen = len - cycleLen;
            // Build cycle: 0,1,...,cycleLen-1 => cycleLen-1 points back to 0
            for (int j = 0; j < cycleLen - 1; j++) arr[j] = j + 1;
            arr[cycleLen - 1] = 0; // close cycle
            // Build tail: cycleLen, cycleLen+1, ..., len-1 -> points into cycle start
            for (int j = cycleLen; j < len; j++) arr[j] = j + 1 < len ? j + 1 : 0;
            int expected = cycleLen;
            try {
                int actual = s.findCycleLength(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
