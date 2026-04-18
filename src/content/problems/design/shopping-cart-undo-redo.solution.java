import java.util.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

class ShoppingCart {
    private Map<String, Integer> cart;
    private Stack<Map<String, Integer>> undoStack;
    private Stack<Map<String, Integer>> redoStack;

    public ShoppingCart() {
        cart = new HashMap<>();
        undoStack = new Stack<>();
        redoStack = new Stack<>();
    }
    
    private void saveState() {
        undoStack.push(new HashMap<>(cart));
        redoStack.clear();
    }
    
    public void addItem(String item, int quantity) {
        saveState();
        cart.put(item, cart.getOrDefault(item, 0) + quantity);
    }
    
    public void removeItem(String item, int quantity) {
        saveState();
        if (cart.containsKey(item)) {
            int currentQ = cart.get(item);
            if (currentQ <= quantity) {
                cart.remove(item);
            } else {
                cart.put(item, currentQ - quantity);
            }
        }
    }
    
    public void undo() {
        if (!undoStack.isEmpty()) {
            redoStack.push(cart);
            cart = undoStack.pop();
        }
    }
    
    public void redo() {
        if (!redoStack.isEmpty()) {
            undoStack.push(cart);
            cart = redoStack.pop();
        }
    }
    
    public int getCartTotalQuantity() {
        int total = 0;
        for (int q : cart.values()) {
            total += q;
        }
        return total;
    }
}
