import { defineTests } from '../../_test-utils';

export default defineTests('largest-rectangle-histogram', (t) => {
  // ── Visible tests ──
  t.visible('example-1', { args: [[2, 1, 5, 6, 2, 3]], expected: 10 });
  t.visible('two-bars', { args: [[2, 4]], expected: 4 });
  t.visible('single', { args: [[5]], expected: 5 });
  t.visible('uniform', { args: [[3, 3, 3, 3]], expected: 12 });

  // ── Hidden tests ──
  t.hidden('ascending', { args: [[1, 2, 3, 4, 5]], expected: 9 });
  t.hidden('descending', { args: [[5, 4, 3, 2, 1]], expected: 9 });
  t.hidden('v-shape', { args: [[5, 1, 5]], expected: 5 });
  t.hidden('with-zero', { args: [[0, 5, 0]], expected: 5 });
  t.hidden('all-zero', { args: [[0, 0, 0]], expected: 0 });
  t.hidden('large-single', { args: [[10000]], expected: 10000 });
  t.hidden('plateau', { args: [[2, 2, 5, 5, 2, 2]], expected: 12 });
});
