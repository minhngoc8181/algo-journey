import { defineTests } from '../../_test-utils';

// Level-order LeetCode BFS rules: null nodes not expanded.
// LeetCode postorder example: tree 1.right=2, 2.left=3 → array [1, null, 2, 3] → postorder [3, 2, 1]
// Left chain 4→3→2→1 = [4, 3, null, 2, null, 1] → postorder [1, 2, 3, 4]  (L→R→Root)
// Right chain 1→2→3 = [1, null, 2, null, 3] → postorder [3, 2, 1]

export default defineTests('bt-postorder', (t) => {
  // LeetCode example: 1.right=2, 2.left=3 → postorder [3, 2, 1]
  t.visible('example-chain', { args: [[1, null, 2, 3]], expected: [3, 2, 1] });
  t.visible('empty',         { args: [[]], expected: [] });
  t.visible('single',        { args: [[1]], expected: [1] });
  t.visible('perfect-3',     { args: [[4, 2, 6, 1, 3, 5, 7]], expected: [1, 3, 2, 5, 7, 6, 4] });

  t.hidden('two-left',       { args: [[2, 1, null]], expected: [1, 2] });
  t.hidden('two-right',      { args: [[1, null, 2]], expected: [2, 1] });
  t.hidden('three-nodes',    { args: [[2, 1, 3]], expected: [1, 3, 2] });
  // Left chain 4→3→2→1: postorder = [1, 2, 3, 4]  (deepest leaf first)
  t.hidden('left-chain',     { args: [[4, 3, null, 2, null, 1]], expected: [1, 2, 3, 4] });
  t.hidden('five-nodes',     { args: [[5, 3, 7, 1, 4, 6, 8]], expected: [1, 4, 3, 6, 8, 7, 5] });
  t.hidden('negatives',      { args: [[-2, -4, -1, -5, -3]], expected: [-5, -3, -4, -1, -2] });
  t.hidden('bst-full',       { args: [[8, 4, 12, 2, 6, 10, 14]], expected: [2, 6, 4, 10, 14, 12, 8] });
});
