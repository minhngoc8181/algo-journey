import { defineExercise } from '../../_loader';
export default defineExercise({
  id: 'merge-sorted-arrays', version: 1, title: 'Merge Sorted Arrays',
  summary: 'Merge two sorted arrays into a single sorted array.', topic: 'arrays', difficulty: 'medium',
  tags: ['two-pointers', 'merge', 'cse201'], estimatedMinutes: 15, order: 424, mode: 'function_implementation',
  hints: [
    'Use two pointers, `i` for the `left` array and `j` for the `right` array, both starting at 0.',
    'Create a result array of size `left.length + right.length`. Keep a pointer `k` for it.',
    'While both `i` and `j` are within bounds, compare `left[i]` and `right[j]`. Add the smaller one to the result array and increment its pointer.',
    'If one array is exhausted, use a `while` loop to copy the remaining elements from the other array into the result.'
  ],
  learningGoals: ['Two-pointer merge technique', 'Build result array'],
  statement: 'Given two sorted integer arrays `a` and `b`, merge them into a single sorted array and return it.',
  constraints: ['Both arrays are sorted in ascending order.', 'Either array may be empty.'],
  examples: [{ input: 'a = [1, 3, 5], b = [2, 4, 6]', output: '[1, 2, 3, 4, 5, 6]' }, { input: 'a = [1], b = []', output: '[1]' }],
  starter: { file: 'Solution.java', code: `import java.util.*;\n\nclass Solution {\n    int[] mergeSorted(int[] a, int[] b) {\n        // Write your code here\n        return new int[0];\n    }\n}` },
  requiredStructure: { className: 'Solution', methodName: 'mergeSorted', signature: 'int[] mergeSorted(int[] a, int[] b)' },
  evaluation: { comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250434,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int lenA = (i >= 3) ? (40000 + rng.nextInt(10001)) : (2000 + rng.nextInt(3001));
            int lenB = (i >= 3) ? (40000 + rng.nextInt(10001)) : (2000 + rng.nextInt(3001));
            int[] a = new int[lenA], b = new int[lenB];
            for (int j = 0; j < lenA; j++) a[j] = rng.nextInt(2000001) - 1000000;
            for (int j = 0; j < lenB; j++) b[j] = rng.nextInt(2000001) - 1000000;
            java.util.Arrays.sort(a); java.util.Arrays.sort(b);
            int[] expected = new int[lenA + lenB];
            int x = 0, y = 0, z = 0;
            while (x < lenA && y < lenB) { if (a[x] <= b[y]) expected[z++] = a[x++]; else expected[z++] = b[y++]; }
            while (x < lenA) expected[z++] = a[x++];
            while (y < lenB) expected[z++] = b[y++];
            try {
                int[] actual = s.mergeSorted(a, b);
                System.out.println("AJ|stress-" + i + "|" + java.util.Arrays.equals(actual, expected) + "|len=" + (actual==null?-1:actual.length) + "|len=" + expected.length);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
