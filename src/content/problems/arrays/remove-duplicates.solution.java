import java.util.List;
import java.util.ArrayList;
import java.util.LinkedHashSet;

class Solution {
    List<Integer> removeDuplicates(int[] numbers) {
        LinkedHashSet<Integer> seen = new LinkedHashSet<>();
        for (int x : numbers) seen.add(x);
        return new ArrayList<>(seen);
    }
}
