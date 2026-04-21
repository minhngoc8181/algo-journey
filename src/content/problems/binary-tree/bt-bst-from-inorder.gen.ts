import { defineTests } from '../../_test-utils';

// sortedArrayToBST: args=[sorted int array], returns TreeNode
// Verified via inorder traversal (must equal the sorted input array)
// Expected is the SAME sorted array as input (inorder of any valid BST from this array)
// We pass expected as a level-order balanced tree for one canonical answer,
// but since comparison is via treeToString (inorder), any balanced BST with same inorder passes.

// Note: treeToString uses INORDER traversal (sorted for BST).
// So we need expected inorder = nums. We build a canonical balanced BST for expected.

export default defineTests('bt-bst-from-inorder', (t) => {
  // [-10,-3,0,5,9] → balanced BST, one valid: root=0, left=[-10,-3], right=[5,9]
  // inorder = [-10,-3,0,5,9]
  t.visible('example-1', {
    args: [[-10, -3, 0, 5, 9]],
    expected: [0, -3, 9, -10, null, 5, null],
  });

  // [1,3] → root=1 or 3. inorder=[1,3]. Use root=3 left=1 OR root=1 right=3
  // Canonical middle: mid=1 → root=3, left=1? No: array [1,3] mid=index 1 → root=3, left=[1]
  // Actually mid = Math.floor(0/2 + 2/2) = 1 → value=3? No: [1,3], mid=1 → value=3? indices 0,1. mid=0 or 1?
  // Standard: mid = (lo+hi)/2 = 0 = value 1? Or (0+1)/2=0 → value 1. Left=[], right=[3].
  // Both [1, null, 3] and [3,1,null] are valid. We compare by inorder=[1,3].
  // Use inorder comparison only: expected just needs inorder=[1,3].
  t.visible('two-nodes',  { args: [[1, 3]], expected: [1, null, 3] });

  t.visible('single',     { args: [[5]], expected: [5] });

  t.hidden('three-nodes', { args: [[1, 2, 3]], expected: [2, 1, 3] });
  t.hidden('four-nodes',  { args: [[1, 2, 3, 4]], expected: [2, 1, 3, null, null, null, 4] });
  t.hidden('seven-nodes', { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [4, 2, 6, 1, 3, 5, 7] });
  t.hidden('negatives',   { args: [[-5, -4, -3, -2, -1]], expected: [-3, -4, -1, -5, null, -2, null] });
  t.hidden('large-sorted',{ args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]], expected: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15] });
});
