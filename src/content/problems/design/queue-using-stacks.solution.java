import java.util.Stack;

class MyQueue {
    private Stack<Integer> s1;
    private Stack<Integer> s2;

    public MyQueue() {
        s1 = new Stack<>();
        s2 = new Stack<>();
    }
    
    public void push(int x) {
        s1.push(x);
    }
    
    public int pop() {
        shiftStacks();
        return s2.pop();
    }
    
    public int peek() {
        shiftStacks();
        return s2.peek();
    }
    
    public boolean empty() {
        return s1.isEmpty() && s2.isEmpty();
    }

    private void shiftStacks() {
        if (s2.isEmpty()) {
            while (!s1.isEmpty()) {
                s2.push(s1.pop());
            }
        }
    }
}
