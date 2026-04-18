import { defineTests } from '../../_test-utils';

export default defineTests('sum-subarray-minimums', (t) => {
  // ── Visible tests ──
  t.visible('example-1', { args: [[3, 1, 2, 4]], expected: 17 });
  t.visible('example-2', { args: [[11, 81, 94, 43, 3]], expected: 444 });
  t.visible('single', { args: [[5]], expected: 5 });
  t.visible('two-elements', { args: [[2, 3]], expected: 7 }); // [2]=2, [3]=3, [2,3]=2 → 7

  // ── Hidden tests ──
  t.hidden('all-same', { args: [[4, 4, 4]], expected: 24 }); // [4]+[4]+[4]+[4,4]+[4,4]+[4,4,4] = 4+4+4+4+4+4 = 24
  t.hidden('ascending', { args: [[1, 2, 3]], expected: 10 }); // [1]+[2]+[3]+[1,2]+[2,3]+[1,2,3] = 1+2+3+1+2+1 = 10
  t.hidden('descending', { args: [[3, 2, 1]], expected: 10 }); // [3]+[2]+[1]+[2,1]+[3,2]+[3,2,1] = 3+2+1+1+2+1 = 10
  t.hidden('v-shape', { args: [[3, 1, 3]], expected: 10 });
  t.hidden('large-values', { args: [[30000, 30000]], expected: 90000 });
});
