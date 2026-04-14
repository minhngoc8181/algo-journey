import java.util.Arrays;

class Solution {
    int[] sortDescending(int[] numbers) {
        int[] sorted = numbers.clone();
        Arrays.sort(sorted);
        // reverse
        int left = 0, right = sorted.length - 1;
        while (left < right) {
            int tmp = sorted[left];
            sorted[left++] = sorted[right];
            sorted[right--] = tmp;
        }
        return sorted;
    }
}
