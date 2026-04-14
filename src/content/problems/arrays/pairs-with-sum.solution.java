import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;

class Solution {
    List<List<Integer>> pairsWithTargetSum(List<Integer> numbers, int target) {
        Set<String> seenGroups = new HashSet<>();
        List<List<Integer>> pairs = new ArrayList<>();
        
        for (int i = 0; i < numbers.size(); i++) {
            for (int j = i + 1; j < numbers.size(); j++) {
                if (numbers.get(i) + numbers.get(j) == target) {
                    int a = Math.min(numbers.get(i), numbers.get(j));
                    int b = Math.max(numbers.get(i), numbers.get(j));
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
