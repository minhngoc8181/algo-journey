import { defineTests } from '../../_test-utils';

// args: [root_level_order_array, val]
// expected: the resulting BST level-order array (compared via treeToString = inorder)
// Since we compare by inorder, BST inorder = sorted. Expected inorder = sorted(vals + val).

export default defineTests('bt-bst-insert', (t) => {
  // root=[4,2,7,1,3], val=5 → inorder becomes [1,2,3,4,5,7]
  t.visible('example-1', {
    args: [[4, 2, 7, 1, 3], 5],
    expected: [4, 2, 7, 1, 3, 5, null],
  });

  // Empty tree, insert 5 → just [5]
  t.visible('empty-tree', {
    args: [[], 5],
    expected: [5],
  });

  t.visible('single-node-left', {
    args: [[5], 3],
    expected: [5, 3, null],
  });

  t.visible('single-node-right', {
    args: [[5], 7],
    expected: [5, null, 7],
  });

  // root=[40,20,60,10,30,50,70], val=25 → 25 goes right of 20's right child 30... actually left of 30
  t.hidden('example-2', {
    args: [[40, 20, 60, 10, 30, 50, 70], 25],
    expected: [40, 20, 60, 10, 30, 50, 70, null, null, 25, null],
  });

  t.hidden('insert-min', {
    args: [[10, 5, 15, 3, 7], 1],
    expected: [10, 5, 15, 3, 7, null, null, 1],
  });

  t.hidden('insert-max', {
    args: [[10, 5, 15, 3, 7], 20],
    expected: [10, 5, 15, 3, 7, null, 20],
  });

  t.hidden('insert-middle', {
    args: [[10, 5, 20], 8],
    expected: [10, 5, 20, null, 8],
  });
});
