import java.util.List;

class Solution {
    int indexOfMaxValue(List<Integer> numbers) {
        int bestIndex = 0;
        for (int i = 1; i < numbers.size(); i++) {
            if (numbers.get(i) > numbers.get(bestIndex)) {
                bestIndex = i;
            }
        }
        return bestIndex;
    }
}
