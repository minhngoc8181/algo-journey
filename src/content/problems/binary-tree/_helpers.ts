/* ═══════════════════════════════════════════════════════════
   Binary Tree Helpers — Platform-provided TreeNode class
   and shared constants for binary-tree exercises.
   ═══════════════════════════════════════════════════════════ */

import type { HelperClass } from '../../../shared/types';

// ── TreeNode.java source code (injected at compile time) ──

export const TREE_NODE_JAVA = `public class TreeNode {
    public int val;
    public TreeNode left;
    public TreeNode right;
    public TreeNode() {}
    public TreeNode(int val) { this.val = val; }
    public TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
`;

// ── Helper class definition for exercise configs ──

export const TREE_NODE_HELPER: HelperClass = {
  fileName: 'TreeNode.java',
  code: TREE_NODE_JAVA,
};

// ── Starter code comment block (students see this) ──

export const TREE_NODE_COMMENT = `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val; this.left = left; this.right = right;
 *     }
 * }
 */`;

// ── JS-side helpers for test generators ──

/** Build a perfect binary tree from level-order array (null = missing node) */
export function buildTree(arr: (number | null)[]): (number | null)[] {
  return arr;
}

/** Inorder traversal of level-order array (returns sorted values for BST) */
export function inorderFromArray(arr: (number | null)[]): number[] {
  const result: number[] = [];
  function go(i: number) {
    if (i >= arr.length || arr[i] === null) return;
    go(2 * i + 1);
    result.push(arr[i] as number);
    go(2 * i + 2);
  }
  go(0);
  return result;
}

/** Height of binary tree from level-order array */
export function heightFromArray(arr: (number | null)[]): number {
  function go(i: number): number {
    if (i >= arr.length || arr[i] === null) return 0;
    return 1 + Math.max(go(2 * i + 1), go(2 * i + 2));
  }
  return go(0);
}
