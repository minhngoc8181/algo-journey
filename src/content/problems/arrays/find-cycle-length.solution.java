import java.util.List;

class Solution {
    int findCycleLength(List<Integer> arr) {
        int slow = arr.get(0);
        int fast = arr.get(arr.get(0));
        while (slow != fast) {
            slow = arr.get(slow);
            fast = arr.get(arr.get(fast));
        }
        int length = 1;
        int current = arr.get(slow);
        while (current != slow) {
            current = arr.get(current);
            length += 1;
        }
        return length;
    }
}
