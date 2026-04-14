class Solution {
    int maxSumSubarrayK(int[] numbers, int k) {
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += numbers[i];
        }
        int maxSum = windowSum;
        for (int i = k; i < numbers.length; i++) {
            windowSum += numbers[i] - numbers[i - k];
            if (windowSum > maxSum) maxSum = windowSum;
        }
        return maxSum;
    }
}
