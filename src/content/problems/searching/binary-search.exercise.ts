import { defineExercise } from '../../_loader';
export default defineExercise({ id: 'binary-search', version: 1, title: 'Binary Search', summary: 'Search for a target in a sorted array using binary search.', topic: 'searching', difficulty: 'medium', tags: ['divide-and-conquer', 'cse201'], estimatedMinutes: 20, order: 433, mode: 'function_implementation',
  hints: [
    'Define two pointers `left` as 0 and `right` as `length - 1`.',
    'Use a loop that runs while `left <= right`.',
    'Calculate `mid = left + (right - left) / 2` to prevent potential integer overflow.',
    'If `nums[mid]` is the target, return `mid`. If it is less than the target, update `left = mid + 1`. If it is greater, update `right = mid - 1`.'
  ], learningGoals: ['Implement binary search from scratch', 'Understand O(log n) time'], statement: 'Given a sorted integer array `arr` and a `target`, return the index of `target` if found, otherwise return `-1`. Use binary search.', constraints: ['The array is sorted in ascending order.', 'All elements are distinct.'], examples: [{ input: 'arr = [-1, 0, 3, 5, 9, 12], target = 9', output: '4' }, { input: 'arr = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1' }], starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    int binarySearch(int[] arr, int target) {\n        // Write your code here\n        return -1;\n    }\n}` }, requiredStructure: { className: 'Solution', methodName: 'binarySearch', signature: 'int binarySearch(int[] arr, int target)' }, evaluation: { comparator: 'exact_json', javaGenerator: {
      count: 5,
      seed: 20250460,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            arr[0] = rng.nextInt(10);
            for (int j = 1; j < len; j++) arr[j] = arr[j-1] + rng.nextInt(5) + 1;
            int target;
            int expected;
            if (i % 2 == 0) {
                expected = rng.nextInt(len);
                target = arr[expected];
            } else {
                expected = -1;
                target = arr[len - 1] + 1000;
            }
            try {
                int actual = s.binarySearch(arr, target);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`
    } } });
