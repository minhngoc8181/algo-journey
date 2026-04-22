import { defineExercise } from '../../_loader';
import { TREE_NODE_HELPER, TREE_NODE_COMMENT } from './_helpers';

export default defineExercise({
  id: 'bt-is-balanced',
  version: 1,
  title: 'Balanced Binary Tree',
  summary: 'Check if a binary tree is height-balanced.',
  topic: 'binary-tree',
  difficulty: 'easy',
  tags: ['binary-tree', 'recursion', 'dfs', 'cse202'],
  estimatedMinutes: 20,
  order: 701,
  mode: 'function_implementation',
  hints: [
    'A tree is balanced if: left subtree is balanced, right subtree is balanced, AND |height(left) - height(right)| Ã¢â€°Â¤ 1.',
    'Write a helper `int checkHeight(TreeNode node)` that returns the actual height if balanced, or -1 if not.',
    'If `checkHeight` returns -1 for either child, propagate -1 upward immediately.',
  ],
  learningGoals: ['Tree balance condition', 'Recursive helper with sentinel value', 'Bottom-up DFS'],
  prerequisites: ['Binary tree height'],

  statement: `Given the \`root\` of a binary tree, return \`true\` if it is **height-balanced**.

A binary tree is height-balanced if for **every node** in the tree, the height of its left and right subtrees differs by at most 1.

The \`TreeNode\` class is provided by the platform Ã¢â‚¬â€ do **not** re-declare it.`,

  constraints: [
    'The number of nodes is in the range [0, 10Ã¢ÂÂµ].',
    '-10Ã¢ÂÂ´ Ã¢â€°Â¤ Node.val Ã¢â€°Â¤ 10Ã¢ÂÂ´',
  ],
  examples: [
    {
      input: 'root = [3, 9, 20, null, null, 15, 7]',
      output: 'true',
    },
    {
      input: 'root = [1, 2, 2, 3, 3, null, null, 4, 4]',
      output: 'false',
      explanation: 'The left subtree of the root has height 3, right has height 1.',
    },
    { input: 'root = []', output: 'true', explanation: 'An empty tree is balanced.' },
  ],

  starter: {
    file: 'Solution.java',
    code: `${TREE_NODE_COMMENT}
class Solution {
    boolean isBalanced(TreeNode root) {
        // Write your code here
        return false;
    }
}`,
  },

  helperClasses: [TREE_NODE_HELPER],

  requiredStructure: {
    className: 'Solution',
    methodName: 'isBalanced',
    signature: 'boolean isBalanced(TreeNode root)',
  },

  evaluation: {
    timeLimitMs: 2000,
    comparator: 'exact_json',
    javaGenerator: {
      count: 7,
      seed: 20260422,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        // Reference balance check: iterative post-order using two stacks
        // Returns -1 if unbalanced, else height
        for (int i = 0; i < 5; i++) {
            int maxD = 4 + i * 2;
            int maxNodes = (1 << (maxD + 1)) - 1;
            TreeNode[] nodes = new TreeNode[maxNodes];
            nodes[0] = new TreeNode(rng.nextInt(201) - 100);
            for (int j = 1; j < maxNodes; j++) {
                int par = (j - 1) / 2;
                if (nodes[par] == null) continue;
                boolean add = (i % 2 == 0) ? rng.nextInt(3) > 0 : rng.nextInt(2) == 0;
                if (add) nodes[j] = new TreeNode(rng.nextInt(201) - 100);
                if (j % 2 == 1) nodes[par].left  = nodes[j];
                else            nodes[par].right = nodes[j];
            }
            // Iterative height check via DFS
            java.util.Deque<TreeNode> stk = new java.util.ArrayDeque<>();
            java.util.Map<TreeNode, Integer> hmap = new java.util.HashMap<>();
            if (nodes[0] != null) stk.push(nodes[0]);
            boolean balanced = true;
            while (!stk.isEmpty() && balanced) {
                TreeNode cur = stk.peek();
                int lh = (cur.left  == null) ? 0 : hmap.getOrDefault(cur.left,  -999);
                int rh = (cur.right == null) ? 0 : hmap.getOrDefault(cur.right, -999);
                boolean lDone = (cur.left  == null) || hmap.containsKey(cur.left);
                boolean rDone = (cur.right == null) || hmap.containsKey(cur.right);
                if (lDone && rDone) {
                    stk.pop();
                    if (lh < 0 || rh < 0 || Math.abs(lh - rh) > 1) { balanced = false; break; }
                    hmap.put(cur, 1 + Math.max(lh, rh));
                } else {
                    if (!rDone) stk.push(cur.right);
                    if (!lDone) stk.push(cur.left);
                }
            }
            boolean expected = balanced;
            try {
                boolean actual = s.isBalanced(nodes[0]);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }

        // Large-scale test 1: right-chain of 50,000 nodes Ã¢â€ â€™ deeply unbalanced Ã¢â€ â€™ expected false
        // This catches O(nÃ‚Â²) naive solutions (which call height() at every node)
        {
            int N = 50_000;
            TreeNode chainRoot = new TreeNode(1);
            TreeNode cur = chainRoot;
            for (int k = 2; k <= N; k++) { cur.right = new TreeNode(k); cur = cur.right; }
            boolean expected = false;
            try {
                boolean actual = s.isBalanced(chainRoot);
                System.out.println("AJ|large-right-chain-50k|" + ((actual == expected)) + "|" + (String.valueOf(actual)) + "|" + (String.valueOf(expected)));
            } catch (Exception e) { System.out.println("AJ_ERROR|large-right-chain-50k: " + (e)); }
        }

        // Large-scale test 2: complete binary tree H=17 (131,071 nodes) Ã¢â€ â€™ perfectly balanced Ã¢â€ â€™ expected true
        {
            int H = 17;
            int total = (1 << H) - 1;
            TreeNode[] nodes = new TreeNode[total];
            for (int k = 0; k < total; k++) nodes[k] = new TreeNode(k + 1);
            for (int k = 0; k < total; k++) {
                if (2*k+1 < total) nodes[k].left  = nodes[2*k+1];
                if (2*k+2 < total) nodes[k].right = nodes[2*k+2];
            }
            boolean expected = true;
            try {
                boolean actual = s.isBalanced(nodes[0]);
                System.out.println("AJ|large-complete-h17|" + ((actual == expected)) + "|" + (String.valueOf(actual)) + "|" + (String.valueOf(expected)));
            } catch (Exception e) { System.out.println("AJ_ERROR|large-complete-h17: " + (e)); }
        }`,
    },
  },
});

