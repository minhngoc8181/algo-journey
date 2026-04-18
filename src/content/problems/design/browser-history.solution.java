import java.util.ArrayList;

class BrowserHistory {

    private ArrayList<String> history;
    private int curr;

    public BrowserHistory(String homepage) {
        history = new ArrayList<>();
        history.add(homepage);
        curr = 0;
    }
    
    public void visit(String url) {
        // clear forward history
        while (history.size() > curr + 1) {
            history.remove(history.size() - 1);
        }
        history.add(url);
        curr++;
    }
    
    public String back(int steps) {
        curr = Math.max(0, curr - steps);
        return history.get(curr);
    }
    
    public String forward(int steps) {
        curr = Math.min(history.size() - 1, curr + steps);
        return history.get(curr);
    }
}
