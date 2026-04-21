import { defineTests } from '../../_test-utils';

// For bt-build-from-pre-in:
// args: [preorder_array, inorder_array]
// expected: the expected tree in level-order (will be compared via inorder traversal string)
// Since both actual and expected are TreeNode, platform uses treeToString(inorder) for comparison.
// The expected TreeNode must have the same inorder as the expected inorder sequence.
// We provide expected as a level-order array that represents the correct tree.

export default defineTests('bt-build-from-pre-in', (t) => {
  // Example 1: preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]
  // Tree: 3 has left=9, right=20; 20 has left=15, right=7
  // Level-order expected: [3, 9, 20, null, null, 15, 7]
  t.visible('example-1', {
    args: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]],
    expected: [3, 9, 20, null, null, 15, 7],
  });

  t.visible('two-nodes', {
    args: [[1, 2], [2, 1]],
    expected: [1, 2, null],
  });

  t.visible('single',   { args: [[1], [1]], expected: [1] });

  // [4,2,1,3,6,5,7] preorder, [1,2,3,4,5,6,7] inorder → perfect BST rooted at 4
  t.hidden('perfect-bst', {
    args: [[4, 2, 1, 3, 6, 5, 7], [1, 2, 3, 4, 5, 6, 7]],
    expected: [4, 2, 6, 1, 3, 5, 7],
  });

  t.hidden('right-only', {
    args: [[1, 2, 3], [1, 2, 3]],
    expected: [1, null, 2, null, 3],
  });

  t.hidden('left-only', {
    args: [[3, 2, 1], [1, 2, 3]],
    expected: [3, 2, null, 1],
  });

  t.hidden('five-nodes', {
    args: [[5, 3, 1, 4, 7], [1, 3, 4, 5, 7]],
    expected: [5, 3, 7, 1, 4],
  });
});
