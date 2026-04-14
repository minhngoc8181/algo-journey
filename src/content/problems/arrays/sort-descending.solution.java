import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

class Solution {
    List<Integer> sortDescending(List<Integer> numbers) {
        List<Integer> sorted = new ArrayList<>(numbers);
        Collections.sort(sorted, Collections.reverseOrder());
        return sorted;
    }
}
