import { defineExercise } from '../../_loader';
import { TREE_NODE_HELPER, TREE_NODE_COMMENT } from './_helpers';

export default defineExercise({
  id: 'bt-height',
  version: 1,
  title: 'Binary Tree Height',
  summary: 'Compute the height (maximum depth) of a binary tree.',
  topic: 'binary-tree',
  difficulty: 'easy',
  tags: ['binary-tree', 'recursion', 'dfs', 'cse202'],
  estimatedMinutes: 15,
  order: 700,
  mode: 'function_implementation',
  hints: [
    'The height of an empty tree (null root) is 0.',
    'The height of a single node is 1.',
    'Use recursion: `height(node) = 1 + max(height(node.left), height(node.right))`.',
  ],
  learningGoals: ['Tree recursion', 'DFS post-order thinking', 'Base case handling'],
  prerequisites: ['Recursion basics'],

  statement: `Given the \`root\` of a binary tree, return its **height** Ã¢â‚¬â€ the number of nodes along the longest path from the root down to the farthest leaf.

Return \`0\` if the tree is empty.

The \`TreeNode\` class is provided by the platform Ã¢â‚¬â€ do **not** re-declare it.`,

  constraints: [
    'The number of nodes is in the range [0, 10Ã¢ÂÂ´].',
    '-10Ã¢ÂÂµ Ã¢â€°Â¤ Node.val Ã¢â€°Â¤ 10Ã¢ÂÂµ',
  ],
  examples: [
    {
      input: 'root = [3, 9, 20, null, null, 15, 7]',
      output: '3',
      explanation: 'Path 3Ã¢â€ â€™20Ã¢â€ â€™15 or 3Ã¢â€ â€™20Ã¢â€ â€™7 has 3 nodes.',
    },
    { input: 'root = [1, null, 2]', output: '2' },
    { input: 'root = []', output: '0', explanation: 'Empty tree has height 0.' },
  ],

  starter: {
    file: 'Solution.java',
    code: `${TREE_NODE_COMMENT}
class Solution {
    int height(TreeNode root) {
        // Write your code here
        return 0;
    }
}`,
  },

  helperClasses: [TREE_NODE_HELPER],

  requiredStructure: {
    className: 'Solution',
    methodName: 'height',
    signature: 'int height(TreeNode root)',
  },

  evaluation: {
    timeLimitMs: 2000,
    comparator: 'exact_json',
    javaGenerator: {
      count: 7,
      seed: 20260421,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        int[] depths = {5, 7, 9, 12, 15};
        for (int i = 0; i < 5; i++) {
            int maxD = depths[i] + rng.nextInt(3);
            int maxNodes = (1 << (maxD + 1)) - 1;
            TreeNode[] nodes = new TreeNode[maxNodes];
            nodes[0] = new TreeNode(rng.nextInt(201) - 100);
            for (int j = 1; j < maxNodes; j++) {
                int par = (j - 1) / 2;
                if (nodes[par] == null || rng.nextInt(4) == 0) continue;
                nodes[j] = new TreeNode(rng.nextInt(201) - 100);
                if (j % 2 == 1) nodes[par].left  = nodes[j];
                else            nodes[par].right = nodes[j];
            }
            // Reference height: iterative using a stack
            int expected = 0;
            java.util.Deque<TreeNode> stack = new java.util.ArrayDeque<>();
            java.util.Deque<Integer> depths2 = new java.util.ArrayDeque<>();
            if (nodes[0] != null) { stack.push(nodes[0]); depths2.push(1); }
            while (!stack.isEmpty()) {
                TreeNode cur = stack.pop();
                int d = depths2.pop();
                if (d > expected) expected = d;
                if (cur.left  != null) { stack.push(cur.left);  depths2.push(d + 1); }
                if (cur.right != null) { stack.push(cur.right); depths2.push(d + 1); }
            }
            try {
                int actual = s.height(nodes[0]);
                System.out.println("AJ|stress-" + i + "|" + (actual == expected) + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }

        // Large-scale test 1: right-skewed chain of 100,000 nodes Ã¢â€ â€™ height = 100,000
        {
            int N = 100_000;
            TreeNode chainRoot = new TreeNode(1);
            TreeNode cur = chainRoot;
            for (int k = 2; k <= N; k++) { cur.right = new TreeNode(k); cur = cur.right; }
            int expected = N;
            try {
                int actual = s.height(chainRoot);
                System.out.println("AJ|large-right-chain-100k|" + ((actual == expected)) + "|" + (String.valueOf(actual)) + "|" + (String.valueOf(expected)));
            } catch (Exception e) { System.out.println("AJ_ERROR|large-right-chain-100k: " + (e)); }
        }

        // Large-scale test 2: complete binary tree of height 17 (131,071 nodes)
        {
            int H = 17;
            int total = (1 << H) - 1; // 131,071 nodes
            TreeNode[] nodes = new TreeNode[total];
            for (int k = 0; k < total; k++) nodes[k] = new TreeNode(k + 1);
            for (int k = 0; k < total; k++) {
                if (2*k+1 < total) nodes[k].left  = nodes[2*k+1];
                if (2*k+2 < total) nodes[k].right = nodes[2*k+2];
            }
            int expected = H;
            try {
                int actual = s.height(nodes[0]);
                System.out.println("AJ|large-complete-h17|" + ((actual == expected)) + "|" + (String.valueOf(actual)) + "|" + (String.valueOf(expected)));
            } catch (Exception e) { System.out.println("AJ_ERROR|large-complete-h17: " + (e)); }
        }`,
    },
  },
});

