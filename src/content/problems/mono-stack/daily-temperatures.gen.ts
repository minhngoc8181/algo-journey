import { defineTests } from '../../_test-utils';

export default defineTests('daily-temperatures', (t) => {
  // ── Visible tests ──
  t.visible('example-1', { args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] });
  t.visible('increasing', { args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] });
  t.visible('decreasing', { args: [[60, 50, 40, 30]], expected: [0, 0, 0, 0] });
  t.visible('single', { args: [[50]], expected: [0] });

  // ── Hidden tests ──
  t.hidden('all-same', { args: [[70, 70, 70, 70]], expected: [0, 0, 0, 0] });
  t.hidden('v-shape', { args: [[50, 40, 30, 40, 50]], expected: [0, 3, 1, 1, 0] });
  t.hidden('two-rising', { args: [[30, 31]], expected: [1, 0] });
  t.hidden('two-falling', { args: [[31, 30]], expected: [0, 0] });
  t.hidden('plateau-spike', { args: [[40, 40, 40, 90]], expected: [3, 2, 1, 0] });
});
