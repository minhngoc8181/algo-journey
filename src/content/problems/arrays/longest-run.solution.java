class Solution {
    int longestConsecutiveRun(int[] numbers) {
        if (numbers.length == 0) return 0;
        int best = 1;
        int current = 1;
        for (int i = 1; i < numbers.length; i++) {
            if (numbers[i] == numbers[i - 1]) {
                current++;
                if (current > best) best = current;
            } else {
                current = 1;
            }
        }
        return best;
    }
}
