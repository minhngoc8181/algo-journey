import java.util.*;

class Solution {
    int missingNumber(int[] numbers) {
        int n = numbers.length;
        int expected = (n * (n + 1)) / 2;
        int actual = 0;
        for (int i = 0; i < numbers.length; i++) {
            actual += numbers[i];
        }
        return expected - actual;
    }
}
