import java.util.List;
import java.util.ArrayList;

class Solution {
    List<Integer> buildPrefixSum(List<Integer> numbers) {
        List<Integer> prefix = new ArrayList<>();
        prefix.add(0);
        int sum = 0;
        for (int i = 0; i < numbers.size(); i++) {
            sum += numbers.get(i);
            prefix.add(sum);
        }
        return prefix;
    }
}
