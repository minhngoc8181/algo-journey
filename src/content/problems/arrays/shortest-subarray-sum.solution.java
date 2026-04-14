import java.util.List;

class Solution {
    int shortestSubarraySum(List<Integer> numbers, int target) {
        int left = 0;
        int currentSum = 0;
        int minLen = numbers.size() + 1;
        for (int right = 0; right < numbers.size(); right += 1) {
            currentSum += numbers.get(right);
            while (currentSum >= target) {
                int windowLen = right - left + 1;
                if (windowLen < minLen) {
                    minLen = windowLen;
                }
                currentSum -= numbers.get(left);
                left += 1;
            }
        }
        if (minLen > numbers.size()) {
            return 0;
        }
        return minLen;
    }
}
