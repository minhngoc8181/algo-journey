import java.util.*;

import java.util.List;
import java.util.ArrayList;

class Solution {
    List<Integer> allIndicesOfValue(int[] numbers, int target) {
        List<Integer> indices = new ArrayList<>();
        for (int i = 0; i < numbers.length; i += 1) {
            if (numbers[i] == target) {
                indices.add(i);
            }
        }
        return indices;
    }
}
