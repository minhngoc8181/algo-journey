import { defineExercise } from '../../_loader';
import { TREE_NODE_HELPER, TREE_NODE_COMMENT } from './_helpers';

export default defineExercise({
  id: 'bt-postorder',
  version: 1,
  title: 'Binary Tree Postorder Traversal',
  summary: 'Return the postorder (Left-Right-Root) traversal of a binary tree.',
  topic: 'binary-tree',
  difficulty: 'easy',
  tags: ['binary-tree', 'tree', 'recursion', 'traversal', 'dfs', 'cse202'],
  estimatedMinutes: 12,
  order: 704,
  mode: 'function_implementation',
  hints: [
    'Postorder: visit LEFT subtree, then RIGHT subtree, then ROOT last.',
    'Add root.val to the result list AFTER recursing into both children.',
    'Useful for deleting trees (process children before parent).',
  ],
  learningGoals: ['Postorder DFS traversal', 'Bottom-up tree processing'],
  prerequisites: ['Preorder traversal'],

  statement: `Given the \`root\` of a binary tree, return the **postorder traversal** of its node values.

Postorder traversal visits nodes in the order: **Left → Right → Root**.

The \`TreeNode\` class is provided by the platform — do **not** re-declare it.`,

  constraints: [
    'The number of nodes is in the range [0, 100].',
    '-100 ≤ Node.val ≤ 100',
  ],
  examples: [
    {
      input: 'root = [1, null, 2, null, null, 3]',
      output: '[3, 2, 1]',
      explanation: 'Left subtree of 2 → 3; then node 2; then root 1.',
    },
    { input: 'root = []', output: '[]' },
    {
      input: 'root = [4, 2, 6, 1, 3, 5, 7]',
      output: '[1, 3, 2, 5, 7, 6, 4]',
    },
  ],

  starter: {
    file: 'Solution.java',
    code: `import java.util.*;
${TREE_NODE_COMMENT}
class Solution {
    List<Integer> postorder(TreeNode root) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
  },

  helperClasses: [TREE_NODE_HELPER],

  requiredStructure: {
    className: 'Solution',
    methodName: 'postorder',
    signature: 'List<Integer> postorder(TreeNode root)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20260425,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        int[] sizes = {10, 25, 50, 75, 100};
        for (int i = 0; i < 5; i++) {
            int n = sizes[i];
            TreeNode[] nodes = new TreeNode[n * 2];
            nodes[0] = new TreeNode(rng.nextInt(201) - 100);
            for (int j = 1; j < n; j++) {
                nodes[j] = new TreeNode(rng.nextInt(201) - 100);
                int par = (j - 1) / 2;
                if (j % 2 == 1) nodes[par].left  = nodes[j];
                else            nodes[par].right = nodes[j];
            }
            // Reference postorder: push in reverse preorder, reverse at end
            java.util.List<Integer> expected = new java.util.ArrayList<>();
            java.util.Deque<TreeNode> st = new java.util.ArrayDeque<>();
            if (nodes[0] != null) st.push(nodes[0]);
            while (!st.isEmpty()) {
                TreeNode cur = st.pop();
                expected.add(0, cur.val);
                if (cur.left  != null) st.push(cur.left);
                if (cur.right != null) st.push(cur.right);
            }
            try {
                java.util.List<Integer> actual = s.postorder(nodes[0]);
                boolean pass = java.util.Objects.equals(actual, expected);
                System.out.println("AJ|stress-" + i + "|" + pass + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,

    },
  },
});
