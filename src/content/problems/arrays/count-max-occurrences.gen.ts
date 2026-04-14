import { defineTests } from '../../_test-utils';

export default defineTests('count-max-occurrences', (t, rng) => {
  // ── Visible Tests ──
  t.visible('max-twice', { args: [[1, 9, 2, 9, 3]], expected: 2 });
  t.visible('all-max', { args: [[5, 5, 5, 5]], expected: 4 });
  t.visible('negatives', { args: [[-1, -3, -1, -2]], expected: 2 });
  t.visible('max-cluster', { args: [[0, 7, 7, 7, 1]], expected: 3 });
  t.visible('repeats-across', { args: [[4, 2, 4, 1, 4, 3]], expected: 3 });

  // ── Hidden Tests ──
  t.hidden('large-repeated', { args: [[9, 1, 9, 2, 9, 9, 1, 9, 2, 9, 9, 1, 9, 2, 9, 9, 1, 9, 2, 9, 9, 1]], expected: 13 });
  t.hidden('large-uniform', { args: [Array(24).fill(6)], expected: 24 });
  t.hidden('negative-only-repeat', { args: [[-2, -7, -2, -6, -2, -7, -2, -6, -2, -7, -2, -6, -2, -7, -2, -6, -2, -7, -2, -6, -2, -7, -2, -6, -2, -7]], expected: 13 });
  t.hidden('separated-positions', { args: [[12, 3, 12, 4, 12, 5, 12, 3, 12, 4, 12, 5, 12, 3, 12, 4, 12, 5, 12, 3, 12, 4, 12, 5, 12, 3, 12, 4]], expected: 14 });
  t.hidden('two-compete', { args: [[5, 11, 5, 11, 5, 11, 5, 11, 5, 11, 5, 11, 5, 11, 5, 11, 5, 11, 5, 11, 5, 11, 5, 11, 5, 11, 5, 11, 5, 11, 5, 11, 5, 11, 5, 11]], expected: 18 });

  // ── Generated Tests ──
  for (let i = 0; i < 10; i++) {
    const isLarge = i >= 8;
    const len = isLarge ? rng.int(1000, 2000) : rng.int(5, 500);
    const testArr = rng.intArray(len, -100, 100);
    
    let max = testArr[0]!;
    for (const val of testArr) {
        if (val > max) max = val;
    }
    let count = 0;
    for (const val of testArr) {
        if (val === max) count++;
    }

    t.hidden(`gen-${i}`, { args: [testArr], expected: count });
  }
});
