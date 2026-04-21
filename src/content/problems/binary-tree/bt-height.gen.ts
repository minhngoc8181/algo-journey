import { defineTests } from '../../_test-utils';

export default defineTests('bt-height', (t) => {
  // Visible
  t.visible('example-1',    { args: [[3, 9, 20, null, null, 15, 7]], expected: 3 });
  t.visible('example-2',    { args: [[1, null, 2]], expected: 2 });
  t.visible('empty',        { args: [[]], expected: 0 });
  t.visible('single-node',  { args: [[42]], expected: 1 });

  // Hidden
  t.hidden('two-left',      { args: [[2, 1, null]], expected: 2 });
  t.hidden('two-right',     { args: [[1, null, 2]], expected: 2 });
  t.hidden('perfect-3',     { args: [[1, 2, 3, 4, 5, 6, 7]], expected: 3 });
  t.hidden('perfect-4',     { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]], expected: 4 });
  t.hidden('left-chain-3',  { args: [[3, 2, null, 1]], expected: 3 });
  // right chain 1→2→3: LeetCode format = [1, null, 2, null, 3]
  t.hidden('right-chain-3', { args: [[1, null, 2, null, 3]], expected: 3 });
  t.hidden('unbalanced',    { args: [[1, 2, 3, 4, null, null, null, 5]], expected: 4 });
  t.hidden('two-level',     { args: [[1, 2, 3]], expected: 2 });
  t.hidden('five-nodes',    { args: [[5, 3, 7, 1, 4]], expected: 3 });
  t.hidden('negative-vals', { args: [[-5, -3, -7]], expected: 2 });
});
