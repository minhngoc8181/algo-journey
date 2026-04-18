import java.util.*;

class Solution {
    int[] rotateArray(int[] numbers, int k, String direction) {
        int length = numbers.length;
        if (length == 0) return new int[0];
        int shift = ((k % length) + length) % length;
        if (shift == 0) return numbers.clone();

        int cutIndex = direction.equals("left") ? shift : length - shift;

        int[] result = new int[length];
        int idx = 0;
        for (int i = cutIndex; i < length; i++) result[idx++] = numbers[i];
        for (int i = 0; i < cutIndex; i++) result[idx++] = numbers[i];
        return result;
    }
}
