import java.util.*;

class Solution {
    int countOccurrences(int[] arr, int target) {
        int count = 0;
        for (int x : arr) {
            if (x == target) count++;
        }
        return count;
    }
}
