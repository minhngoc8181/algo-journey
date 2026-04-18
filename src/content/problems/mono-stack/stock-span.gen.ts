import { defineTests } from '../../_test-utils';

export default defineTests('stock-span', (t) => {
  // ── Visible tests ──
  t.visible('example-1', { args: [[100, 80, 60, 70, 60, 75, 85]], expected: [1, 1, 1, 2, 1, 4, 6] });
  t.visible('increasing', { args: [[10, 20, 30, 40]], expected: [1, 2, 3, 4] });
  t.visible('decreasing', { args: [[40, 30, 20, 10]], expected: [1, 1, 1, 1] });
  t.visible('single', { args: [[50]], expected: [1] });

  // ── Hidden tests ──
  t.hidden('all-same', { args: [[5, 5, 5, 5]], expected: [1, 2, 3, 4] });
  t.hidden('v-shape', { args: [[5, 3, 1, 3, 5]], expected: [1, 1, 1, 3, 5] });
  t.hidden('two-elements', { args: [[10, 20]], expected: [1, 2] });
  t.hidden('two-elements-desc', { args: [[20, 10]], expected: [1, 1] });
  t.hidden('plateau-drop', { args: [[10, 10, 5, 10]], expected: [1, 2, 1, 4] });
});
