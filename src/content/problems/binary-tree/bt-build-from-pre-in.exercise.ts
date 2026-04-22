import { defineExercise } from '../../_loader';
import { TREE_NODE_HELPER, TREE_NODE_COMMENT } from './_helpers';

export default defineExercise({
  id: 'bt-build-from-pre-in',
  version: 1,
  title: 'Build Tree from Preorder and Inorder',
  summary: 'Reconstruct a binary tree given its preorder and inorder traversal sequences.',
  topic: 'binary-tree',
  difficulty: 'medium',
  tags: ['binary-tree', 'recursion', 'divide-and-conquer', 'cse202'],
  estimatedMinutes: 30,
  order: 710,
  mode: 'function_implementation',
  hints: [
    'The FIRST element of preorder is always the root.',
    'Find the root value in inorder — everything to its left is the left subtree, everything to its right is the right subtree.',
    'The size of the left subtree (from inorder split) tells you how many elements of preorder belong to the left subtree.',
    'Recurse: buildTree(preorder[1..leftSize], inorder[0..rootIdx-1]) for left, and similarly for right.',
    'Use a HashMap to look up root positions in inorder in O(1).',
  ],
  learningGoals: ['Tree reconstruction from traversals', 'Divide and conquer on trees', 'HashMap for index lookup'],
  prerequisites: ['Preorder traversal', 'Inorder traversal'],

  statement: `Given two integer arrays \`preorder\` and \`inorder\` where:
- \`preorder\` is the preorder traversal of a binary tree
- \`inorder\` is the inorder traversal of the same tree

Reconstruct and return the binary tree.

**Guarantee:** All values in the tree are unique.

The answer is verified by comparing the **inorder traversal** of your returned tree against the expected inorder sequence.

The \`TreeNode\` class is provided by the platform — do **not** re-declare it.`,

  constraints: [
    '1 ≤ preorder.length ≤ 3000',
    'preorder.length == inorder.length',
    '-3000 ≤ preorder[i], inorder[i] ≤ 3000',
    'All values are unique.',
    'preorder and inorder represent a valid binary tree.',
  ],
  examples: [
    {
      input: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]',
      output: 'inorder of result = [9, 3, 15, 20, 7]',
      explanation: 'Root is 3. Left subtree has one node (9). Right subtree has [20,15,7].',
    },
    {
      input: 'preorder = [1,2], inorder = [2,1]',
      output: 'inorder of result = [2, 1]',
    },
  ],

  starter: {
    file: 'Solution.java',
    code: `import java.util.*;
${TREE_NODE_COMMENT}
class Solution {
    TreeNode buildTree(int[] preorder, int[] inorder) {
        // Write your code here
        return null;
    }
}`,
  },

  helperClasses: [TREE_NODE_HELPER],

  requiredStructure: {
    className: 'Solution',
    methodName: 'buildTree',
    signature: 'TreeNode buildTree(int[] preorder, int[] inorder)',
  },

  evaluation: {
    timeLimitMs: 2000,
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20260430,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        int[] sizes = {5, 10, 20, 50, 100};
        for (int i = 0; i < 5; i++) {
            int n = sizes[i];
            // Build a random BST (guaranteed unique values, known inorder = sorted)
            int[] inorder = new int[n];
            for (int j = 0; j < n; j++) inorder[j] = j * 3 + rng.nextInt(3) - n;
            // Build BST by inserting in random order
            TreeNode bstRoot = null;
            java.util.List<Integer> insertOrder = new java.util.ArrayList<>();
            for (int v : inorder) insertOrder.add(v);
            java.util.Collections.shuffle(insertOrder, new java.util.Random(rng.nextLong()));
            for (int v : insertOrder) {
                if (bstRoot == null) { bstRoot = new TreeNode(v); continue; }
                TreeNode cur = bstRoot;
                while (true) {
                    if (v < cur.val) { if (cur.left == null) { cur.left = new TreeNode(v); break; } cur = cur.left; }
                    else             { if (cur.right==null)  { cur.right= new TreeNode(v); break; } cur = cur.right;}
                }
            }
            // Extract preorder from BST (iterative)
            java.util.List<Integer> preList = new java.util.ArrayList<>();
            java.util.Deque<TreeNode> st = new java.util.ArrayDeque<>();
            if (bstRoot != null) st.push(bstRoot);
            while (!st.isEmpty()) {
                TreeNode cur = st.pop(); preList.add(cur.val);
                if (cur.right != null) st.push(cur.right);
                if (cur.left  != null) st.push(cur.left);
            }
            int[] pre = new int[preList.size()];
            for (int j = 0; j < preList.size(); j++) pre[j] = preList.get(j);
            // Extract inorder from BST (expected)
            java.util.List<Integer> expected = new java.util.ArrayList<>();
            java.util.Deque<TreeNode> st2 = new java.util.ArrayDeque<>();
            TreeNode cur2 = bstRoot;
            while (cur2 != null || !st2.isEmpty()) {
                while (cur2 != null) { st2.push(cur2); cur2 = cur2.left; }
                cur2 = st2.pop(); expected.add(cur2.val); cur2 = cur2.right;
            }
            try {
                TreeNode built = s.buildTree(pre, inorder);
                // Check inorder of built tree
                java.util.List<Integer> actual = new java.util.ArrayList<>();
                java.util.Deque<TreeNode> st3 = new java.util.ArrayDeque<>();
                TreeNode c = built;
                while (c != null || !st3.isEmpty()) {
                    while (c != null) { st3.push(c); c = c.left; }
                    c = st3.pop(); actual.add(c.val); c = c.right;
                }
                boolean pass = java.util.Objects.equals(actual, expected);
                System.out.println("AJ|stress-" + i + "|" + pass + "|" + actual + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
