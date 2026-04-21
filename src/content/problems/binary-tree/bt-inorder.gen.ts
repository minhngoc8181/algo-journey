import { defineTests } from '../../_test-utils';

// Level-order array rules (LeetCode BFS, same as our buildTree):
//   null nodes are NOT expanded — only non-null nodes contribute children slots.
// Right chain 1→2→3 = [1, null, 2, null, 3]   (1.right=2, then 2.right=3)
// LeetCode example 1.right=2, 2.left=3 = [1, null, 2, 3]   (2.left=3, 2.right=nothing)

export default defineTests('bt-inorder', (t) => {
  // LeetCode example: 1.right=2, 2.left=3 → inorder [1, 3, 2]
  t.visible('example-chain', { args: [[1, null, 2, 3]], expected: [1, 3, 2] });
  t.visible('empty',         { args: [[]], expected: [] });
  t.visible('single',        { args: [[1]], expected: [1] });
  t.visible('perfect-3',     { args: [[4, 2, 6, 1, 3, 5, 7]], expected: [1, 2, 3, 4, 5, 6, 7] });

  t.hidden('two-left',       { args: [[2, 1, null]], expected: [1, 2] });
  t.hidden('two-right',      { args: [[1, null, 2]], expected: [1, 2] });
  t.hidden('three-nodes',    { args: [[2, 1, 3]], expected: [1, 2, 3] });
  t.hidden('left-chain',     { args: [[4, 3, null, 2, null, 1]], expected: [1, 2, 3, 4] });
  // Right chain 1→2→3: inorder [1, 2, 3]
  t.hidden('right-chain',    { args: [[1, null, 2, null, 3]], expected: [1, 2, 3] });
  t.hidden('five-nodes',     { args: [[5, 3, 7, 1, 4, 6, 8]], expected: [1, 3, 4, 5, 6, 7, 8] });
  t.hidden('bst-sorted',     { args: [[8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15]], expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] });
  t.hidden('negatives',      { args: [[-2, -4, -1, -5, -3]], expected: [-5, -4, -3, -2, -1] });
});
