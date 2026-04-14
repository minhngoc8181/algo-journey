import { defineTests } from '../../_test-utils';

export default defineTests('is-prime', (t, rng) => {
  // Visible
  t.visible('prime-7', { args: [7], expected: true });
  t.visible('composite-4', { args: [4], expected: false });
  // Hidden - edge cases
  t.hidden('0', { args: [0], expected: false });
  t.hidden('1', { args: [1], expected: false });
  t.hidden('2', { args: [2], expected: true });
  t.hidden('3', { args: [3], expected: true });
  t.hidden('9', { args: [9], expected: false });
  t.hidden('large-prime', { args: [7919], expected: true });
  t.hidden('large-comp', { args: [7920], expected: false });
  // Generated - alternating prime/composite for Rule #6 balance
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25];
  for (let i = 0; i < 11; i++) {
    if (i % 2 === 0) {
      const n = primes[rng.int(0, primes.length - 1)]!;
      t.hidden(`gen-prime-${i}`, { args: [n], expected: true });
    } else {
      const n = composites[rng.int(0, composites.length - 1)]!;
      t.hidden(`gen-comp-${i}`, { args: [n], expected: false });
    }
  }
});
