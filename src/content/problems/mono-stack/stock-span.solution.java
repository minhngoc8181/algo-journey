import java.util.*;

class Solution {
    int[] stockSpan(int[] prices) {
        int n = prices.length;
        int[] result = new int[n];
        java.util.Deque<Integer> stack = new java.util.ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && prices[stack.peek()] <= prices[i]) {
                stack.pop();
            }
            result[i] = stack.isEmpty() ? (i + 1) : (i - stack.peek());
            stack.push(i);
        }
        return result;
    }
}
