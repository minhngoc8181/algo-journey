import java.util.*;

class Solution {
    String removeKDigits(String num, int k) {
        StringBuilder stack = new StringBuilder();
        for (int i = 0; i < num.length(); i++) {
            char c = num.charAt(i);
            while (k > 0 && stack.length() > 0 && stack.charAt(stack.length() - 1) > c) {
                stack.deleteCharAt(stack.length() - 1);
                k--;
            }
            stack.append(c);
        }
        // Remove remaining from end
        stack.setLength(stack.length() - k);
        // Strip leading zeros
        int start = 0;
        while (start < stack.length() - 1 && stack.charAt(start) == '0') {
            start++;
        }
        String result = stack.substring(start);
        return result.isEmpty() ? "0" : result;
    }
}
