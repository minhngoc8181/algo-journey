import { defineTests } from '../../_test-utils';
export default defineTests('max-element', (t, rng) => {
  t.visible('example-1', { args: [[3, 1, 4, 1, 5, 9]], expected: 9 });
  t.visible('example-2', { args: [[-5, -2, -8]], expected: -2 });
  t.hidden('single', { args: [[42]], expected: 42 });
  t.hidden('all-same', { args: [[7, 7, 7]], expected: 7 });
  t.hidden('max-at-start', { args: [[100, 1, 2, 3]], expected: 100 });
  t.hidden('max-at-end', { args: [[1, 2, 3, 100]], expected: 100 });
  t.hidden('all-negative', { args: [[-100, -200, -1]], expected: -1 });
  const large = rng.intArray(10000, -100000, 100000);
  t.hidden('stress-10k', { args: [large], expected: Math.max(...large) });

  for (let i = 0; i < 15; i++) {
    const len = rng.int(5, 5000);
    const testArr = rng.intArray(len, -20000, 20000);
    t.hidden(`gen-${i}`, { args: [testArr], expected: Math.max(...testArr) });
  }
});
