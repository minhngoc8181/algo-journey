import { defineExercise } from '../../_loader';
import { TREE_NODE_HELPER, TREE_NODE_COMMENT } from './_helpers';

export default defineExercise({
  id: 'bt-postorder',
  version: 1,
  title: 'Binary Tree Postorder Traversal',
  summary: 'Return the postorder (Left-Right-Root) traversal of a binary tree.',
  topic: 'binary-tree',
  difficulty: 'easy',
  tags: ['binary-tree', 'traversal', 'dfs', 'cse202'],
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
    'The number of nodes is in the range [0, 10⁵].',
    '-10⁵ ≤ Node.val ≤ 10⁵',
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
    timeLimitMs: 2000,
    comparator: 'exact_json',
    javaGenerator: {
      count: 7,
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
            // Reference postorder
            java.util.List<Integer> expected = new java.util.ArrayList<>();
            java.util.Deque<TreeNode> st = new java.util.ArrayDeque<>();
            if (nodes[0] != null) st.push(nodes[0]);
            while (!st.isEmpty()) {
                TreeNode cur = st.pop();
                expected.add(cur.val);
                if (cur.left  != null) st.push(cur.left);
                if (cur.right != null) st.push(cur.right);
            }
            java.util.Collections.reverse(expected);
            try {
                java.util.List<Integer> actual = s.postorder(nodes[0]);
                boolean pass = java.util.Objects.equals(actual, expected);
                System.out.println("AJ|stress-" + i + "|" + pass + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }

        // Large-scale test 1: left-chain of 50,000 nodes → postorder = [1, 2, ..., 50000]
        {
            int N = 50_000;
            TreeNode chainRoot = new TreeNode(N);
            TreeNode cur = chainRoot;
            for (int k = N - 1; k >= 1; k--) { cur.left = new TreeNode(k); cur = cur.left; }
            java.util.List<Integer> expected = new java.util.ArrayList<>();
            for (int k = 1; k <= N; k++) expected.add(k);
            try {
                java.util.List<Integer> actual = s.postorder(chainRoot);
                boolean pass = java.util.Objects.equals(actual, expected);
                System.out.println("AJ|large-left-chain-50k|" + (pass) + "|" + (String.valueOf(actual.size()) + " elements") + "|" + (String.valueOf(N) + " elements"));
            } catch (Exception e) { System.out.println("AJ_ERROR|large-left-chain-50k: " + (e)); }
        }

        // Large-scale test 2: complete binary tree H=16 (65,535 nodes)
        {
            int H = 16;
            int total = (1 << H) - 1;
            TreeNode[] nodes = new TreeNode[total];
            for (int k = 0; k < total; k++) nodes[k] = new TreeNode(k + 1);
            for (int k = 0; k < total; k++) {
                if (2*k+1 < total) nodes[k].left  = nodes[2*k+1];
                if (2*k+2 < total) nodes[k].right = nodes[2*k+2];
            }
            java.util.List<Integer> expected = new java.util.ArrayList<>();
            java.util.Deque<TreeNode> st = new java.util.ArrayDeque<>();
            st.push(nodes[0]);
            while (!st.isEmpty()) {
                TreeNode cur2 = st.pop(); expected.add(cur2.val);
                if (cur2.left  != null) st.push(cur2.left);
                if (cur2.right != null) st.push(cur2.right);
            }
            java.util.Collections.reverse(expected);
            try {
                java.util.List<Integer> actual = s.postorder(nodes[0]);
                boolean pass = java.util.Objects.equals(actual, expected);
                System.out.println("AJ|large-complete-h16|" + (pass) + "|" + (String.valueOf(actual.size()) + " elements") + "|" + (String.valueOf(total) + " elements"));
            } catch (Exception e) { System.out.println("AJ_ERROR|large-complete-h16: " + (e)); }
        }`,

    },
  },
});
