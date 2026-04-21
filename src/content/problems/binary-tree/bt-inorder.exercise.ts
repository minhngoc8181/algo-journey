import { defineExercise } from '../../_loader';
import { TREE_NODE_HELPER, TREE_NODE_COMMENT } from './_helpers';

export default defineExercise({
  id: 'bt-inorder',
  version: 1,
  title: 'Binary Tree Inorder Traversal',
  summary: 'Return the inorder (Left-Root-Right) traversal of a binary tree.',
  topic: 'binary-tree',
  difficulty: 'easy',
  tags: ['binary-tree', 'tree', 'recursion', 'traversal', 'dfs', 'cse202'],
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

Inorder traversal visits nodes in the order: **Left → Root → Right**.

The \`TreeNode\` class is provided by the platform — do **not** re-declare it.`,

  constraints: [
    'The number of nodes is in the range [0, 100].',
    '-100 ≤ Node.val ≤ 100',
  ],
  examples: [
    {
      input: 'root = [1, null, 2, null, null, 3]',
      output: '[1, 3, 2]',
      explanation: 'Visiting: left(null), 1, right(2) → left(3), 2, right(null).',
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
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
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
        }`,
    },
  },
});
