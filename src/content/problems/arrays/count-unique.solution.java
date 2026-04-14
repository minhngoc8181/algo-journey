import java.util.List;
import java.util.ArrayList;

class Solution {
    int countUniqueValues(List<Integer> numbers) {
        List<Integer> seen = new ArrayList<>();
        for (int i = 0; i < numbers.size(); i += 1) {
            if (!seen.contains(numbers.get(i))) {
                seen.add(numbers.get(i));
            }
        }
        return seen.size();
    }
}
