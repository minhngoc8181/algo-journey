import { defineTests } from '../../_test-utils';
export default defineTests('is-even', (t, rng) => {
  t.visible('even-4', { args: [4], expected: true });
  t.visible('odd-7', { args: [7], expected: false });
  t.hidden('zero', { args: [0], expected: true });
  t.hidden('neg-even', { args: [-2], expected: true });
  t.hidden('neg-odd', { args: [-3], expected: false });
  t.hidden('one', { args: [1], expected: false });
  t.hidden('large-even', { args: [1000000], expected: true });
  t.hidden('large-odd', { args: [999999], expected: false });
  // Trim from 15 to 12 (total = 2+6+12 = 20)
  for (let i = 0; i < 12; i++) {
    const n = rng.int(-1000000, 1000000);
    t.hidden(`gen-${i}`, { args: [n], expected: n % 2 === 0 });
  }
});
