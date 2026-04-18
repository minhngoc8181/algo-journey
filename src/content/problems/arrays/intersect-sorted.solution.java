import java.util.*;

import java.util.List;
import java.util.ArrayList;

class Solution {
    List<Integer> intersectSorted(int[] left, int[] right) {
        List<Integer> result = new ArrayList<>();
        int i = 0;
        int j = 0;
        while (i < left.length && j < right.length) {
            if (left[i] == right[j]) {
                result.add(left[i]);
                i += 1;
                j += 1;
            } else if (left[i] < right[j]) {
                i += 1;
            } else {
                j += 1;
            }
        }
        return result;
    }
}
