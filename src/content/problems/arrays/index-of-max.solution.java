import java.util.*;

class Solution {
    int indexOfMaxValue(int[] numbers) {
        int bestIndex = 0;
        for (int i = 1; i < numbers.length; i++) {
            if (numbers[i] > numbers[bestIndex]) {
                bestIndex = i;
            }
        }
        return bestIndex;
    }
}
