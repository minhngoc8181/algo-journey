import { defineTests } from '../../_test-utils';

export default defineTests('two-sum-sorted', (t, rng) => {
  // ── Visible Tests ──
  t.visible('simple-pair', { args: [[-3, 1, 4, 7, 11], 8], expected: [1, 3] });
  t.visible('no-pair', { args: [[1, 2, 3, 4, 5], 20], expected: [-1, -1] });
  t.visible('zeros', { args: [[0, 0, 3, 5], 0], expected: [0, 1] });
  t.visible('mixed-signs', { args: [[-4, -2, 0, 3, 7], 3], expected: [0, 4] });
  t.visible('extremes', { args: [[1, 3, 5, 7, 9], 10], expected: [0, 4] });

  // ── Hidden Tests ──
  t.hidden('all-same', { args: [Array(100).fill(5), 10], expected: [0, 99] });
  t.hidden('not-found-large', { args: [[10, 11, 12, 13, 14, 15, 16], 30], expected: [-1, -1] });
  t.hidden('large-values', { args: [[100000000, 100000001, 100000002], 200000001], expected: [0, 1] });

  // ── Generated Tests ── Rule #6: only i===1 produces [-1,-1]
  function solve(arr: number[], target: number): number[] {
    let l = 0, r = arr.length - 1;
    while (l < r) {
      const s = arr[l]! + arr[r]!;
      if (s === target) return [l, r];
      else if (s < target) l++;
      else r--;
    }
    return [-1, -1];
  }

  for (let i = 0; i < 12; i++) {
    const isLarge = i >= 10;
    const len = isLarge ? rng.int(1000, 2000) : rng.int(10, 500);
    const testArr = rng.intArray(len, -100, 100);
    testArr.sort((a, b) => a - b);

    let target: number;
    if (i === 1) {
      target = 100000; // guaranteed no pair in [-100,100] range
    } else {
      const i1 = rng.int(0, len - 2);
      let i2 = rng.int(i1 + 1, len - 1);
      target = testArr[i1]! + testArr[i2]!;
    }
    t.hidden(`gen-${i}`, { args: [testArr, target], expected: solve(testArr, target) });
  }
});
