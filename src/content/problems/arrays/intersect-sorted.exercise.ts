import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'intersect-sorted',
  version: 1,
  title: 'Intersection of Two Sorted Arrays',
  summary: 'Find the common elements between two sorted arrays, keeping duplicates based on the minimum count.',
  topic: 'arrays',
  difficulty: 'medium',
  tags: ['two-pointers', 'cse201'],
  estimatedMinutes: 20,
  order: 99,
  mode: 'function_implementation',
  
  learningGoals: ['Traverse two arrays simultaneously', 'Maintain sorted order while finding overlaps'],
  statement: 'Given two sorted arrays of integers `left` and `right`, return a new sorted array containing their intersection (common elements). Keep duplicates: if an element appears multiple times in both arrays, it should appear `min(countInLeft, countInRight)` times in the output.',
  constraints: ['Both input arrays are sorted in non-decreasing order.'],
  examples: [
    { input: 'left = [1, 2, 3, 4], right = [2, 4, 6, 8]', output: '[2, 4]', explanation: 'The elements 2 and 4 are common to both arrays.' },
    { input: 'left = [1, 1, 2, 3], right = [1, 1, 3, 3]', output: '[1, 1, 3]', explanation: '1 appears twice in both, and 3 appears once in left and twice in right.' }
  ],
  
  starter: {
    file: 'Solution.java',
    code: `import java.util.List;\nimport java.util.ArrayList;\n\nclass Solution {\n    List<Integer> intersectSorted(int[] left, int[] right) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'intersectSorted',
    signature: 'List<Integer> intersectSorted(int[] left, int[] right)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250442,
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
            java.util.ArrayList<Integer> expList = new java.util.ArrayList<>();
            int x = 0, y = 0;
            while (x < lenA && y < lenB) {
                if (a[x] == b[y]) { expList.add(a[x]); x++; y++; }
                else if (a[x] < b[y]) x++; else y++;
            }
            try {
                java.util.List<Integer> actual = s.intersectSorted(a, b);
                boolean pass = actual != null && actual.equals(expList);
                System.out.println("AJ|stress-" + i + "|" + pass + "|size=" + (actual==null?-1:actual.size()) + "|size=" + expList.size());
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
