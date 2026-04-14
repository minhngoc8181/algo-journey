import { defineTests } from '../../_test-utils';

export default defineTests('remove-duplicates', (t, rng) => {
  // ── Visible Tests ──
  t.visible('small-unsorted', { args: [[4, 1, 3, 2]], expected: [4, 1, 3, 2] });
  t.visible('duplicates', { args: [[5, 5, 2, 2, 1]], expected: [5, 2, 1] });
  t.visible('mixed-signs', { args: [[-3, 0, 2, -1]], expected: [-3, 0, 2, -1] });
  t.visible('reverse-sorted', { args: [[9, 8, 7, 6, 5]], expected: [9, 8, 7, 6, 5] });
  t.visible('already-sorted', { args: [[1, 2, 3, 4]], expected: [1, 2, 3, 4] });

  // ── Hidden Tests ──
  t.hidden('long-alternating', { args: [[9, 1, 8, 2, 7, 3, 9, 1, 8, 2, 7, 3, 9, 1, 8, 2, 7, 3]], expected: [9, 1, 8, 2, 7, 3] });
  t.hidden('long-blocks', { args: [[5, 5, 4, 4, 3, 3, 2, 2, 5, 5, 4, 4, 3, 3, 2, 2]], expected: [5, 4, 3, 2] });
  t.hidden('large-uniform', { args: [Array(36).fill(4)], expected: [4] });
  t.hidden('alternating-dupes', { args: [[2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1]], expected: [2, 1] });
  t.hidden('zeros-interleaved', { args: [[0, 7, 0, 6, 0, 5, 0, 7, 0, 6, 0, 5]], expected: [0, 7, 6, 5] });
  t.hidden('large-oscillating', { args: [[15, -1, 14, -2, 13, -3, 15, -1, 14, -2, 13, -3]], expected: [15, -1, 14, -2, 13, -3] });
  t.hidden('large-mixed-pattern', { args: [[-4, 6, -3, 5, -2, 4, -4, 6, -3, 5, -2, 4]], expected: [-4, 6, -3, 5, -2, 4] });
  t.hidden('large-descending', { args: [[12, 11, 10, 9, 8, 7, 12, 11, 10, 9, 8, 7]], expected: [12, 11, 10, 9, 8, 7] });

  // ── Generated Tests ──
  function dedup(arr: number[]): number[] {
    const seen = new Set<number>();
    const res: number[] = [];
    for (const v of arr) { if (!seen.has(v)) { seen.add(v); res.push(v); } }
    return res;
  }

  for (let i = 0; i < 7; i++) {
    const isLarge = i >= 5;
    const len = isLarge ? rng.int(1000, 2000) : rng.int(10, 500);
    const testArr = rng.intArray(len, -20, 20);
    t.hidden(`gen-${i}`, { args: [testArr], expected: dedup(testArr) });
  }
});
