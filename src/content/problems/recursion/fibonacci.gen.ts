import { defineTests } from '../../_test-utils';
function fib(n: number): number { let a = 0, b = 1; for (let i = 0; i < n; i++) { [a, b] = [b, a + b]; } return a; }
export default defineTests('fibonacci', (t) => {
  t.visible('n6', { args: [6], expected: 8 }); t.visible('n0', { args: [0], expected: 0 });
  for (let i = 3; i < 16; i++) {
    if (i !== 6 && i !== 10) {
      t.hidden(`n${i}`, { args: [i], expected: fib(i) });
    }
  }
  for(let i=0; i<6; i++) {
      const n = Math.floor(Math.random() * 20) + 10;
      t.hidden(`gen-${i}`, { args: [n], expected: fib(n) });
  }
});
