import java.util.*;

import java.util.List;

class Solution {
    boolean containsValue(int[] numbers, int target) {
        for (int i = 0; i < numbers.length; i += 1) {
            if (numbers[i] == target) {
                return true;
            }
        }
        return false;
    }
}
