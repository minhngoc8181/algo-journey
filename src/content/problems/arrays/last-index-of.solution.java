import java.util.List;

class Solution {
    int lastIndexOfValue(List<Integer> numbers, int target) {
        for (int i = numbers.size() - 1; i >= 0; i -= 1) {
            if (numbers.get(i) == target) {
                return i;
            }
        }
        return -1;
    }
}
