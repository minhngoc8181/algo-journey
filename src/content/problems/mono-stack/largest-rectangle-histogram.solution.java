class Solution {
    int largestRectangleArea(int[] heights) {
        int n = heights.length;
        int maxArea = 0;
        java.util.Deque<Integer> stack = new java.util.ArrayDeque<>();
        for (int i = 0; i <= n; i++) {
            int cur = (i == n) ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peek()] > cur) {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : (i - stack.peek() - 1);
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        return maxArea;
    }
}
