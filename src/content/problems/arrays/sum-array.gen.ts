import { defineTests } from '../../_test-utils';
export default defineTests('sum-array', (t, rng) => {
  t.visible('basic', { args: [[1, 2, 3, 4, 5]], expected: 15 });
  t.visible('empty', { args: [[]], expected: 0 });
  t.hidden('single', { args: [[42]], expected: 42 });
  t.hidden('negatives', { args: [[-1, -2, -3]], expected: -6 });
  t.hidden('mixed', { args: [[-5, 10, -5]], expected: 0 });
  t.hidden('zeros', { args: [[0, 0, 0]], expected: 0 });
  const large = rng.intArray(10000, -1000, 1000);
  t.hidden('stress-10k', { args: [large], expected: large.reduce((a, b) => a + b, 0) });

  for (let i = 0; i < 13; i++) {
    const len = rng.int(10, 5000);
    const testArr = rng.intArray(len, -2000, 2000);
    t.hidden(`gen-${i}`, { args: [testArr], expected: testArr.reduce((a, b) => a + b, 0) });
  }
});
