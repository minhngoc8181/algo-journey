import { defineTests } from '../../_test-utils';
export default defineTests('bubble-sort', (t, rng) => {
  t.visible('basic', { args: [[5, 1, 4, 2, 8]], expected: [1, 2, 4, 5, 8] });
  t.visible('sorted', { args: [[1, 2, 3]], expected: [1, 2, 3] });
  // Hidden edge cases
  t.hidden('reverse', { args: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] });
  t.hidden('single', { args: [[1]], expected: [1] });
  t.hidden('empty', { args: [[]], expected: [] });
  t.hidden('dups', { args: [[3, 1, 2, 3, 1]], expected: [1, 1, 2, 3, 3] });
  t.hidden('negatives', { args: [[-3, -1, -2]], expected: [-3, -2, -1] });
  // Stress: 500 elements (O(n²) keeps it reasonable)
  const arr = rng.intArray(500, -1000, 1000);
  t.hidden('stress-500', { args: [arr], expected: [...arr].sort((a, b) => a - b) });
  // Generated: 12 tests; O(N²) → keep arrays small (total = 2+5+1+12 = 20)
  for (let i = 0; i < 12; i++) {
    const len = rng.int(10, 400);
    const testArr = rng.intArray(len, -2000, 2000);
    t.hidden(`gen-${i}`, { args: [testArr], expected: [...testArr].sort((a, b) => a - b) });
  }
});
