import java.util.List;

class Solution {
    int longestConsecutiveRun(List<Integer> numbers) {
        if (numbers.isEmpty()) return 0;
        int best = 1;
        int current = 1;
        for (int i = 1; i < numbers.size(); i += 1) {
            if (numbers.get(i).equals(numbers.get(i - 1))) {
                current += 1;
                if (current > best) {
                    best = current;
                }
            } else {
                current = 1;
            }
        }
        return best;
    }
}
