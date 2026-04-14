import { defineTests } from '../../_test-utils';
function fib(n: number): number { let a = 0, b = 1; for (let i = 0; i < n; i++) { [a, b] = [b, a + b]; } return a; }
export default defineTests('fibonacci', (t, rng) => {
  // Visible (2)
  t.visible('n6', { args: [6], expected: 8 });
  t.visible('n1', { args: [1], expected: 1 });
  // Hidden – key values (13)
  t.hidden('n0', { args: [0], expected: 0 });
  t.hidden('n2', { args: [2], expected: 1 });
  t.hidden('n3', { args: [3], expected: 2 });
  t.hidden('n4', { args: [4], expected: 3 });
  t.hidden('n5', { args: [5], expected: 5 });
  t.hidden('n7', { args: [7], expected: 13 });
  t.hidden('n8', { args: [8], expected: 21 });
  t.hidden('n9', { args: [9], expected: 34 });
  t.hidden('n10', { args: [10], expected: 55 });
  t.hidden('n15', { args: [15], expected: fib(15) });
  t.hidden('n20', { args: [20], expected: fib(20) });
  t.hidden('n25', { args: [25], expected: fib(25) });
  // Generated – use seeded rng (was Math.random() before), pick from 1–30
  for (let i = 0; i < 5; i++) {
    const n = rng.int(1, 30);
    t.hidden(`gen-${i}`, { args: [n], expected: fib(n) });
  }
});
