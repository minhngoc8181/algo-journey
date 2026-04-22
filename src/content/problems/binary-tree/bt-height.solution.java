import java.util.*;

class Solution {
    int height(TreeNode root) {
        if (root == null) return 0;
        int maxH = 0;
        Deque<TreeNode> stack  = new ArrayDeque<>();
        Deque<Integer>  depths = new ArrayDeque<>();
        stack.push(root); depths.push(1);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            int d = depths.pop();
            if (d > maxH) maxH = d;
            if (node.right != null) { stack.push(node.right); depths.push(d + 1); }
            if (node.left  != null) { stack.push(node.left);  depths.push(d + 1); }
        }
        return maxH;
    }
}
