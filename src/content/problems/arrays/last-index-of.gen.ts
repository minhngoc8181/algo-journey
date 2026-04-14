import { defineTests } from '../../_test-utils';

export default defineTests('last-index-of', (t, rng) => {
  // ── Visible Tests ──
  t.visible('target-repeats', { args: [[8, 2, 5, 2, 9], 2], expected: 3 });
  t.visible('target-absent', { args: [[4, 7, 1, 6], 9], expected: -1 });
  t.visible('all-match', { args: [[3, 3, 3, 3], 3], expected: 3 });
  t.visible('at-last-index', { args: [[6, 1, 9, 4, 5], 5], expected: 4 });
  t.visible('multiple-hits', { args: [[2, 7, 2, 9, 2, 1], 2], expected: 4 });

  // ── Hidden Tests ──
  t.hidden('large-no-match', { args: [[-9, -7, -5, -3, -1, 1, 3, 5, 9, -9, -7, -5, -3, -1, 1, 3, 5, 9], 7], expected: -1 });
  t.hidden('large-repeats', { args: [[5, -7, -5, -3, -1, 1, 3, 7, 9, -9, -7, 5, -3, -1, 1, 3, 7, 9, -9, -7, 5, -3, -1, 1], 5], expected: 20 });
  t.hidden('target-only-at-last', { args: [[-9, -7, -5, -3, -1, 1, 3, 5, 7, 9, -9, -7, -5, -3, -1, 1, 3, 5, 7, 9, -9, -7, -5, -3, -1, 4], 4], expected: 25 });
  t.hidden('target-cluster-front', { args: [[-2, -2, -2, -2, -1, 1, 3, 5, 7, 9], -2], expected: 3 });
  t.hidden('target-cluster-near-end', { args: [[-9, -7, -5, -3, -1, 1, 3, 5, 7, 9, -9, -7, -5, -3, -1, 1, 3, 5, 7, 9, -9, -7, 6, 6, 6, 6, 3, 5], 6], expected: 25 });

  // ── Generated Tests ──
  for (let i = 0; i < 11; i++) {
    const isLarge = i >= 9;
    const len = isLarge ? rng.int(1000, 2000) : rng.int(10, 500);
    const testArr = rng.intArray(len, -100, 100);
    // force 1 single absent test to avoid high passing rate with -1
    const tgt = (i === 1) ? rng.int(1000, 2000) : rng.pick(testArr);
    t.hidden(`gen-${i}`, { args: [testArr, tgt], expected: testArr.lastIndexOf(tgt) });
  }
});
