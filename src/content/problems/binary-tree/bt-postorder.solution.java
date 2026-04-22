import java.util.*;

class Solution {
    List<Integer> postorder(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            result.add(node.val);
            if (node.left  != null) stack.push(node.left);
            if (node.right != null) stack.push(node.right);
        }
        Collections.reverse(result);
        return result;
    }
}
