import { defineTests } from '../../_test-utils';
export default defineTests('reverse-array', (t, rng) => {
  t.visible('example-1', { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] });
  t.visible('example-2', { args: [[10, 20]], expected: [20, 10] });
  t.hidden('single', { args: [[42]], expected: [42] });
  t.hidden('empty', { args: [[]], expected: [] });
  t.hidden('already-reversed', { args: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] });
  t.hidden('palindrome', { args: [[1, 2, 3, 2, 1]], expected: [1, 2, 3, 2, 1] });
  t.hidden('negatives', { args: [[-1, -2, -3]], expected: [-3, -2, -1] });
  const large = rng.intArray(5000, -10000, 10000);
  t.hidden('stress-5k', { args: [large], expected: [...large].reverse() });

  for (let i = 0; i < 15; i++) {
    const len = rng.int(10, 2000);
    const testArr = rng.intArray(len, -1000, 1000);
    t.hidden(`gen-${i}`, { args: [testArr], expected: [...testArr].reverse() });
  }
});
