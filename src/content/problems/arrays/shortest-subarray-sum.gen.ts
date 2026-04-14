import { defineTests } from '../../_test-utils';

export default defineTests('shortest-subarray-sum', (t, rng) => {
  // ── Visible Tests ──
  t.visible('standard', { args: [[2, 3, 1, 2, 4, 3], 7], expected: 2 });
  t.visible('not-found', { args: [[1, 1, 1, 1, 1], 11], expected: 0 });
  t.visible('single-element', { args: [[1, 4, 4], 4], expected: 1 });
  t.visible('medium-length', { args: [[3, 1, 7, 1, 2], 10], expected: 3 });
  t.visible('multiple-candidates', { args: [[5, 1, 3, 5, 10, 7, 4, 9, 2, 8], 15], expected: 2 });

  // ── Hidden Tests ──
  t.hidden('entire-array-exact', { args: [[2, 2, 2], 6], expected: 3 });
  t.hidden('entire-array-more', { args: [[2, 2, 2], 5], expected: 3 });
  t.hidden('large-array', { args: [Array(500).fill(1), 50], expected: 50 });
  t.hidden('large-target-not-found', { args: [[100, 200, 300], 1000], expected: 0 });
  t.hidden('decreasing-elements', { args: [[10, 5, 2, 1], 12], expected: 2 });

  // ── Generated Tests ── Rule #6: ensure most tests have target reachable
  function solve(arr: number[], target: number): number {
    let left = 0, sum = 0, minLen = arr.length + 1;
    for (let right = 0; right < arr.length; right++) {
      sum += arr[right]!;
      while (sum >= target) {
        minLen = Math.min(minLen, right - left + 1);
        sum -= arr[left]!;
        left++;
      }
    }
    return minLen > arr.length ? 0 : minLen;
  }

  for (let i = 0; i < 10; i++) {
    const isLarge = i >= 8;
    const len = isLarge ? rng.int(1000, 2000) : rng.int(5, 500);
    const testArr = rng.intArray(len, 1, 100);
    // Force target to be reachable for all but i===1
    let target: number;
    if (i === 1) {
      target = rng.int(len * 100 + 1, len * 100 + 1000); // too large, returns 0
    } else {
      // pick window [l..r] and use its sum as target
      const l = rng.int(0, len - 2);
      const r = rng.int(l + 1, Math.min(l + 10, len - 1));
      target = testArr.slice(l, r + 1).reduce((a, b) => a + b, 0);
    }
    t.hidden(`gen-${i}`, { args: [testArr, target], expected: solve(testArr, target) });
  }
});
