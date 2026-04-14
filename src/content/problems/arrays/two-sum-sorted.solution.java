import java.util.List;
import java.util.Arrays;

class Solution {
    List<Integer> twoSumSorted(List<Integer> numbers, int target) {
        int left = 0;
        int right = numbers.size() - 1;
        while (left < right) {
            int sum = numbers.get(left) + numbers.get(right);
            if (sum == target) {
                return Arrays.asList(left, right);
            } else if (sum < target) {
                left += 1;
            } else {
                right -= 1;
            }
        }
        return Arrays.asList(-1, -1);
    }
}
