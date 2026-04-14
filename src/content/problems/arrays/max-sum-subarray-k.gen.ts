import { defineTests } from '../../_test-utils';

export default defineTests('max-sum-subarray-k', (t, rng) => {
  // ── Visible Tests ──
  t.visible('standard-mid', { args: [[2, 1, 5, 1, 3, 2], 3], expected: 9 });
  t.visible('ties', { args: [[2, 3, 4, 1, 5], 2], expected: 9 });
  t.visible('all-negative', { args: [[-1, -2, -3, -4], 2], expected: -3 });
  t.visible('uniform', { args: [[10, 10, 10, 10], 3], expected: 30 });
  t.visible('max-at-end', { args: [[1, 4, 2, 10, 2, 3, 1, 0, 20], 3], expected: 21 });

  // ── Hidden Tests ──
  t.hidden('large-array-small-k', { args: [[1, 5, 2, 8, 3, 7, 1, 5, 2, 8, 3, 7], 4], expected: 22 });
  t.hidden('all-negative-large', { args: [[-5, -1, -4, -2, -3, -5, -1, -4, -2, -3], 3], expected: -6 });
  t.hidden('k-equals-length', { args: [[5, 2, 1, 4, 3], 5], expected: 15 });
  t.hidden('fluctuating', { args: [[10, -5, 10, -5, 10, -5, 10, -5, 15, -10], 2], expected: 10 });
  t.hidden('k-is-one', { args: [[-2, 5, 1, 0, 9, 3], 1], expected: 9 });

  // ── Generated Tests ──
  for (let i = 0; i < 10; i++) {
    const isLarge = i >= 8;
    const len = isLarge ? rng.int(1000, 2000) : rng.int(5, 500);
    const k = rng.int(1, Math.min(len, 1000));
    const testArr = rng.intArray(len, -100, 100);

    let windowSum = 0;
    for (let j = 0; j < k; j++) windowSum += testArr[j]!;
    let maxSum = windowSum;
    for (let j = k; j < testArr.length; j++) {
      windowSum += testArr[j]! - testArr[j - k]!;
      if (windowSum > maxSum) maxSum = windowSum;
    }

    t.hidden(`gen-${i}`, { args: [testArr, k], expected: maxSum });
  }
});
