import java.util.TreeSet;

class Solution {
    Integer secondExtreme(int[] numbers, String mode) {
        TreeSet<Integer> unique = new TreeSet<>();
        for (int x : numbers) unique.add(x);
        if (unique.size() < 2) return null;
        if (mode.equals("largest")) return unique.lower(unique.last());
        else return unique.higher(unique.first());
    }
}
