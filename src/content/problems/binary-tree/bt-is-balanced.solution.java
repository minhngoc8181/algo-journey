import java.util.*;

class Solution {
    boolean isBalanced(TreeNode root) {
        // Iterative post-order: track height in a map, detect imbalance early
        if (root == null) return true;
        Deque<TreeNode> stack = new ArrayDeque<>();
        Map<TreeNode, Integer> heights = new HashMap<>();
        
        TreeNode curr = root;
        TreeNode lastVisited = null;
        
        while (!stack.isEmpty() || curr != null) {
            if (curr != null) {
                stack.push(curr);
                curr = curr.left;
            } else {
                TreeNode peekNode = stack.peek();
                if (peekNode.right != null && lastVisited != peekNode.right) {
                    curr = peekNode.right;
                } else {
                    stack.pop();
                    int leftH = heights.getOrDefault(peekNode.left, 0);
                    int rightH = heights.getOrDefault(peekNode.right, 0);
                    if (Math.abs(leftH - rightH) > 1) return false;
                    heights.put(peekNode, 1 + Math.max(leftH, rightH));
                    lastVisited = peekNode;
                }
            }
        }
        return true;
    }
}
