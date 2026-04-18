import java.util.*;

import java.util.ArrayList;

class FrontMiddleBackQueue {

    private ArrayList<Integer> list;

    public FrontMiddleBackQueue() {
        list = new ArrayList<>();
    }
    
    public void pushFront(int val) {
        list.add(0, val);
    }
    
    public void pushMiddle(int val) {
        list.add(list.size() / 2, val);
    }
    
    public void pushBack(int val) {
        list.add(val);
    }
    
    public int popFront() {
        if (list.isEmpty()) return -1;
        return list.remove(0);
    }
    
    public int popMiddle() {
        if (list.isEmpty()) return -1;
        return list.remove((list.size() - 1) / 2);
    }
    
    public int popBack() {
        if (list.isEmpty()) return -1;
        return list.remove(list.size() - 1);
    }
}
