class Solution {
    int sumSubarrayMins(int[] arr) {
        long MOD = 1000000007L;
        int n = arr.length;
        int[] left = new int[n];
        int[] right = new int[n];
        java.util.Deque<Integer> stack = new java.util.ArrayDeque<>();

        // Previous less element (strict <)
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) {
                stack.pop();
            }
            left[i] = stack.isEmpty() ? (i + 1) : (i - stack.peek());
            stack.push(i);
        }

        stack.clear();

        // Next less or equal element (<=)
        for (int i = n - 1; i >= 0; i--) {
            while (!stack.isEmpty() && arr[stack.peek()] > arr[i]) {
                stack.pop();
            }
            right[i] = stack.isEmpty() ? (n - i) : (stack.peek() - i);
            stack.push(i);
        }

        long result = 0;
        for (int i = 0; i < n; i++) {
            result = (result + (long) arr[i] * left[i] % MOD * right[i]) % MOD;
        }
        return (int) result;
    }
}
