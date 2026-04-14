import { defineTests } from '../../_test-utils';

export default defineTests('missing-number', (t, rng) => {
  // ── Visible Tests ──
  t.visible('missing-zero', { args: [[1, 2, 3, 4]], expected: 0 });
  t.visible('missing-n', { args: [[0, 1, 2, 3]], expected: 4 });
  t.visible('missing-middle', { args: [[0, 1, 3, 4]], expected: 2 });
  t.visible('shuffled', { args: [[4, 2, 1, 0]], expected: 3 });
  t.visible('short', { args: [[1, 0]], expected: 2 });

  // ── Hidden Tests ──
  t.hidden('deterministic-1', { args: [[12, 1, 11, 2, 10, 3, 9, 4, 8, 5, 7, 6]], expected: 0 });
  t.hidden('deterministic-2', { args: [[13, 0, 12, 1, 11, 2, 10, 3, 9, 4, 8, 5, 7, 6]], expected: 14 });

  // ── Generated Tests ──
  for (let i = 0; i < 13; i++) {
    const isLarge = i >= 11;
    const n = isLarge ? rng.int(1000, 2000) : rng.int(10, 500);
    const missing = rng.int(0, n);
    const testArr: number[] = [];
    for (let val = 0; val <= n; val++) {
      if (val !== missing) testArr.push(val);
    }
    // Fisher-Yates shuffle
    for (let k = testArr.length - 1; k > 0; k--) {
      const j = rng.int(0, k);
      const temp = testArr[k]!;
      testArr[k] = testArr[j]!;
      testArr[j] = temp;
    }
    t.hidden(`gen-${i}`, { args: [testArr], expected: missing });
  }
});
