import java.util.Stack;

class CommandHistory {
    int value;
    Stack<int[]> undoStack;
    Stack<int[]> redoStack;

    public CommandHistory() {
        value = 0;
        undoStack = new Stack<>();
        redoStack = new Stack<>();
    }
    
    public void add(int amount) {
        undoStack.push(new int[]{1, amount}); // 1 for add
        value += amount;
        redoStack.clear();
    }
    
    public void subtract(int amount) {
        undoStack.push(new int[]{-1, amount}); // -1 for subtract
        value -= amount;
        redoStack.clear();
    }
    
    public void undo() {
        if (!undoStack.isEmpty()) {
            int[] op = undoStack.pop();
            if (op[0] == 1) {
                value -= op[1];
            } else {
                value += op[1];
            }
            redoStack.push(op);
        }
    }
    
    public void redo() {
        if (!redoStack.isEmpty()) {
            int[] op = redoStack.pop();
            if (op[0] == 1) {
                value += op[1];
            } else {
                value -= op[1];
            }
            undoStack.push(op);
        }
    }
    
    public int getValue() {
        return value;
    }
}
