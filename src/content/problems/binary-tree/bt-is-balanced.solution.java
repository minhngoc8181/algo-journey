import java.util.*;

class Solution {
    boolean isBalanced(TreeNode root) {
        return checkHeight(root) != -1;
    }

    // Returns actual height if balanced, -1 if unbalanced
    private int checkHeight(TreeNode node) {
        if (node == null) return 0;
        int left = checkHeight(node.left);
        if (left == -1) return -1;
        int right = checkHeight(node.right);
        if (right == -1) return -1;
        if (Math.abs(left - right) > 1) return -1;
        return 1 + Math.max(left, right);
    }
}
