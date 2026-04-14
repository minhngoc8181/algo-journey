import java.util.List;

class Solution {
    int countMaxOccurrences(List<Integer> numbers) {
        int max = numbers.get(0);
        for (int i = 1; i < numbers.size(); i += 1) {
            if (numbers.get(i) > max) {
                max = numbers.get(i);
            }
        }
        int count = 0;
        for (int i = 0; i < numbers.size(); i += 1) {
            if (numbers.get(i) == max) {
                count += 1;
            }
        }
        return count;
    }
}
