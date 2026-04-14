import java.util.List;

class Solution {
    boolean containsValue(List<Integer> numbers, int target) {
        for (int i = 0; i < numbers.size(); i += 1) {
            if (numbers.get(i) == target) {
                return true;
            }
        }
        return false;
    }
}
