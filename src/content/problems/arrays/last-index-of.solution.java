class Solution {
    int lastIndexOfValue(int[] numbers, int target) {
        for (int i = numbers.length - 1; i >= 0; i -= 1) {
            if (numbers[i] == target) {
                return i;
            }
        }
        return -1;
    }
}
