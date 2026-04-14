import java.util.List;
import java.util.ArrayList;

class Solution {
    int[] buildPrefixSum(int[] numbers) {
        int[] prefix = new int[numbers.length + 1];
        prefix[0] = 0;
        int sum = 0;
        for (int i = 0; i < numbers.length; i++) {
            sum += numbers[i];
            prefix[i + 1] = sum;
        }
        return prefix;
    }
}
