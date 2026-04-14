import { defineTests } from '../../_test-utils';

export default defineTests('all-indices', (t, rng) => {
  // ── Visible Tests ──
  t.visible('target-repeats', { args: [[8, 2, 5, 2, 9], 2], expected: [1, 3] });
  t.visible('target-absent', { args: [[4, 7, 1, 6], 9], expected: [] });
  t.visible('all-match', { args: [[3, 3, 3, 3], 3], expected: [0, 1, 2, 3] });
  t.visible('at-last-index', { args: [[6, 1, 9, 4, 5], 5], expected: [4] });
  t.visible('multiple-hits', { args: [[2, 7, 2, 9, 2, 1], 2], expected: [0, 2, 4] });

  // ── Hidden Tests ──
  t.hidden('large-no-match', { args: [[-9, -7, -5, -3, -1, 1, 3, 5, 9, -9, -7, -5, -3, -1, 1, 3, 5, 9, -9, -7, -5, -3], 7], expected: [] });
  t.hidden('large-repeats', { args: [[5, -7, -5, -3, -1, 1, 3, 7, 9, -9, -7, 5, -3, -1, 1, 3, 7, 9, -9, -7, 5, -3, -1, 1], 5], expected: [0, 11, 20] });
  t.hidden('target-only-at-last', { args: [[-9, -7, -5, -3, -1, 1, 3, 5, 7, 9, -9, -7, -5, -3, -1, 1, 3, 5, 7, 9, -9, -7, -5, -3, -1, 4], 4], expected: [25] });
  t.hidden('target-cluster-front', { args: [[-2, -2, -2, -2, -1, 1, 3, 5, 7, 9], -2], expected: [0, 1, 2, 3] });
  t.hidden('target-cluster-near-end', { args: [[-9, -7, -5, -3, -1, 1, 3, 5, 7, 9, -9, -7, -5, -3, -1, 1, 3, 5, 7, 9, -9, -7, 6, 6, 6, 6, 3, 5], 6], expected: [22, 23, 24, 25] });

  // ── Generated Tests ──
  for (let i = 0; i < 10; i++) {
    const len = rng.int(10, 5000);
    const testArr = rng.intArray(len, -20, 20); // smaller range to produce multiple hits
    const tgt = rng.bool(0.7) ? rng.pick(testArr) : rng.int(100, 200);
    
    const expected = [];
    for(let j=0; j<testArr.length; j++) {
        if (testArr[j] === tgt) {
            expected.push(j);
        }
    }
    
    t.hidden(`gen-${i}`, { args: [testArr, tgt], expected });
  }
});
