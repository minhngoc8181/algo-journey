import java.util.List;

class Solution {
    int maxSumSubarrayK(List<Integer> numbers, int k) {
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += numbers.get(i);
        }
        int maxSum = windowSum;
        for (int i = k; i < numbers.size(); i++) {
            windowSum += numbers.get(i) - numbers.get(i - k);
            if (windowSum > maxSum) {
                maxSum = windowSum;
            }
        }
        return maxSum;
    }
}
