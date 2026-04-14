import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

class Solution {
    Integer secondExtreme(List<Integer> numbers, String mode) {
        List<Integer> unique = new ArrayList<>();
        for (int i = 0; i < numbers.size(); i += 1) {
            if (!unique.contains(numbers.get(i))) {
                unique.add(numbers.get(i));
            }
        }
        Collections.sort(unique);
        if (unique.size() < 2) {
            return null;
        }
        if (mode.equals("largest")) {
            return unique.get(unique.size() - 2);
        } else {
            return unique.get(1);
        }
    }
}
