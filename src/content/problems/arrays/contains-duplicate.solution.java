import java.util.*;

import java.util.HashSet;

class Solution {
    boolean containsDuplicate(int[] arr) {
        HashSet<Integer> seen = new HashSet<>();
        for (int x : arr) {
            if (!seen.add(x)) return true;
        }
        return false;
    }
}
