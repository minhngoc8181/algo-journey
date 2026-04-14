import java.util.List;

class Solution {
    int averageOfElements(List<Integer> numbers) {
        int sum = 0;
        for (int i = 0; i < numbers.size(); i += 1) {
            sum += numbers.get(i);
        }
        return sum / numbers.size();
    }
}
