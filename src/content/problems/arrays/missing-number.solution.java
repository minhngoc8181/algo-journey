import java.util.List;

class Solution {
    int missingNumber(List<Integer> numbers) {
        int n = numbers.size();
        int expected = (n * (n + 1)) / 2;
        int actual = 0;
        for (int i = 0; i < numbers.size(); i += 1) {
            actual += numbers.get(i);
        }
        return expected - actual;
    }
}
