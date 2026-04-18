import java.util.*;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeSet;

class NumberContainers {
    private Map<Integer, Integer> indexToNumber;
    private Map<Integer, TreeSet<Integer>> numberToIndices;

    public NumberContainers() {
        indexToNumber = new HashMap<>();
        numberToIndices = new HashMap<>();
    }
    
    public void change(int index, int number) {
        if (indexToNumber.containsKey(index)) {
            int oldNum = indexToNumber.get(index);
            if (oldNum == number) return;
            TreeSet<Integer> indices = numberToIndices.get(oldNum);
            indices.remove(index);
        }
        indexToNumber.put(index, number);
        numberToIndices.computeIfAbsent(number, k -> new TreeSet<>()).add(index);
    }
    
    public int find(int number) {
        TreeSet<Integer> indices = numberToIndices.get(number);
        if (indices == null || indices.isEmpty()) {
            return -1;
        }
        return indices.first();
    }
}
