import { defineTests } from '../../_test-utils';

export default defineTests('pairs-with-sum', (t, rng) => {
  // ── Visible Tests ──
  t.visible('distinct-pairs', { args: [[1, 2, 3, 4, 5], 6], expected: [[1, 5], [2, 4]] });
  t.visible('duplicate-values', { args: [[3, 3, 3, 3], 6], expected: [[3, 3]] });
  t.visible('mixed-signs', { args: [[-1, 0, 1, 2, -2], 0], expected: [[-2, 2], [-1, 1]] });
  t.visible('no-pairs', { args: [[5, 7, 9], 4], expected: [] });
  t.visible('duplicate-inputs', { args: [[1, 5, 1, 5, 2, 4], 6], expected: [[1, 5], [2, 4]] });

  // ── Hidden Tests ──
  t.hidden('many-candidates', { args: [[1, 9, 2, 8, 3, 7, 4, 6, 1, 9, 2, 8], 10], expected: [[1, 9], [2, 8], [3, 7], [4, 6]] });
  t.hidden('all-fives', { args: [Array(12).fill(5), 10], expected: [[5, 5]] });
  t.hidden('no-matches-large', { args: [[10, 11, 12, 13, 10, 11, 12, 13], 5], expected: [] });
  t.hidden('mixed-targets-pairs', { args: [[7, -1, 8, -2, 9, -3, 7, -1, 8, -2], 6], expected: [[-3, 9], [-2, 8], [-1, 7]] });
  t.hidden('heavy-duplication', { args: [[12, 0, 12, 0, 6, 6, 12, 0, 6, 6], 12], expected: [[0, 12], [6, 6]] });

  // ── Generated Tests ──
  // Rule #6: ensure most generated tests have real pairs (no empty result)
  function computePairs(arr: number[], target: number): number[][] {
    const set = new Set<string>();
    const result: number[][] = [];
    for (let u = 0; u < arr.length; u++) {
      for (let v = u + 1; v < arr.length; v++) {
        if (arr[u]! + arr[v]! === target) {
          const mn = Math.min(arr[u]!, arr[v]!);
          const mx = Math.max(arr[u]!, arr[v]!);
          const key = `${mn}:${mx}`;
          if (!set.has(key)) { set.add(key); result.push([mn, mx]); }
        }
      }
    }
    return result;
  }

  for (let i = 0; i < 10; i++) {
    const len = rng.int(10, 150);
    const testArr = rng.intArray(len, -20, 20);
    // Force target to be sum of two known elements – one absent only for i===1
    let target: number;
    if (i === 1) {
      target = rng.int(100, 200); // guaranteed no pair
    } else {
      const ia = rng.int(0, len - 2);
      const ib = rng.int(ia + 1, len - 1);
      target = testArr[ia]! + testArr[ib]!;
    }
    t.hidden(`gen-${i}`, { args: [testArr, target], expected: computePairs(testArr, target) });
  }
});
