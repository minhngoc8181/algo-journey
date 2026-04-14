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
    code: `import java.util.List;\n\nclass Solution {\n    int findCycleLength(List<Integer> arr) {\n        // Write your code here\n        return 0;\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'findCycleLength',
    signature: 'int findCycleLength(List<Integer> arr)',
  },

  evaluation: {
    comparator: 'exact_json',
  },
});
