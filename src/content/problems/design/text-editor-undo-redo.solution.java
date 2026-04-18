import java.util.*;

import java.util.Stack;

class TextEditor {
    private StringBuilder text;
    private Stack<String> undoStack;
    private Stack<String> redoStack;

    public TextEditor() {
        text = new StringBuilder();
        undoStack = new Stack<>();
        redoStack = new Stack<>();
    }
    
    private void saveState() {
        undoStack.push(text.toString());
        redoStack.clear();
    }

    public void addText(String str) {
        saveState();
        text.append(str);
    }
    
    public void deleteText(int k) {
        saveState();
        int end = text.length();
        int start = Math.max(0, end - k);
        text.delete(start, end);
    }
    
    public void undo() {
        if (!undoStack.isEmpty()) {
            redoStack.push(text.toString());
            text = new StringBuilder(undoStack.pop());
        }
    }
    
    public void redo() {
        if (!redoStack.isEmpty()) {
            undoStack.push(text.toString());
            text = new StringBuilder(redoStack.pop());
        }
    }
    
    public String getText() {
        return text.toString();
    }
}
