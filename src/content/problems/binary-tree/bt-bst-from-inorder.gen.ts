import { defineTests } from '../../_test-utils';

// sortedArrayToBST: args=[sorted int array], returns TreeNode
// Reference solution uses left-biased mid: mid = lo + (hi - lo) / 2
// Expected values are computed using the same mid formula.

export default defineTests('bt-bst-from-inorder', (t) => {
  // [-10,-3,0,5,9]: mid=2 → root=0
  //   left [-10,-3]: mid=0 → root=-10, right=-3  → {-10, null, -3}
  //   right [5,9]:   mid=3 → root=5,  right=9    → {5, null, 9}
  // Level-order: [0, -10, 5, null, -3, null, 9]
  t.visible('example-1', {
    args: [[-10, -3, 0, 5, 9]],
    expected: [0, -10, 5, null, -3, null, 9],
  });

  // [1,3]: mid=0 → root=1, right=3 → [1, null, 3]
  t.visible('two-nodes',  { args: [[1, 3]], expected: [1, null, 3] });

  t.visible('single',     { args: [[5]], expected: [5] });

  // [1,2,3]: mid=1 → root=2, left=1, right=3
  t.hidden('three-nodes', { args: [[1, 2, 3]], expected: [2, 1, 3] });

  // [1,2,3,4]: mid=1 → root=2, left=[1], right=[3,4]
  //   right [3,4]: mid=2 → root=3, right=4 → {3, null, 4}
  // Level-order: [2, 1, 3, null, null, null, 4]
  t.hidden('four-nodes',  { args: [[1, 2, 3, 4]], expected: [2, 1, 3, null, null, null, 4] });

  // [1..7]: mid=3 → root=4, left=[1,2,3], right=[5,6,7]
  t.hidden('seven-nodes', { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [4, 2, 6, 1, 3, 5, 7] });

  // [-5,-4,-3,-2,-1]: mid=2 → root=-3
  //   left [-5,-4]: mid=0 → root=-5, right=-4 → {-5, null, -4}
  //   right [-2,-1]: mid=3 → root=-2, right=-1 → {-2, null, -1}
  // Level-order: [-3, -5, -2, null, -4, null, -1]
  t.hidden('negatives',   { args: [[-5, -4, -3, -2, -1]], expected: [-3, -5, -2, null, -4, null, -1] });

  // [1..15]: mid=7 → root=8
  t.hidden('large-sorted',{ args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]], expected: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15] });
});
