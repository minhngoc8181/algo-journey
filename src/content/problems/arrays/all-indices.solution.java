import java.util.List;
import java.util.ArrayList;

class Solution {
    List<Integer> allIndicesOfValue(List<Integer> numbers, int target) {
        List<Integer> indices = new ArrayList<>();
        for (int i = 0; i < numbers.size(); i += 1) {
            if (numbers.get(i) == target) {
                indices.add(i);
            }
        }
        return indices;
    }
}
