import java.util.List;
import java.util.Map;
import java.util.HashMap;

class Solution {
    int mostFrequentValue(List<Integer> numbers) {
        Map<Integer, Integer> counts = new HashMap<>();
        int bestValue = numbers.get(0);
        int bestCount = 0;
        for (int i = 0; i < numbers.size(); i += 1) {
            int value = numbers.get(i);
            int currentCount = counts.getOrDefault(value, 0) + 1;
            counts.put(value, currentCount);
            if (currentCount > bestCount || (currentCount == bestCount && value < bestValue)) {
                bestCount = currentCount;
                bestValue = value;
            }
        }
        return bestValue;
    }
}
