import { defineTests } from '../../_test-utils';

export default defineTests('count-unique', (t, rng) => {
  // ── Visible Tests ──
  t.visible('all-unique', { args: [[1, 2, 3, 4]], expected: 4 });
  t.visible('one-unique', { args: [[5, 5, 5, 5]], expected: 1 });
  t.visible('mixed', { args: [[1, 2, 1, 2, 3]], expected: 3 });
  t.visible('mixed-signs', { args: [[-1, 0, 1, 0, -1]], expected: 3 });
  t.visible('late-appearances', { args: [[3, 3, 2, 1, 2, 4]], expected: 4 });

  // ── Hidden Tests ──
  t.hidden('repeated-cycle', { args: [[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5]], expected: 5 });
  t.hidden('large-single-value', { args: [Array(22).fill(7)], expected: 1 });
  t.hidden('large-multi-sign-cycle', { args: [[-3, -2, -1, 0, 1, 2, -3, -2, -1, 0, 1, 2, -3, -2, -1, 0, 1, 2, -3, -2, -1, 0, 1, 2]], expected: 6 });
  t.hidden('one-frequent-many-rare', { args: [[5, 1, 5, 2, 5, 3, 5, 4, 5, 1, 5, 2, 5, 3, 5, 4, 5, 1, 5, 2, 5, 3, 5, 4, 5, 1]], expected: 5 });
  t.hidden('pairs-only', { args: [[4, 4, 3, 3, 2, 2, 1, 1, 4, 4, 3, 3, 2, 2, 1, 1]], expected: 4 });

  // ── Generated Tests ──
  for (let i = 0; i < 10; i++) {
    const isLarge = i >= 8;
    const len = isLarge ? rng.int(1000, 2000) : rng.int(5, 500);
    const testArr = rng.intArray(len, -20, 20); // Narrow range helps trigger many duplicates
    
    const uniqueCount = new Set(testArr).size;
    t.hidden(`gen-${i}`, { args: [testArr], expected: uniqueCount });
  }
});
