import java.util.*;

class Solution {
    int getNth(ListNode head, int n) {
        if (n < 0) return -1;
        ListNode current = head;
        int index = 0;
        while (current != null) {
            if (index == n) {
                return current.val;
            }
            current = current.next;
            index++;
        }
        return -1;
    }
}
