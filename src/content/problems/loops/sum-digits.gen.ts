import { defineTests } from '../../_test-utils';
function solveDigitSum(n: number): number { let s = 0; while (n > 0) { s += n % 10; n = Math.floor(n / 10); } return s; }
export default defineTests('sum-digits', (t, rng) => {
  t.visible('123', { args: [123], expected: 6 });
  t.visible('0', { args: [0], expected: 0 });
  t.hidden('single', { args: [5], expected: 5 });
  t.hidden('all-nines', { args: [999], expected: 27 });
  t.hidden('power-10', { args: [1000], expected: 1 });
  t.hidden('large', { args: [999999999], expected: 81 });
  for (let i = 0; i < 15; i++) {
    const genN = rng.int(1000, 999999999);
    t.hidden(`gen-${i}`, { args: [genN], expected: solveDigitSum(genN) });
  }
});
