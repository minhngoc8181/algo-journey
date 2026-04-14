import { defineTests } from '../../_test-utils';

export default defineTests('sort-descending', (t, rng) => {
  // ── Visible Tests ──
  t.visible('small-unsorted', { args: [[4, 1, 3, 2]], expected: [4, 3, 2, 1] });
  t.visible('with-duplicates', { args: [[5, 5, 2, 2, 1]], expected: [5, 5, 2, 2, 1] });
  t.visible('mixed-signs', { args: [[-3, 0, 2, -1]], expected: [2, 0, -1, -3] });
  t.visible('already-descending', { args: [[9, 8, 7, 6, 5]], expected: [9, 8, 7, 6, 5] });
  t.visible('already-ascending', { args: [[1, 2, 3, 4]], expected: [4, 3, 2, 1] });

  // ── Hidden Tests ──
  t.hidden('alternating', { args: [[9, 1, 8, 2, 7, 3, 9, 1, 8, 2, 7, 3]], expected: [9, 9, 8, 8, 7, 7, 3, 3, 2, 2, 1, 1] });
  t.hidden('large-blocks', { args: [[5, 5, 4, 4, 3, 3, 2, 2, 5, 5, 4, 4, 3, 3, 2, 2]], expected: [5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2] });
  t.hidden('all-negative-mixed', { args: [[-4, -6, -3, -5, -2, -4, -4, -6, -3, -5, -2, -4]], expected: [-2, -2, -3, -3, -4, -4, -4, -4, -5, -5, -6, -6] });
  t.hidden('all-same', { args: [Array(15).fill(4)], expected: Array(15).fill(4) });
  t.hidden('empty', { args: [[]], expected: [] });
  t.hidden('single', { args: [[42]], expected: [42] });
  t.hidden('zeros-interleaved', { args: [[0, 7, 0, 6, 0, 5, 0, 7, 0, 6, 0, 5]], expected: [7, 7, 6, 6, 5, 5, 0, 0, 0, 0, 0, 0] });

  // ── Generated Tests ──
  for (let i = 0; i < 8; i++) {
    const len = rng.int(10, 1000);
    const testArr = rng.intArray(len, -100, 100);
    
    const expected = [...testArr].sort((a, b) => b - a);
    
    t.hidden(`gen-${i}`, { args: [testArr], expected });
  }
});
