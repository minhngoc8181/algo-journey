/**
 * patch_java_generators.mjs
 * Adds javaGenerator blocks to all array exercise.ts files.
 * Run: node patch_java_generators.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIR = 'src/content/problems/arrays';

/** Patch an exercise.ts file by replacing `evaluation: {...}` with one that includes javaGenerator */
function patch(file, seed, count, namePrefix, genMethodBody) {
  const fp = join(DIR, file);
  let src = readFileSync(fp, 'utf8');

  if (src.includes('javaGenerator')) {
    console.log(`  SKIP  ${file} (already has javaGenerator)`);
    return;
  }

  const genBlock = `{
      count: ${count},
      seed: ${seed},
      namePrefix: '${namePrefix}',
      visibility: 'hidden',
      genMethodBody: \`${genMethodBody}\`,
    }`;

  // Replace the final `});` preceded by the evaluation block
  // Pattern: find `evaluation: { comparator: '...' },` and wrap it
  const before = src.replace(
    /(\s*evaluation:\s*\{)([\s\S]*?)(\},?\s*\}\);\s*)$/,
    (_, open, inner, close) => {
      // Remove trailing }, from inner to reopen
      const innerTrimmed = inner.replace(/,?\s*$/, '');
      return `${open}${innerTrimmed},\n    javaGenerator: ${genBlock},\n  },\n});\n`;
    }
  );

  if (before === src) {
    console.error(`  ERROR ${file}: pattern not matched`);
    return;
  }

  writeFileSync(fp, before);
  console.log(`  OK    ${file}`);
}

// ─────────────────────────────────────────────────────────
// GROUP A — simple O(n) loops
// ─────────────────────────────────────────────────────────

