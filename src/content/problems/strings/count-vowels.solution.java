import java.util.*;

class Solution { int countVowels(String s) { int c = 0; for (char ch : s.toLowerCase().toCharArray()) if ("aeiou".indexOf(ch) >= 0) c++; return c; } }
