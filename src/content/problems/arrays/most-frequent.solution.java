import java.util.*;

import java.util.Map;
import java.util.HashMap;

class Solution {
    int mostFrequentValue(int[] numbers) {
        Map<Integer, Integer> counts = new HashMap<>();
        int bestValue = numbers[0];
        int bestCount = 0;
        for (int i = 0; i < numbers.length; i++) {
            int value = numbers[i];
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
