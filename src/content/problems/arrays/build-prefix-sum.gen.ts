import { defineTests } from '../../_test-utils';

export default defineTests('build-prefix-sum', (t, rng) => {
  // ── Visible Tests ──
  t.visible('simple', { args: [[1, 2, 3, 4]], expected: [0, 1, 3, 6, 10] });
  t.visible('mixed-signs', { args: [[-1, 2, -3, 4]], expected: [0, -1, 1, -2, 2] });
  t.visible('all-zeros', { args: [[0, 0, 0]], expected: [0, 0, 0, 0] });
  t.visible('single-element', { args: [[5]], expected: [0, 5] });
  t.visible('alternating-cancel', { args: [[10, -10, 10, -10]], expected: [0, 10, 0, 10, 0] });

  // ── Hidden Tests ──
  t.hidden('empty', { args: [[]], expected: [0] });
  t.hidden('long-repeating', { args: [[1, 2, 3, 4, 1, 2, 3, 4]], expected: [0, 1, 3, 6, 10, 11, 13, 16, 20] });
  t.hidden('large-uniform', { args: [Array(10).fill(5)], expected: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50] });

  // ── Generated Tests ──
  for (let i = 0; i < 12; i++) {
    const isLarge = i >= 10;
    const len = isLarge ? rng.int(1000, 2000) : rng.int(10, 500);
    const testArr = rng.intArray(len, -500, 500);
    
    const expected = [0];
    let sum = 0;
    for (const val of testArr) {
        sum += val;
        expected.push(sum);
    }

    t.hidden(`gen-${i}`, { args: [testArr], expected });
  }
});
