import { defineExercise } from '../../_loader';
import { TREE_NODE_HELPER, TREE_NODE_COMMENT } from './_helpers';

export default defineExercise({
  id: 'bt-bst-from-inorder',
  version: 1,
  title: 'Build BST from Sorted Array',
  summary: 'Construct a height-balanced BST from a sorted (inorder) integer array.',
  topic: 'binary-tree',
  difficulty: 'medium',
  tags: ['binary-tree', 'tree', 'bst', 'divide-and-conquer', 'recursion', 'cse202'],
  estimatedMinutes: 25,
  order: 725,
  mode: 'function_implementation',
  hints: [
    'A sorted array is the inorder traversal of a BST.',
    'Pick the MIDDLE element as the root — this keeps the tree balanced.',
    'Left subtree comes from the left half of the array, right subtree from the right half.',
    'Base case: if the subarray is empty, return null.',
  ],
  learningGoals: ['Balanced BST construction', 'Divide and conquer', 'BST from inorder'],
  prerequisites: ['BST insert', 'Inorder traversal'],

  statement: `Given an integer array \`nums\` sorted in **ascending order**, construct a **height-balanced** BST and return its root.

A height-balanced BST is one where the depth of the two subtrees of any node differs by at most 1.

The answer is verified by:
1. **Inorder traversal** of the result must equal \`nums\`
2. The tree must be **height-balanced**

The \`TreeNode\` class is provided by the platform — do **not** re-declare it.`,

  constraints: [
    '1 ≤ nums.length ≤ 10⁴',
    '-10⁴ ≤ nums[i] ≤ 10⁴',
    'nums is sorted in strictly ascending order.',
  ],
  examples: [
    {
      input: 'nums = [-10, -3, 0, 5, 9]',
      output: 'inorder = [-10, -3, 0, 5, 9], balanced = true',
      explanation: 'Root=0, left=[-10,-3], right=[5,9].',
    },
    { input: 'nums = [1, 3]', output: 'inorder = [1, 3], balanced = true' },
  ],

  starter: {
    file: 'Solution.java',
    code: `${TREE_NODE_COMMENT}
class Solution {
    TreeNode sortedArrayToBST(int[] nums) {
        // Write your code here
        return null;
    }
}`,
  },

  helperClasses: [TREE_NODE_HELPER],

  requiredStructure: {
    className: 'Solution',
    methodName: 'sortedArrayToBST',
    signature: 'TreeNode sortedArrayToBST(int[] nums)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20260435,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        int[] sizeArr = {1, 7, 15, 100, 500};
        for (int i = 0; i < 5; i++) {
            int n = sizeArr[i];
            int[] nums = new int[n];
            int start = rng.nextInt(1001) - 500;
            for (int j = 0; j < n; j++) nums[j] = start + j * (1 + rng.nextInt(3));
            // Expected inorder = nums itself
            java.util.List<Integer> expected = new java.util.ArrayList<>();
            for (int v : nums) expected.add(v);
            try {
                TreeNode built = s.sortedArrayToBST(nums);
                // Inorder traversal
                java.util.List<Integer> inorder = new java.util.ArrayList<>();
                java.util.Deque<TreeNode> st = new java.util.ArrayDeque<>();
                TreeNode cur = built;
                while (cur != null || !st.isEmpty()) {
                    while (cur != null) { st.push(cur); cur = cur.left; }
                    cur = st.pop(); inorder.add(cur.val); cur = cur.right;
                }
                // Balance check (iterative)
                java.util.Map<TreeNode, Integer> hmap2 = new java.util.HashMap<>();
                java.util.Deque<TreeNode> stk2 = new java.util.ArrayDeque<>();
                boolean balanced = true;
                if (built != null) stk2.push(built);
                while (!stk2.isEmpty() && balanced) {
                    TreeNode node = stk2.peek();
                    int lh = (node.left  == null) ? 0 : hmap2.getOrDefault(node.left,  -999);
                    int rh = (node.right == null) ? 0 : hmap2.getOrDefault(node.right, -999);
                    boolean lD = (node.left  == null) || hmap2.containsKey(node.left);
                    boolean rD = (node.right == null) || hmap2.containsKey(node.right);
                    if (lD && rD) {
                        stk2.pop();
                        if (lh < 0 || rh < 0 || Math.abs(lh - rh) > 1) { balanced = false; break; }
                        hmap2.put(node, 1 + Math.max(lh, rh));
                    } else {
                        if (!rD) stk2.push(node.right);
                        if (!lD) stk2.push(node.left);
                    }
                }
                boolean pass = java.util.Objects.equals(inorder, expected) && balanced;
                System.out.println("AJ|stress-" + i + "|" + pass + "|inorder=" + inorder + ",bal=" + balanced + "|" + expected);
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
