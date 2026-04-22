import java.util.*;

class Solution {
    TreeNode insertIntoBST(TreeNode root, int val) {
        TreeNode newNode = new TreeNode(val);
        if (root == null) return newNode;
        TreeNode cur = root;
        while (true) {
            if (val < cur.val) {
                if (cur.left == null) { cur.left = newNode; break; }
                cur = cur.left;
            } else {
                if (cur.right == null) { cur.right = newNode; break; }
                cur = cur.right;
            }
        }
        return root;
    }
}
