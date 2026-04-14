import { defineTests } from '../../_test-utils';
function fact(n: number): number { return n <= 1 ? 1 : n * fact(n - 1); }
export default defineTests('factorial', (t, rng) => {
  // Visible (2)
  t.visible('n5', { args: [5], expected: 120 });
  t.visible('n3', { args: [3], expected: 6 });
  // Hidden – key edge cases and representative values (13)
  t.hidden('n0', { args: [0], expected: 1 });
  t.hidden('n1', { args: [1], expected: 1 });
  t.hidden('n2', { args: [2], expected: 2 });
  t.hidden('n4', { args: [4], expected: 24 });
  t.hidden('n6', { args: [6], expected: 720 });
  t.hidden('n7', { args: [7], expected: fact(7) });
  t.hidden('n8', { args: [8], expected: fact(8) });
  t.hidden('n9', { args: [9], expected: fact(9) });
  t.hidden('n10', { args: [10], expected: fact(10) });
  t.hidden('n11', { args: [11], expected: fact(11) });
  t.hidden('n12', { args: [12], expected: fact(12) });
  // Generated – use seeded rng, pick from valid range 0–12 (avoid int overflow)
  for (let i = 0; i < 5; i++) {
    const n = rng.int(0, 12);
    t.hidden(`gen-${i}`, { args: [n], expected: fact(n) });
  }
});
