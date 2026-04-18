import java.util.LinkedList;
import java.util.Queue;

class MovingAverage {
    private Queue<Integer> queue;
    private int maxSize;
    private double sum;

    public MovingAverage(int size) {
        queue = new LinkedList<>();
        maxSize = size;
        sum = 0.0;
    }
    
    public double next(int val) {
        queue.add(val);
        sum += val;
        if (queue.size() > maxSize) {
            sum -= queue.poll();
        }
        return sum / queue.size();
    }
}
