import java.util.List;

class Solution {
    boolean isSortedAscending(List<Integer> numbers) {
        for (int i = 1; i < numbers.size(); i += 1) {
            if (numbers.get(i) < numbers.get(i - 1)) {
                return false;
            }
        }
        return true;
    }
}
