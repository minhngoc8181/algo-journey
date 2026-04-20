import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'parking-system',
  version: 1,
  title: 'Design Parking System',
  summary: 'Design a parking system for a parking lot with big, medium, and small slots.',
  topic: 'design',
  difficulty: 'easy',
  tags: ['design', 'simulation', 'cse201'],
  estimatedMinutes: 15,
  order: 441,
  mode: 'class_implementation',
  hints: [
    'You can simply use three integer variables: `big`, `medium`, and `small`.',
    'Initialize them with the given values in the constructor.',
    'In `addCar(carType)`, check the `carType` argument.',
    'If the corresponding capacity is limit `> 0`, decrement it and return `true`. Otherwise, return `false`.'
  ],

  learningGoals: ['Model limited resources in an OOP design', 'Work with class state variables to track available slots'],
  statement: `Design a parking system for a parking lot. The parking lot has three kinds of parking spaces: big, medium, and small, with a fixed number of slots for each size.

Implement the \`ParkingSystem\` class:\n\n- \`ParkingSystem(int big, int medium, int small)\` Initializes object of the \`ParkingSystem\` class. The number of slots for each parking space are given as part of the constructor.
- \`boolean addCar(int carType)\` Checks whether there is a parking space of \`carType\` for the car that wants to get into the parking lot. \`carType\` can be of three kinds: \`1\`, \`2\`, or \`3\`, which represent big, medium, and small, respectively. A car can only park in a parking space of its \`carType\`. If there is no space available, return \`false\`, else park the car in that size space and return \`true\`.`,
  constraints: [
    '\`0 <= big, medium, small <= 1000\`',
    '\`carType\` is \`1\`, \`2\`, or \`3\`',
    'At most \`1000\` calls will be made to \`addCar\`.'
  ],
  examples: [
    { 
      input: 'ParkingSystem ps = new ParkingSystem(1, 1, 0);\nps.addCar(1); // return true\nps.addCar(2); // return true\nps.addCar(3); // return false (no small space)\nps.addCar(1); // return false (no big space, already occupied)', 
      output: '[null, true, true, false, false]'
    },
  ],

  starter: {
    file: 'ParkingSystem.java',
    code: `class ParkingSystem {

    public ParkingSystem(int big, int medium, int small) {
        
    }
    
    public boolean addCar(int carType) {
        return false;
    }
}`,
  },

  requiredStructure: {
    className: 'ParkingSystem',
    requiredMethods: [
      'ParkingSystem(int big, int medium, int small)',
      'boolean addCar(int carType)'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 87654,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 100 : 20000;
            
            int[] refSpaces = {
                0, // 1-index shift
                rng.nextInt(500) + 1,
                rng.nextInt(500) + 1,
                rng.nextInt(500) + 1
            };
            
            ParkingSystem obj = new ParkingSystem(refSpaces[1], refSpaces[2], refSpaces[3]);
            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int carType = rng.nextInt(3) + 1; // 1, 2, or 3
                
                // Track expected
                boolean expectedAns = false;
                if (refSpaces[carType] > 0) {
                    expectedAns = true;
                    refSpaces[carType]--;
                }
                
                // Track actual
                boolean actualAns = obj.addCar(carType);
                
                expTrace.add(expectedAns);
                    actTrace.add(actualAns);
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
