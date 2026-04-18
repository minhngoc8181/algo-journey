import { defineExercise } from '../../_loader';
export default defineExercise({ id: 'selection-sort', version: 1, title: 'Selection Sort', summary: 'Sort an array using the selection sort algorithm.', topic: 'sorting', difficulty: 'medium', tags: ['in-place', 'cse201'], estimatedMinutes: 15, order: 1000, mode: 'function_implementation',
  hints: [
    'Loop through the array with pointer `i`. Assume indices from `0` to `i-1` are already sorted.',
    'Find the index of the minimum element in the unsorted portion (from `i` to `length - 1`).',
    'Swap that minimum element with the element at index `i`.',
    'Repeat until the entire array is sorted.'
  ], learningGoals: ['Find minimum in unsorted portion', 'Swap into correct position'], statement: 'Given an integer array `arr`, sort it in ascending order using the selection sort algorithm and return the sorted array.', constraints: ['Use selection sort (find min, swap).'], examples: [{ input: 'arr = [64, 25, 12, 22, 11]', output: '[11, 12, 22, 25, 64]' }], starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    int[] selectionSort(int[] arr) {\n        // Write your code here\n        return arr;\n    }\n}` }, requiredStructure: { className: 'Solution', methodName: 'selectionSort', signature: 'int[] selectionSort(int[] arr)' }, evaluation: { comparator: 'exact_json', timeLimitMs: 2000 } });
