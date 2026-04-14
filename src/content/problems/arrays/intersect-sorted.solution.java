import java.util.List;
import java.util.ArrayList;

class Solution {
    List<Integer> intersectSorted(List<Integer> left, List<Integer> right) {
        List<Integer> result = new ArrayList<>();
        int i = 0;
        int j = 0;
        while (i < left.size() && j < right.size()) {
            if (left.get(i).equals(right.get(j))) {
                result.add(left.get(i));
                i += 1;
                j += 1;
            } else if (left.get(i) < right.get(j)) {
                i += 1;
            } else {
                j += 1;
            }
        }
        return result;
    }
}
