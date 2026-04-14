import { defineTests } from '../../_test-utils';
function isPrime(n: number): boolean { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
export default defineTests('is-prime', (t, rng) => {
  t.visible('7', { args: [7], expected: true }); t.visible('4', { args: [4], expected: false });
  t.hidden('0', { args: [0], expected: false }); t.hidden('1', { args: [1], expected: false }); t.hidden('2', { args: [2], expected: true }); t.hidden('3', { args: [3], expected: true }); t.hidden('9', { args: [9], expected: false }); t.hidden('large-prime', { args: [7919], expected: true }); t.hidden('large-comp', { args: [7920], expected: false });
  for (let i = 0; i < 15; i++) {
    const n = rng.int(0, 1000000);
    t.hidden(`gen-${i}`, { args: [n], expected: isPrime(n) });
  }
});
