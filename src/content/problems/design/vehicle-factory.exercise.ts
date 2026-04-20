import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'vehicle-factory',
  version: 1,
  title: 'Vehicle Factory - Factory Method',
  summary: 'Implement the Factory Method pattern to encapsulate the instantiation of various vehicle types.',
  topic: 'design',
  difficulty: 'easy',
  tags: ['design', 'factory-pattern', 'polymorphism', 'cse202'],
  estimatedMinutes: 20,
  order: 455,
  mode: 'class_implementation',
  hints: [
    'Define the `Vehicle` interface with `start()`, `stop()`, and `getInfo()`.',
    'Each concrete vehicle class implements these methods returning descriptive strings.',
    'The `createVehicle` method in `VehicleFactory` should use `if-else` or a `switch` on the `type` string to return `new Car()`, `new Bike()`, etc.',
    'For testing purposes, `orderVehicle` is used to trigger `createVehicle` and join the results of the instantiated object\'s methods.'
  ],

  learningGoals: [
    'Understand and implement the Factory Method Pattern',
    'Delegate object creation logic to a distinct factory class',
    'Return interface types from factory methods for loose coupling'
  ],
  statement: `Design a vehicle manufacturing system using the **Factory Method Pattern**. The system should create different types of vehicles based on a string input, centralizing the instantiation logic.

**Interface:**
- \`Vehicle\` — declares three methods: \`String start()\`, \`String stop()\`, \`String getInfo()\`.

**Concrete Vehicles (each implements \`Vehicle\`):**
- \`Bike\`
- \`Motorbike\`
- \`Car\`
*(For each class, implement the interface methods to return distinct strings. For example, \`Car\` might return \`"This is a Car"\` for \`getInfo()\`, \`"Starting engine of car"\` for \`start()\`, etc. The exact strings don't matter as long as they uniquely identify the vehicle type).*

**Context class:**
- \`VehicleFactory()\`
  - \`Vehicle createVehicle(String type)\` — returns a new instance of the requested vehicle (e.g., if type is \`"Car"\`, return \`new Car()\`). Return \`null\` if the type is unknown.
  - \`String orderVehicle(String type)\` — calls \`createVehicle(type)\`. If the vehicle is valid, it concatenates its info, start, and stop messages. If invalid, returns \`"Unknown type"\`. *(Note: This method is primarily to help the auto-grader test your factory).*`,
  constraints: [
    'The \`type\` string passed to the factory will typically be "Bike", "Motorbike", or "Car" (case-insensitive checking is recommended).',
    'At most \`1000\` calls will be made in total.'
  ],
  examples: [
    {
      input: `VehicleFactory factory = new VehicleFactory();
factory.orderVehicle("Car");       // return "This is a Car | Starting engine of car | Stopping car"
factory.orderVehicle("Bike");      // return "This is a Bike | Pedaling bike | Using bike brakes"
factory.orderVehicle("Plane");     // return "Unknown type"`,
      output: '[null, "This is a Car | Starting engine of car | Stopping car", "This is a Bike | Pedaling bike | Using bike brakes", "Unknown type"]'
    }
  ],

  starter: {
    file: 'VehicleFactory.java',
    code: `interface Vehicle {
    String start();
    String stop();
    String getInfo();
}

class Bike {
}

class Motorbike {
}

class Car {
}

class VehicleFactory {

    public Vehicle createVehicle(String type) {
        return null;
    }

    public String orderVehicle(String type) {
        Vehicle v = createVehicle(type);
        if (v == null) return "Unknown type";
        
        // This format helps the auto-grader verify your implementation
        return v.getInfo() + " | " + v.start() + " | " + v.stop();
    }
}`,
  },

  requiredStructure: {
    className: 'VehicleFactory',
    requiredMethods: [
      'VehicleFactory()',
      'Vehicle createVehicle(String type)',
      'String orderVehicle(String type)'
    ],
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 11112222,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        String[] types = {"Car", "Bike", "Motorbike", "Plane", "Boat"};
        
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 10 : 50;
            VehicleFactory obj = new VehicleFactory();

            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                String reqType = types[rng.nextInt(types.length)];
                
                String expectedAns;
                if (reqType.equals("Car") || reqType.equals("Bike") || reqType.equals("Motorbike")) {
                    String actualAns = obj.orderVehicle(reqType);
                    expectedAns = "";
                    if (reqType.equals("Car")) expectedAns = "This is a Car | Starting engine of car | Stopping car";
                    else if (reqType.equals("Bike")) expectedAns = "This is a Bike | Pedaling bike | Using bike brakes";
                    else expectedAns = "This is a Motorbike | Starting engine of motorbike | Stopping motorbike";
                    expTrace.add(expectedAns);
                    actTrace.add(actualAns);
                } else {
                    expectedAns = "Unknown type";
                    String actualAns = obj.orderVehicle(reqType);
                    expTrace.add(expectedAns);
                    actTrace.add(actualAns);
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
            System.out.println("AJ|test-" + i + "|" + pass + "|" + actStr + "|" + expStr);
        }`
    }
  }
});
