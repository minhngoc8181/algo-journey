import java.util.*;

class Solution { boolean isPowerOfTwo(int n) { return n > 0 && (n & (n - 1)) == 0; } }
