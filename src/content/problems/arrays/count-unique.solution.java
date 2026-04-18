import java.util.*;

import java.util.HashSet;

class Solution {
    int countUniqueValues(int[] numbers) {
        HashSet<Integer> seen = new HashSet<>();
        for (int i = 0; i < numbers.length; i += 1) {
            seen.add(numbers[i]);
        }
        return seen.size();
    }
}
