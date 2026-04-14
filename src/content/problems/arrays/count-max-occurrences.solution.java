import java.util.List;

class Solution {
    int countMaxOccurrences(int[] numbers) {
        int max = numbers[0];
        for (int i = 1; i < numbers.length; i += 1) {
            if (numbers[i] > max) {
                max = numbers[i];
            }
        }
        int count = 0;
        for (int i = 0; i < numbers.length; i += 1) {
            if (numbers[i] == max) {
                count += 1;
            }
        }
        return count;
    }
}
