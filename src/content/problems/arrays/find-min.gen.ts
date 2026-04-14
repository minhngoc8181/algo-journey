import { defineTests } from '../../_test-utils';

export default defineTests('find-min', (t, rng) => {
  // ── Visible Tests ──
  t.visible('mixed-values', { args: [[3, 8, 1, 6]], expected: 1 });
  t.visible('negatives', { args: [[-4, -9, -2, -9]], expected: -9 });
  t.visible('all-equal', { args: [[5, 5, 5, 5]], expected: 5 });
  t.visible('repeating-extreme', { args: [[0, 7, 0, 3, 7, 2]], expected: 0 });
  t.visible('extreme-at-start', { args: [[9, 1, 8, 2, 7, 3]], expected: 1 });

  // ── Hidden Tests ──
  t.hidden('long-alternating', { args: [[4, 1, 9, 3, 8, 2, 4, 1, 9, 3, 8, 2]], expected: 1 });
  t.hidden('descending-heavy', { args: [[9, 8, 7, 6, 5, 4, 3, 9, 8, 7, 6, 5, 4, 3]], expected: 3 });

  // ── Generated Tests ──
  for (let i = 0; i < 13; i++) {
    const isLarge = i >= 11;
    const len = isLarge ? rng.int(1000, 2000) : rng.int(5, 500);
    const testArr = rng.intArray(len, -10000, 10000);
    t.hidden(`gen-${i}`, { args: [testArr], expected: Math.min(...testArr) });
  }
});
