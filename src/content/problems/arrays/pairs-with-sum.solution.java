import java.util.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;

class Solution {
    List<List<Integer>> pairsWithTargetSum(int[] numbers, int target) {
        Set<String> seenGroups = new HashSet<>();
        List<List<Integer>> pairs = new ArrayList<>();
        for (int i = 0; i < numbers.length; i++) {
            for (int j = i + 1; j < numbers.length; j++) {
                if (numbers[i] + numbers[j] == target) {
                    int a = Math.min(numbers[i], numbers[j]);
                    int b = Math.max(numbers[i], numbers[j]);
                    String key = a + ":" + b;
                    if (!seenGroups.contains(key)) {
                        seenGroups.add(key);
                        List<Integer> pair = new ArrayList<>();
                        pair.add(a);
                        pair.add(b);
                        pairs.add(pair);
                    }
                }
            }
        }
        return pairs;
    }
}
