import { defineTests } from '../../_test-utils';

export default defineTests('first-index-of', (t, rng) => {
  // ── Visible Tests from Legacy CSE201 ──
  t.visible('target-repeats', { args: [[8, 2, 5, 2, 9], 2], expected: 1 });
  t.visible('target-absent', { args: [[4, 7, 1, 6], 9], expected: -1 });
  t.visible('every-position-matches', { args: [[3, 3, 3, 3], 3], expected: 0 });
  t.visible('target-at-last', { args: [[6, 1, 9, 4, 5], 5], expected: 4 });
  t.visible('multiple-hits', { args: [[2, 7, 2, 9, 2, 1], 2], expected: 0 });

  // ── Hidden Edge Cases ──
  t.hidden('empty-array', { args: [[], 5], expected: -1 });
  t.hidden('single-match', { args: [[7], 7], expected: 0 });
  t.hidden('single-no-match', { args: [[3], 5], expected: -1 });

  // ── Hand-crafted / Extracted from Legacy hidden ──
  t.hidden('large-no-match', { args: [[-9, -7, -5, -3, -1, 1, 3, 5, 9, -9, -7, -5, -3, -1, 1, 3, 5, 9], 7], expected: -1 });
  t.hidden('large-repeated-front', { args: [[5, -7, -5, -3, -1, 1, 3, 7, 9, -9, -7, 5, -3], 5], expected: 0 });

  // ── Generated ──
  for (let i = 0; i < 10; i++) {
    const len = rng.int(10, 2000);
    const testArr: number[] = rng.intArray(len, -500, 500);
    
    // Safety check with RNG
    let tgt = 0;
    if (rng.bool(0.7) && testArr.length > 0) {
        tgt = testArr[rng.int(0, testArr.length - 1)]!;
    } else {
        tgt = rng.int(1000, 2000); // guaranteed absent
    }
    
    const expected = testArr.indexOf(tgt);
    t.hidden(`gen-${i}`, { args: [testArr, tgt], expected });
  }
});
