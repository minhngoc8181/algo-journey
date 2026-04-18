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
            boolean pass = true;
            
            String firstMismatchAct = "[]";
            String firstMismatchExp = "[]";

            for (int k = 0; k < opsCount; k++) {
                int val = rng.nextInt(20000) - 10000;
                
                // Track expected
                refQueue.add(val);
                refSum += val;
                if (refQueue.size() > maxSize) {
                    refSum -= refQueue.poll();
                }
                double expectedAvg = (double) refSum / refQueue.size();
                double actualAvg = obj.next(val);
                
                if (Math.abs(expectedAvg - actualAvg) > 1e-5) {
                    pass = false;
                    firstMismatchAct = "[" + actualAvg + "]";
                    firstMismatchExp = "[" + expectedAvg + "]";
                    break;
                }
            }
            System.out.println("AJ|test-" + i + "|" + pass + "|" + firstMismatchAct + "|" + firstMismatchExp);
        }`
    }
  }
});
