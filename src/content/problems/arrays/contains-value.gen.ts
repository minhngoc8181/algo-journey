import { defineTests } from '../../_test-utils';

export default defineTests('contains-value', (t, rng) => {
  // ── Visible Tests ──
  t.visible('repeats', { args: [[8, 2, 5, 2, 9], 2], expected: true });
  t.visible('absent', { args: [[4, 7, 1, 6], 9], expected: false });
  t.visible('all-match', { args: [[3, 3, 3, 3], 3], expected: true });
  t.visible('at-last-index', { args: [[6, 1, 9, 4, 5], 5], expected: true });

  // ── Hidden Tests ──
  t.hidden('empty-array', { args: [[], 5], expected: false });
  
  // ── Generated Tests ──
  for (let i = 0; i < 15; i++) {
    const len = rng.int(10, 5000);
    const testArr = rng.intArray(len, -500, 500);
    const target = rng.bool(0.6) ? rng.pick(testArr) : rng.int(1000, 2000);
    t.hidden(`gen-${i}`, { args: [testArr, target], expected: testArr.includes(target) });
  }
});
