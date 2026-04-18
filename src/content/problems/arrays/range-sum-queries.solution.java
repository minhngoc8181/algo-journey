import java.util.*;

import java.util.List;
import java.util.ArrayList;

class Solution {
    List<Integer> rangeSumQueries(int[] numbers, int[][] queries) {
        int[] prefix = new int[numbers.length + 1];
        for (int i = 0; i < numbers.length; i++) {
            prefix[i + 1] = prefix[i] + numbers[i];
        }
        List<Integer> results = new ArrayList<>();
        for (int q = 0; q < queries.length; q++) {
            int l = queries[q][0];
            int r = queries[q][1];
            results.add(prefix[r + 1] - prefix[l]);
        }
        return results;
    }
}
