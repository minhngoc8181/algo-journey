import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'moving-average',
  version: 1,
  title: 'Moving Average from Data Stream',
  summary: 'Calculate the moving average of all integers in the sliding window.',
  topic: 'design',
  difficulty: 'easy',
  tags: ['queue', 'design', 'sliding-window', 'cse201'],
  estimatedMinutes: 20,
  order: 439,
  mode: 'class_implementation',
  hints: [
    'Use a `Queue` (e.g. `LinkedList` or `ArrayDeque`) to store up to `size` elements.',
    'Keep a running `sum` variable.',
    'When adding a new value, add it to the queue and add it to `sum`.',
    'If the queue size exceeds the window `size`, poll the oldest element from the front of the queue and subtract it from `sum`.'
  ],

  learningGoals: ['Design a class with internal state', 'Use a queue to represent a sliding window'],
  statement: `Given a stream of integers and a window size, calculate the moving average of all integers in the sliding window.

Implement the \`MovingAverage\` class:\n\n- \`MovingAverage(int size)\` Initializes the object with the size of the window \`size\`.
- \`double next(int val)\` Returns the moving average of the last \`size\` values of the stream.`,
  constraints: [
    'The parameter \`size\` will be at least 1.',
  ],
  examples: [
    { 
      input: 'MovingAverage m = new MovingAverage(3);\nm.next(1); // return 1.0\nm.next(10); // return 5.5\nm.next(3); // return 4.66667\nm.next(5); // return 6.0', 
      output: '[null, 1.0, 5.5, 4.666666666666667, 6.0]'
    },
  ],

  starter: {
    file: 'MovingAverage.java',
    code: `class MovingAverage {

    public MovingAverage(int size) {
        
    }
    
    public double next(int val) {
        return 0.0;
    }
}`,
  },

  requiredStructure: {
    className: 'MovingAverage',
    requiredMethods: [
      'MovingAverage(int size)',
      'double next(int val)'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 98765,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 100 : 20000;
            int maxSize = rng.nextInt(500) + 1;
            
            MovingAverage obj = new MovingAverage(maxSize);
            java.util.Queue<Integer> refQueue = new java.util.LinkedList<>();
            long refSum = 0;
            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int val = rng.nextInt(20000) - 10000;
                
                // Track expected
                refQueue.add(val);
                refSum += val;
                if (refQueue.size() > maxSize) {
                    refSum -= refQueue.poll();
                }
                double expectedAvg = (double) refSum / refQueue.size();
                double actualAvg = obj.next(val);
                
                expTrace.add(expectedAvg);
                    actTrace.add(actualAvg);
                if (expTrace.size() == traceSizeBefore) {
                    expTrace.add(null);
                    actTrace.add(null);
                }
            }
            boolean pass = actTrace.equals(expTrace);
            String actStr = actTrace.toString();
            String expStr = expTrace.toString();
            if (!pass) {
                int mismatchIdx = -1;
                for (int m = 0; m < actTrace.size(); m++) {
                    if (actTrace.get(m) == null && expTrace.get(m) == null) continue;
                    if (actTrace.get(m) == null || !actTrace.get(m).equals(expTrace.get(m))) { mismatchIdx = m; break; }
                }
                if (actStr.length() > 2000) actStr = actStr.substring(0, 2000) + "...";
                if (expStr.length() > 2000) expStr = expStr.substring(0, 2000) + "...";
                if (mismatchIdx != -1) {
                    actStr = "[Mismatch at idx " + mismatchIdx + "] " + actStr;
                    expStr = "[Mismatch at idx " + mismatchIdx + "] " + expStr;
                }
            }
            System.out.println("AJ|test-" + i + "|" + pass + "|" + actStr + "|" + expStr);
        }`
    }
  }
});
