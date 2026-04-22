import { defineExercise } from '../../_loader';
import { TREE_NODE_HELPER, TREE_NODE_COMMENT } from './_helpers';

export default defineExercise({
  id: 'bt-bst-insert',
  version: 1,
  title: 'BST Insert',
  summary: 'Insert a value into a Binary Search Tree (BST).',
  topic: 'binary-tree',
  difficulty: 'easy',
  tags: ['bst', 'recursion', 'cse202'],
  estimatedMinutes: 20,
  order: 720,
  mode: 'function_implementation',
  hints: [
    'If the tree is empty (root is null), the new node becomes the root.',
    'If val < root.val, insert into the LEFT subtree.',
    'If val > root.val, insert into the RIGHT subtree.',
    'Recurse until you find a null spot, then create a new TreeNode there.',
    'It is guaranteed that val does not already exist in the BST.',
  ],
  learningGoals: ['BST property: left < root < right', 'BST insertion algorithm', 'Recursive tree modification'],
  prerequisites: ['Binary tree basics', 'Inorder traversal'],

  statement: `Given the \`root\` of a Binary Search Tree (BST) and an integer \`val\`, insert \`val\` into the BST and return the **root** of the modified tree.

A BST guarantees that for every node: all values in its left subtree are **smaller**, all values in its right subtree are **larger**.

It is **guaranteed** that \`val\` does not exist in the original BST.

The answer is verified by the **inorder traversal** of the returned tree (must be sorted and contain \`val\`).

The \`TreeNode\` class is provided by the platform — do **not** re-declare it.`,

  constraints: [
    'The number of nodes before insertion is in [0, 10⁴].',
    '-10⁸ ≤ Node.val ≤ 10⁸',
    'val is guaranteed not to exist in the original BST.',
  ],
  examples: [
    {
      input: 'root = [4, 2, 7, 1, 3], val = 5',
      output: 'inorder = [1, 2, 3, 4, 5, 7]',
      explanation: '5 is inserted as the left child of 7.',
    },
    { input: 'root = [], val = 5', output: 'inorder = [5]', explanation: 'Inserting into empty tree.' },
  ],

  starter: {
    file: 'Solution.java',
    code: `import java.util.*;
${TREE_NODE_COMMENT}
class Solution {
    TreeNode insertIntoBST(TreeNode root, int val) {
        // Write your code here
        return null;
    }
}`,
  },

  helperClasses: [TREE_NODE_HELPER],

  requiredStructure: {
    className: 'Solution',
    methodName: 'insertIntoBST',
    signature: 'TreeNode insertIntoBST(TreeNode root, int val)',
  },

  evaluation: {
    timeLimitMs: 2000,
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20260431,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        int[] sizes = {0, 5, 15, 50, 200};
        for (int i = 0; i < 5; i++) {
            int n = sizes[i];
            java.util.Set<Integer> used = new java.util.HashSet<>();
            // Build reference BST iteratively
            TreeNode refRoot = null;
            for (int j = 0; j < n; j++) {
                int v;
                do { v = rng.nextInt(2001) - 1000; } while (used.contains(v));
                used.add(v);
                if (refRoot == null) { refRoot = new TreeNode(v); continue; }
                TreeNode cur = refRoot;
                while (true) {
                    if (v < cur.val) { if (cur.left  == null) { cur.left  = new TreeNode(v); break; } cur = cur.left; }
                    else             { if (cur.right == null) { cur.right = new TreeNode(v); break; } cur = cur.right;}
                }
            }
            // Pick val not in tree
            int val;
            do { val = rng.nextInt(2001) - 1000; } while (used.contains(val));
            // Build expected inorder (sorted values including val)
            java.util.List<Integer> expectedList = new java.util.ArrayList<>(used);
            expectedList.add(val);
            java.util.Collections.sort(expectedList);
            // Build student copy of tree
            TreeNode studentRoot = null;
            for (int v : expectedList) {
                if (v == val) continue;
                if (studentRoot == null) { studentRoot = new TreeNode(v); continue; }
                TreeNode cur = studentRoot;
                while (true) {
                    if (v < cur.val) { if (cur.left  == null) { cur.left  = new TreeNode(v); break; } cur = cur.left; }
                    else             { if (cur.right == null) { cur.right = new TreeNode(v); break; } cur = cur.right;}
                }
            }
            try {
                TreeNode built = s.insertIntoBST(studentRoot, val);
                java.util.List<Integer> actual = new java.util.ArrayList<>();
                java.util.Deque<TreeNode> st = new java.util.ArrayDeque<>();
                TreeNode cur = built;
                while (cur != null || !st.isEmpty()) {
                    while (cur != null) { st.push(cur); cur = cur.left; }
                    cur = st.pop(); actual.add(cur.val); cur = cur.right;
                }
                boolean pass = java.util.Objects.equals(actual, expectedList);
                System.out.println("AJ|stress-" + i + "|" + pass + "|" + actual + "|" + expectedList);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
