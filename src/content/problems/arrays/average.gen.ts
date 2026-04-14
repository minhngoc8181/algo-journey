import { defineTests } from '../../_test-utils';

export default defineTests('average', (t, rng) => {
  // ── Visible Tests ──
  t.visible('increasing-seq', { args: [[1, 2, 3, 4]], expected: 2 });
  t.visible('balance-out', { args: [[-5, 10, -5, 10]], expected: 2 });
  t.visible('all-zeros', { args: [[0, 0, 0, 0]], expected: 0 });
  t.visible('all-equal', { args: [[7, 7, 7]], expected: 7 });
  t.visible('negative-only', { args: [[-3, -1, -4, -2]], expected: -2 });

  // ── Hidden Tests ──
  t.hidden('long-increasing', { args: [[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5]], expected: 3 });
  t.hidden('long-mixed-sign', { args: [[-6, 9, -4, 7, -2, 5, -6, 9, -4, 7, -2, 5, -6, 9, -4, 7, -2, 5, -6, 9, -4, 7]], expected: 1 });
  t.hidden('large-uniform', { args: [[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]], expected: 10 });
  t.hidden('binary-like', { args: [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1]], expected: 0 });

  // ── Generated Tests ──
  for (let i = 0; i < 11; i++) {
    const len = rng.int(10, 5000);
    const testArr = rng.intArray(len, -1000, 1000);
    const sum = testArr.reduce((acc, val) => acc + val, 0);
    const expected = Math.trunc(sum / len); // Java integer division
    t.hidden(`gen-${i}`, { args: [testArr], expected });
  }
});
