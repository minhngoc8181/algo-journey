import java.util.*;

class Solution { String[] fizzBuzz(int n) { String[] r = new String[n]; for (int i = 1; i <= n; i++) { if (i % 15 == 0) r[i-1] = "FizzBuzz"; else if (i % 3 == 0) r[i-1] = "Fizz"; else if (i % 5 == 0) r[i-1] = "Buzz"; else r[i-1] = String.valueOf(i); } return r; } }
