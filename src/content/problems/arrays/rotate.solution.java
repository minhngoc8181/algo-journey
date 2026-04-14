import java.util.List;
import java.util.ArrayList;

class Solution {
    List<Integer> rotateArray(List<Integer> numbers, int k, String direction) {
        int length = numbers.size();
        if (length == 0) return new ArrayList<>();
        int shift = ((k % length) + length) % length;
        if (shift == 0) {
            return new ArrayList<>(numbers);
        }
        
        int cutIndex = 0;
        if (direction.equals("left")) {
            cutIndex = shift;
        } else {
            cutIndex = length - shift;
        }
        
        List<Integer> result = new ArrayList<>();
        for (int i = cutIndex; i < length; i++) {
            result.add(numbers.get(i));
        }
        for (int i = 0; i < cutIndex; i++) {
            result.add(numbers.get(i));
        }
        
        return result;
    }
}
