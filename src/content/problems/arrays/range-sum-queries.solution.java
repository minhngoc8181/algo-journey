import java.util.List;
import java.util.ArrayList;

class Solution {
    List<Integer> rangeSumQueries(List<Integer> numbers, List<List<Integer>> queries) {
        List<Integer> prefix = new ArrayList<>();
        prefix.add(0);
        for (int i = 0; i < numbers.size(); i += 1) {
            prefix.add(prefix.get(i) + numbers.get(i));
        }
        
        List<Integer> results = new ArrayList<>();
        for (int q = 0; q < queries.size(); q += 1) {
            int l = queries.get(q).get(0);
            int r = queries.get(q).get(1);
            results.add(prefix.get(r + 1) - prefix.get(l));
        }
        return results;
    }
}
