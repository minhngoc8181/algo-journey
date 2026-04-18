import java.util.*;

class Solution { int gcd(int a, int b) { while (b != 0) { int t = b; b = a % b; a = t; } return a; } }
