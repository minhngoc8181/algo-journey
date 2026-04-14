import { defineTests } from '../../_test-utils';
function gcd(a: number, b: number): number { while (b) { [a, b] = [b, a % b]; } return a; }
export default defineTests('gcd', (t, rng) => {
  t.visible('12-8', { args: [12, 8], expected: 4 });
  t.visible('7-13', { args: [7, 13], expected: 1 });
  t.hidden('same', { args: [5, 5], expected: 5 });
  t.hidden('one-is-1', { args: [1, 100], expected: 1 });
  t.hidden('coprime', { args: [17, 31], expected: 1 });
  t.hidden('large', { args: [1000000000, 500000000], expected: 500000000 });
  // Trim from 15 to 14 generated (total = 2+4+14 = 20)
  for (let i = 0; i < 14; i++) {
    const a = rng.int(1, 1000000);
    const b = rng.int(1, 1000000);
    t.hidden(`gen-${i}`, { args: [a, b], expected: gcd(a, b) });
  }
});
