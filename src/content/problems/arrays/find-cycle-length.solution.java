import java.util.*;

class Solution {
    int findCycleLength(int[] arr) {
        int slow = arr[0];
        int fast = arr[arr[0]];
        while (slow != fast) {
            slow = arr[slow];
            fast = arr[arr[fast]];
        }
        int length = 1;
        int current = arr[slow];
        while (current != slow) {
            current = arr[current];
            length += 1;
        }
        return length;
    }
}
