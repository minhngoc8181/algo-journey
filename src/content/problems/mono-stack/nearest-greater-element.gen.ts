import { defineTests } from '../../_test-utils';

export default defineTests('nearest-greater-element', (t) => {
  // ── Visible tests ──
  t.visible('basic', { args: [[2, 1, 2, 4, 3]], expected: [4, 2, 4, -1, -1] });
  t.visible('descending', { args: [[5, 4, 3, 2, 1]], expected: [-1, -1, -1, -1, -1] });
  t.visible('ascending', { args: [[1, 2, 3, 4, 5]], expected: [2, 3, 4, 5, -1] });
  t.visible('single', { args: [[42]], expected: [-1] });
  t.visible('duplicates', { args: [[3, 3, 3, 3]], expected: [-1, -1, -1, -1] });
  t.visible('mixed', { args: [[1, 3, 2, 4]], expected: [3, 4, 4, -1] });

  // ── Hidden tests ──
  t.hidden('all-same', { args: [[7, 7, 7, 7, 7]], expected: [-1, -1, -1, -1, -1] });
  t.hidden('valley', { args: [[5, 1, 5]], expected: [-1, 5, -1] });
  t.hidden('peak', { args: [[1, 5, 1]], expected: [5, -1, -1] });
  t.hidden('two-elements', { args: [[1, 2]], expected: [2, -1] });
  t.hidden('zigzag', { args: [[1, 3, 2, 4, 1]], expected: [3, 4, 4, -1, -1] });
});
