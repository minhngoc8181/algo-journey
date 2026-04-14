class Solution {
    int shortestSubarraySum(int[] numbers, int target) {
        int left = 0;
        int currentSum = 0;
        int minLen = numbers.length + 1;
        for (int right = 0; right < numbers.length; right++) {
            currentSum += numbers[right];
            while (currentSum >= target) {
                int windowLen = right - left + 1;
                if (windowLen < minLen) minLen = windowLen;
                currentSum -= numbers[left];
                left++;
            }
        }
        return minLen > numbers.length ? 0 : minLen;
    }
}
