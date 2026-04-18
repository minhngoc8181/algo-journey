import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'recent-counter',
  version: 1,
  title: 'Number of Recent Calls',
  summary: 'Count the number of requests that occurred in the last 3000 milliseconds.',
  topic: 'design',
  difficulty: 'easy',
  tags: ['queue', 'design', 'data-stream', 'cse201'],
  estimatedMinutes: 20,
  order: 440,
  mode: 'class_implementation',

  learningGoals: ['Design a system that tracks events over time', 'Efficiently maintain a sliding window using a queue'],
  statement: `You have a \`RecentCounter\` class which counts the number of recent requests within a certain time frame.

Implement the \`RecentCounter\` class:\n\n- \`RecentCounter()\` Initializes the counter with zero recent requests.
- \`int ping(int t)\` Adds a new request at time \`t\`, where \`t\` represents some time in milliseconds, and returns the number of requests that has happened in the past \`3000\` milliseconds (including the new request). Specifically, return the number of requests that have happened in the inclusive range \`[t - 3000, t]\`.

**Note:**
It is guaranteed that every call to \`ping\` uses a strictly larger value of \`t\` than the previous call.`,
  constraints: [
    '\`1 <= t <= 10^9\`',
    'Each test case will call ping with strictly increasing values of t.'
  ],
  examples: [
    { 
      input: 'RecentCounter rc = new RecentCounter();\nrc.ping(1);     // return 1 [1]\nrc.ping(100);   // return 2 [1, 100]\nrc.ping(3001);  // return 3 [1, 100, 3001]\nrc.ping(3002);  // return 3 [100, 3001, 3002], request at time 1 is outside bounds', 
      output: '[null, 1, 2, 3, 3]'
    },
  ],

  starter: {
    file: 'RecentCounter.java',
    code: `class RecentCounter {

    public RecentCounter() {
        
    }
    
    public int ping(int t) {
        return 0;
    }
}`,
  },

  requiredStructure: {
    className: 'RecentCounter',
    requiredMethods: [
      'RecentCounter()',
      'int ping(int t)'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 12345,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 100 : 20000;
            
            RecentCounter obj = new RecentCounter();
            java.util.Queue<Integer> refQueue = new java.util.LinkedList<>();
            boolean pass = true;
            
            String firstMismatchAct = "[]";
            String firstMismatchExp = "[]";
            
            int currentT = 0;

            for (int k = 0; k < opsCount; k++) {
                currentT += rng.nextInt(100) + 1; // Strictly increasing
                
                // Track expected
                refQueue.add(currentT);
                while (!refQueue.isEmpty() && refQueue.peek() < currentT - 3000) {
                    refQueue.poll();
                }
                int expectedAns = refQueue.size();
                
                // Track actual
                int actualAns = obj.ping(currentT);
                
                if (expectedAns != actualAns) {
                    pass = false;
                    firstMismatchAct = "[" + actualAns + "]";
                    firstMismatchExp = "[" + expectedAns + "]";
                    break;
                }
            }
            System.out.println("AJ|test-" + i + "|" + pass + "|" + firstMismatchAct + "|" + firstMismatchExp);
        }`
    }
  }
});
