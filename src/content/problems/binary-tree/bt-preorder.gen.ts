import { defineTests } from '../../_test-utils';

// Level-order LeetCode BFS rules: null nodes not expanded.
// Right chain 1→2→3 = [1, null, 2, null, 3]
// Left chain 4→3→2→1 = [4, 3, null, 2, null, 1]

export default defineTests('bt-preorder', (t) => {
  // Right chain 1→2→3: preorder [1, 2, 3]
  t.visible('example-chain', { args: [[1, null, 2, null, 3]], expected: [1, 2, 3] });
  t.visible('empty',         { args: [[]], expected: [] });
  t.visible('single',        { args: [[1]], expected: [1] });
  t.visible('perfect-3',     { args: [[4, 2, 6, 1, 3, 5, 7]], expected: [4, 2, 1, 3, 6, 5, 7] });

  t.hidden('two-left',       { args: [[2, 1, null]], expected: [2, 1] });
  t.hidden('two-right',      { args: [[1, null, 2]], expected: [1, 2] });
  t.hidden('three-nodes',    { args: [[2, 1, 3]], expected: [2, 1, 3] });
  // Left chain 4→3→2→1: preorder [4, 3, 2, 1]
  t.hidden('left-chain',     { args: [[4, 3, null, 2, null, 1]], expected: [4, 3, 2, 1] });
  t.hidden('five-nodes',     { args: [[5, 3, 7, 1, 4, 6, 8]], expected: [5, 3, 1, 4, 7, 6, 8] });
  t.hidden('negatives',      { args: [[-2, -4, -1, -5, -3]], expected: [-2, -4, -5, -3, -1] });
  t.hidden('bst-full',       { args: [[8, 4, 12, 2, 6, 10, 14]], expected: [8, 4, 2, 6, 12, 10, 14] });
});
