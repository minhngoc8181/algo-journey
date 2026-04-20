import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'simple-counter',
  version: 1,
  title: 'Simple Counter',
  summary: 'Implement a counter class with increment and getValue.',
  topic: 'design',
  difficulty: 'easy',
  tags: ['constructor', 'state', 'cse201'],
  estimatedMinutes: 15,
  order: 436,
  mode: 'class_implementation',
  hints: [
    'Declare a private integer variable `count`.',
    'Initialize it in the constructor with the given `startValue`.',
    'In the `increment()` method, increase `count` by 1 and return its new value.'
  ],

  learningGoals: ['Understand basic class structure', 'Manage internal state'],
  statement: 'Implement a class `Counter` with a constructor that takes an initial value, a method `increment()` to increase the value by 1, and a method `getValue()` to return the current value.',
  constraints: ['The initial value is a non-negative integer.', 'increment() can be called multiple times.'],
  examples: [
    { 
      input: 'Counter c = new Counter(5);\nc.increment();\nc.getValue();', 
      output: '6', 
      explanation: 'Initial value is 5. After one increment, it becomes 6.' 
    },
  ],

  starter: {
    file: 'Counter.java',
    code: `class Counter {
    
    // Constructor
    Counter(int start) {
        
    }

    void increment() {
        
    }

    int getValue() {
        return -1;
    }
}`,
  },

  requiredStructure: {
    className: 'Counter',
    requiredMethods: [
      'Counter(int start)',
      'void increment()',
      'int getValue()'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 999111,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 50 : 2000;
            int startVal = Math.abs(rng.nextInt(10000));
            Counter obj = new Counter(startVal);
            
            int refVal = startVal;
            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int opType = rng.nextInt(2);
                if (opType == 0) { // increment
                    obj.increment();
                    refVal++;
                } else { // getValue
                    int actual = obj.getValue();
                    expTrace.add(refVal);
                    actTrace.add(actual);
                }
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
            System.out.println("AJ|stress-" + i + "|" + pass + "|" + actStr + "|" + expStr);
        }`
    }
  }
});
