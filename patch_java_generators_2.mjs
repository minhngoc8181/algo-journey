/**
 * patch_java_generators_2.mjs
 * Adds javaGenerator blocks for remaining exercises (complex returns or patterns).
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIR = 'src/content/problems/arrays';

function patch(file, seed, count, namePrefix, genMethodBody) {
  const fp = join(DIR, file);
  let src = readFileSync(fp, 'utf8');

  if (src.includes('javaGenerator')) {
    console.log(`  SKIP  ${file}`);
    return;
  }

  const genBlock = `{
      count: ${count},
      seed: ${seed},
      namePrefix: '${namePrefix}',
      visibility: 'hidden',
      genMethodBody: \`${genMethodBody}\`,
    }`;

  const before = src.replace(
    /(\s*evaluation:\s*\{)([\s\S]*?)(\},?\s*\}\);\s*)$/,
    (_, open, inner) => {
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

// remove-duplicates — returns List<Integer>, compare length + elements via sorted
patch('remove-duplicates.exercise.ts', 20250436, 5, 'stress-', `
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
        }`);

// most-frequent — returns int
patch('most-frequent.exercise.ts', 20250437, 5, 'stress-', `
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
        }`);

// all-indices — returns List<Integer>
patch('all-indices.exercise.ts', 20250438, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(200);
            int target = arr[rng.nextInt(len)];
            java.util.ArrayList<Integer> expList = new java.util.ArrayList<>();
            for (int j = 0; j < len; j++) if (arr[j] == target) expList.add(j);
            try {
                java.util.List<Integer> actual = s.allIndicesOfValue(arr, target);
                boolean pass = actual != null && actual.equals(expList);
                System.out.println("AJ|stress-" + i + "|" + pass + "|size=" + (actual==null?-1:actual.size()) + "|size=" + expList.size());
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

// range-sum-queries — takes int[] + int[][] queries
patch('range-sum-queries.exercise.ts', 20250439, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            int qCount = 50 + rng.nextInt(51);
            int[][] queries = new int[qCount][2];
            for (int q = 0; q < qCount; q++) {
                int l = rng.nextInt(len), r = l + rng.nextInt(len - l);
                queries[q][0] = l; queries[q][1] = r;
            }
            // Reference: prefix sum
            int[] prefix = new int[len + 1];
            for (int j = 0; j < len; j++) prefix[j+1] = prefix[j] + arr[j];
            int[] expected = new int[qCount];
            for (int q = 0; q < qCount; q++) expected[q] = prefix[queries[q][1]+1] - prefix[queries[q][0]];
            try {
                java.util.List<Integer> actual = s.rangeSumQueries(arr, queries);
                boolean pass = actual != null && actual.size() == qCount;
                if (pass) for (int q = 0; q < qCount; q++) if (actual.get(q) != expected[q]) { pass = false; break; }
                System.out.println("AJ|stress-" + i + "|" + pass + "|size=" + (actual==null?-1:actual.size()) + "|size=" + qCount);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

// shortest-subarray-sum
patch('shortest-subarray-sum.exercise.ts', 20250440, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(100) + 1; // positive only
            int target = len / 2 * 50; // roughly achievable
            int left2 = 0, cur = 0, minLen = len + 1;
            for (int right = 0; right < len; right++) {
                cur += arr[right];
                while (cur >= target) {
                    int wl = right - left2 + 1;
                    if (wl < minLen) minLen = wl;
                    cur -= arr[left2++];
                }
            }
            int expected = minLen > len ? 0 : minLen;
            try {
                int actual = s.shortestSubarraySum(arr, target);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

// two-sum-basic — returns int[] {i, j}
patch('two-sum-basic.exercise.ts', 20250441, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (80000 + rng.nextInt(20001)) : (5000 + rng.nextInt(5001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(2001) - 1000;
            // Guarantee a valid pair exists
            int p = rng.nextInt(len / 2), q = len / 2 + rng.nextInt(len / 2);
            int target = arr[p] + arr[q];
            java.util.HashMap<Integer, Integer> map = new java.util.HashMap<>();
            int[] expected = {-1, -1};
            for (int j = 0; j < len; j++) {
                int comp = target - arr[j];
                if (map.containsKey(comp)) { expected[0] = map.get(comp); expected[1] = j; break; }
                map.put(arr[j], j);
            }
            try {
                int[] actual = s.twoSum(arr, target);
                boolean pass = actual != null && actual.length == 2 &&
                    actual[0] >= 0 && actual[1] > actual[0] &&
                    arr[actual[0]] + arr[actual[1]] == target;
                System.out.println("AJ|stress-" + i + "|" + pass + "|sum=" + (actual==null?-1:(arr[actual[0]]+arr[actual[1]])) + "|target=" + target);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

// intersect-sorted — two sorted arrays, returns List<Integer>
patch('intersect-sorted.exercise.ts', 20250442, 5, 'stress-', `
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
        }`);

// second-extreme — returns Integer (nullable), takes String mode
patch('second-extreme.exercise.ts', 20250443, 5, 'stress-', `
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
        }`);

// pairs-with-sum — O(n^2) brute force reference (small n only for stress), or HashMap
patch('pairs-with-sum.exercise.ts', 20250444, 5, 'stress-', `
        for (int i = 0; i < 5; i++) {
            // pairs-with-sum is O(n^2) for brute-force; use moderate sizes
            int len = (i >= 3) ? (5000 + rng.nextInt(2001)) : (2000 + rng.nextInt(1001));
            int[] arr = new int[len];
            for (int j = 0; j < len; j++) arr[j] = rng.nextInt(201) - 100;
            int target = rng.nextInt(101) - 50;
            java.util.HashSet<String> seenKeys = new java.util.HashSet<>();
            java.util.ArrayList<int[]> expPairs = new java.util.ArrayList<>();
            for (int x2 = 0; x2 < len; x2++) for (int y2 = x2+1; y2 < len; y2++) {
                if (arr[x2] + arr[y2] == target) {
                    int a2 = Math.min(arr[x2], arr[y2]), b2 = Math.max(arr[x2], arr[y2]);
                    String key = a2 + ":" + b2;
                    if (seenKeys.add(key)) expPairs.add(new int[]{a2, b2});
                }
            }
            try {
                java.util.List<java.util.List<Integer>> actual = s.pairsWithTargetSum(arr, target);
                boolean pass = actual != null && actual.size() == expPairs.size();
                System.out.println("AJ|stress-" + i + "|" + pass + "|size=" + (actual==null?-1:actual.size()) + "|size=" + expPairs.size());
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`);

// find-cycle-length — requires specially structured array (functional graph with cycle)
patch('find-cycle-length.exercise.ts', 20250445, 5, 'stress-', `
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
        }`);

console.log('\\nDone patching remaining exercises!');
