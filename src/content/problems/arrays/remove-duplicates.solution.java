import java.util.List;
import java.util.ArrayList;

class Solution {
    List<Integer> removeDuplicates(List<Integer> numbers) {
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < numbers.size(); i += 1) {
            if (!result.contains(numbers.get(i))) {
                result.add(numbers.get(i));
            }
        }
        return result;
    }
}
