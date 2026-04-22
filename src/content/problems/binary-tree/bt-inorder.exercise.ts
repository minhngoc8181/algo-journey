import { defineExercise } from '../../_loader';
import { TREE_NODE_HELPER, TREE_NODE_COMMENT } from './_helpers';

export default defineExercise({
  id: 'bt-inorder',
  version: 1,
  title: 'Binary Tree Inorder Traversal',
  summary: 'Return the inorder (Left-Root-Right) traversal of a binary tree.',
  topic: 'binary-tree',
  difficulty: 'easy',
  tags: ['binary-tree', 'traversal', 'dfs', 'cse202'],
  estimatedMinutes: 15,
  order: 702,
  mode: 'function_implementation',
  hints: [
    'Inorder: visit LEFT subtree first, then ROOT, then RIGHT subtree.',
    'Use recursion: call inorder(root.left), add root.val, call inorder(root.right).',
    'Use a `List<Integer>` to collect results and return it.',
  ],
  learningGoals: ['Inorder DFS traversal', 'Recursive tree walking', 'Result accumulation'],
  prerequisites: ['Binary tree basics'],

  statement: `Given the \`root\` of a binary tree, return the **inorder traversal** of its node values.

Inorder traversal visits nodes in the order: **Left Ã¢â€ â€™ Root Ã¢â€ â€™ Right**.

The \`TreeNode\` class is provided by the platform Ã¢â‚¬â€ do **not** re-declare it.`,

  constraints: [
    'The number of nodes is in the range [0, 10Ã¢ÂÂµ].',
    '-10Ã¢ÂÂµ Ã¢â€°Â¤ Node.val Ã¢â€°Â¤ 10Ã¢ÂÂµ',
  ],
  examples: [
    {
      input: 'root = [1, null, 2, null, null, 3]',
      output: '[1, 3, 2]',
      explanation: 'Visiting: left(null), 1, right(2) Ã¢â€ â€™ left(3), 2, right(null).',
    },
    { input: 'root = []', output: '[]' },
    { input: 'root = [1]', output: '[1]' },
    {
      input: 'root = [4, 2, 6, 1, 3, 5, 7]',
      output: '[1, 2, 3, 4, 5, 6, 7]',
      explanation: 'On a BST, inorder gives sorted order.',
    },
  ],

  starter: {
    file: 'Solution.java',
    code: `import java.util.*;
${TREE_NODE_COMMENT}
class Solution {
    List<Integer> inorder(TreeNode root) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
  },

  helperClasses: [TREE_NODE_HELPER],

  requiredStructure: {
    className: 'Solution',
    methodName: 'inorder',
    signature: 'List<Integer> inorder(TreeNode root)',
  },

  evaluation: {
    timeLimitMs: 2000,
    comparator: 'exact_json',
    javaGenerator: {
      count: 7,
      seed: 20260423,
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
            // Reference inorder (iterative)
            java.util.List<Integer> expected = new java.util.ArrayList<>();
            java.util.Deque<TreeNode> st = new java.util.ArrayDeque<>();
            TreeNode cur = nodes[0];
            while (cur != null || !st.isEmpty()) {
                while (cur != null) { st.push(cur); cur = cur.left; }
                cur = st.pop(); expected.add(cur.val); cur = cur.right;
            }
            try {
                java.util.List<Integer> actual = s.inorder(nodes[0]);
                boolean pass = java.util.Objects.equals(actual, expected);
                System.out.println("AJ|stress-" + i + "|" + pass + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }

        // Large-scale test 1: right-chain of 50,000 nodes Ã¢â€ â€™ inorder = [1,2,...,50000]
        {
            int N = 50_000;
            TreeNode chainRoot = new TreeNode(1);
            TreeNode cur = chainRoot;
            for (int k = 2; k <= N; k++) { cur.right = new TreeNode(k); cur = cur.right; }
            java.util.List<Integer> expected = new java.util.ArrayList<>();
            for (int k = 1; k <= N; k++) expected.add(k);
            try {
                java.util.List<Integer> actual = s.inorder(chainRoot);
                boolean pass = java.util.Objects.equals(actual, expected);
                System.out.println("AJ|large-right-chain-50k|" + (pass) + "|" + (String.valueOf(actual.size()) + " elements") + "|" + (String.valueOf(N) + " elements"));
            } catch (Exception e) { System.out.println("AJ_ERROR|large-right-chain-50k: " + (e)); }
        }

        // Large-scale test 2: complete binary tree H=16 (65,535 nodes) Ã¢â€ â€™ verify size and sorted-ness for BST
        {
            int H = 16;
            int total = (1 << H) - 1;
            TreeNode[] nodes = new TreeNode[total];
            for (int k = 0; k < total; k++) nodes[k] = new TreeNode(k + 1);
            for (int k = 0; k < total; k++) {
                if (2*k+1 < total) nodes[k].left  = nodes[2*k+1];
                if (2*k+2 < total) nodes[k].right = nodes[2*k+2];
            }
            // Reference inorder (iterative)
            java.util.List<Integer> expected = new java.util.ArrayList<>();
            java.util.Deque<TreeNode> st = new java.util.ArrayDeque<>();
            TreeNode cur = nodes[0];
            while (cur != null || !st.isEmpty()) {
                while (cur != null) { st.push(cur); cur = cur.left; }
                cur = st.pop(); expected.add(cur.val); cur = cur.right;
            }
            try {
                java.util.List<Integer> actual = s.inorder(nodes[0]);
                boolean pass = java.util.Objects.equals(actual, expected);
                System.out.println("AJ|large-complete-h16|" + (pass) + "|" + (String.valueOf(actual.size()) + " elements") + "|" + (String.valueOf(total) + " elements"));
            } catch (Exception e) { System.out.println("AJ_ERROR|large-complete-h16: " + (e)); }
        }`,
    },
  },
});
