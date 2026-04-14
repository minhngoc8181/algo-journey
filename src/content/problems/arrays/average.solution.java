import java.util.List;

class Solution {
    int averageOfElements(int[] numbers) {
        int sum = 0;
        for (int i = 0; i < numbers.length; i += 1) {
            sum += numbers[i];
        }
        return sum / numbers.length;
    }
}