patch('sum-array.exercise.ts', 20250414, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            int expected = 0;
            for (int x : arr) expected += x;
            try {
                int actual = s.sumArray(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('average.exercise.ts', 20250415, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            long sum = 0; for (int x : arr) sum += x;
            int expected = (int)(sum / len);
            try {
                int actual = s.averageOfElements(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('find-min.exercise.ts', 20250416, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2000001) - 1000000;
            int expected = arr[0];
            for (int x : arr) if (x < expected) expected = x;
            try {
                int actual = s.findMinValue(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('max-element.exercise.ts', 20250417, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2000001) - 1000000;
            int expected = arr[0];
            for (int x : arr) if (x > expected) expected = x;
            try {
                int actual = s.maxElement(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('contains-value.exercise.ts', 20250418, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            // Alternate: present vs absent target
            int target = (i % 2 == 0) ? arr[rng.nextInt(len)] : (1001 + rng.nextInt(1000));
            boolean expected = false;
            for (int x : arr) if (x == target) { expected = true; break; }
            try {
                boolean actual = s.containsValue(arr, target);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('last-index-of.exercise.ts', 20250419, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(201) - 100;
            int target = arr[rng.nextInt(len)];
            int expected = -1;
            for (int j = arr.length - 1; j >= 0; j--) if (arr[j] == target) { expected = j; break; }
            try {
                int actual = s.lastIndexOfValue(arr, target);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('count-occurrences.exercise.ts', 20250420, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(201) - 100;
            int target = arr[rng.nextInt(len)];
            int expected = 0;
            for (int x : arr) if (x == target) expected++;
            try {
                int actual = s.countOccurrences(arr, target);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('is-sorted.exercise.ts', 20250421, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            // Half sorted, half not
            boolean sorted = (i % 2 == 0);
            if (sorted) {
                arr[0] = rng.nextInt(10);
                for (int j = 1; j < len; j++) arr[j] = arr[j-1] + rng.nextInt(5);
            } else {
                for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
                arr[rng.nextInt(len)] = -999999; // guarantee unsorted
            }
            boolean expected = true;
            for (int j = 1; j < len; j++) if (arr[j] < arr[j-1]) { expected = false; break; }
            try {
                boolean actual = s.isSortedAscending(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('contains-duplicate.exercise.ts', 20250422, 5, 'stress-', `
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
        }`);

patch('index-of-max.exercise.ts', 20250423, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2000001) - 1000000;
            int expected = 0;
            for (int j = 1; j < len; j++) if (arr[j] > arr[expected]) expected = j;
            try {
                int actual = s.indexOfMaxValue(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('index-of-min.exercise.ts', 20250424, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2000001) - 1000000;
            int expected = 0;
            for (int j = 1; j < len; j++) if (arr[j] < arr[expected]) expected = j;
            try {
                int actual = s.indexOfMinValue(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

// ─────────────────────────────────────────────────────────
// GROUP B — O(n) with state
// ─────────────────────────────────────────────────────────

patch('longest-run.exercise.ts', 20250425, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(10); // small range => duplicates
            int expected = (len == 0) ? 0 : 1;
            int cur = 1;
            for (int j = 1; j < len; j++) {
                if (arr[j] == arr[j-1]) { cur++; if (cur > expected) expected = cur; }
                else cur = 1;
            }
            try {
                int actual = s.longestConsecutiveRun(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('reverse-array.exercise.ts', 20250426, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            int[] expected = new int[len];
            for (int j = 0; j < len; j++) expected[j] = arr[arr.length - 1 - j];
            try {
                int[] actual = s.reverseArray(arr.clone());
                System.out.println("AJ|stress-" + i + "|" + java.util.Arrays.equals(actual, expected) + "|" + java.util.Arrays.toString(actual) + "|" + java.util.Arrays.toString(expected));
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('missing-number.exercise.ts', 20250427, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            // Build [0..len] then remove one
            int missing = rng.nextInt(len + 1);
            int[] arr = new int[len];
            int idx = 0;
            for (int j = 0; j <= len; j++) if (j != missing) arr[idx++] = j;
            // shuffle
            for (int j = len - 1; j > 0; j--) {
                int k = rng.nextInt(j + 1);
                int tmp = arr[j]; arr[j] = arr[k]; arr[k] = tmp;
            }
            int expected = missing;
            try {
                int actual = s.missingNumber(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('count-unique.exercise.ts', 20250428, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(1000);
            java.util.HashSet<Integer> seen = new java.util.HashSet<>();
            for (int x : arr) seen.add(x);
            int expected = seen.size();
            try {
                int actual = s.countUniqueValues(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('count-max-occurrences.exercise.ts', 20250429, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(1000);
            int max = arr[0];
            for (int x : arr) if (x > max) max = x;
            int expected = 0;
            for (int x : arr) if (x == max) expected++;
            try {
                int actual = s.countMaxOccurrences(arr);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('sort-descending.exercise.ts', 20250430, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2000001) - 1000000;
            int[] expected = arr.clone();
            java.util.Arrays.sort(expected);
            int lo = 0, hi = expected.length - 1;
            while (lo < hi) { int t = expected[lo]; expected[lo++] = expected[hi]; expected[hi--] = t; }
            try {
                int[] actual = s.sortDescending(arr.clone());
                System.out.println("AJ|stress-" + i + "|" + java.util.Arrays.equals(actual, expected) + "|" + actual.length + " elems|" + expected.length + " elems");
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('build-prefix-sum.exercise.ts', 20250431, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            int[] expected = new int[len + 1];
            for (int j = 0; j < len; j++) expected[j + 1] = expected[j] + arr[j];
            try {
                int[] actual = s.buildPrefixSum(arr);
                System.out.println("AJ|stress-" + i + "|" + java.util.Arrays.equals(actual, expected) + "|len=" + (actual==null?-1:actual.length) + "|len=" + expected.length);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('max-sum-subarray-k.exercise.ts', 20250432, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int k = rng.nextInt(Math.min(len / 2, 1000)) + 1;
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            int win = 0; for (int j = 0; j < k; j++) win += arr[j];
            int expected = win;
            for (int j = k; j < len; j++) { win += arr[j] - arr[j-k]; if (win > expected) expected = win; }
            try {
                int actual = s.maxSumSubarrayK(arr, k);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('two-sum-sorted.exercise.ts', 20250433, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2000001) - 1000000;
            java.util.Arrays.sort(arr);
            // Pick two random indices to form target
            int p = rng.nextInt(len / 2), q = len / 2 + rng.nextInt(len / 2);
            int target = arr[p] + arr[q];
            int lo = 0, hi = len - 1; int[] expected = {-1, -1};
            while (lo < hi) {
                int s2 = arr[lo] + arr[hi];
                if (s2 == target) { expected[0] = lo; expected[1] = hi; break; }
                else if (s2 < target) lo++; else hi--;
            }
            try {
                int[] actual = s.twoSumSorted(arr, target);
                boolean pass = actual != null && actual.length == 2 && actual[0] == expected[0] && actual[1] == expected[1];
                System.out.println("AJ|stress-" + i + "|" + pass + "|[" + (actual==null?"null":actual[0]+","+actual[1]) + "]|[" + expected[0] + "," + expected[1] + "]");
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

patch('merge-sorted-arrays.exercise.ts', 20250434, 5, 'stress-', `
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
        }`);

patch('rotate.exercise.ts', 20250435, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            int k = rng.nextInt(len + 1);
            String dir = (rng.nextInt(2) == 0) ? "left" : "right";
            int shift = (dir.equals("left") ? k : len - k) % len;
            int[] expected = new int[len];
            for (int j = 0; j < len; j++) expected[j] = arr[(j + shift) % len];
            try {
                int[] actual = s.rotateArray(arr.clone(), k, dir);
                System.out.println("AJ|stress-" + i + "|" + java.util.Arrays.equals(actual, expected) + "|ok|ok");
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

console.log('\nDone patching all exercises!');
