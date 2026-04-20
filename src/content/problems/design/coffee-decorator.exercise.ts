import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'coffee-decorator',
  version: 1,
  title: 'Coffee Order - Decorator Pattern',
  summary: 'Dynamically add features (toppings) to an object using the Decorator Pattern without altering its structure.',
  topic: 'design',
  difficulty: 'medium',
  tags: ['design', 'decorator-pattern', 'composition', 'cse202'],
  estimatedMinutes: 25,
  order: 456,
  mode: 'class_implementation',
  hints: [
    'Create an abstract `CoffeeDecorator` class that implements `Coffee` and holds a `Coffee` reference in its constructor.',
    'Concrete decorators should call `super.getDescription()` and `super.getCost()`, then add their own specific string or value.',
    'The `CoffeeShop` iterates through the toppings array, dynamically wrapping the base coffee in new decorators: `coffee = new MilkDecorator(coffee)`.',
    'To format the cost to 2 decimal places, use integer arithmetic: `long cents = Math.round(getCost() * 100); String costStr = (cents/100) + "." + (cents%100 < 10 ? "0" : "") + (cents%100);`'
  ],

  learningGoals: [
    'Implement the Decorator Pattern using composition',
    'Understand how Decorators wrap objects dynamically at runtime',
    'Follow the Open/Closed Principle when extending object behavior'
  ],
  statement: `You are building a cash register system for a coffee shop. A base coffee can have multiple toppings added to it (milk, sugar, cream, chocolate). Each topping changes the coffee's final description and increases its price.

Use the **Decorator Pattern** to avoid creating a massive hierarchy of classes (e.g., \`MilkSugarCoffee\`, \`ChocolateCreamCoffee\`).

**Interface:**
- \`Coffee\`
  - \`String getDescription()\`
  - \`double getCost()\`

**Base Class:**
- \`BasicCoffee\` implements \`Coffee\`
  - Description: \`"Basic Coffee"\`
  - Cost: \`2.0\`

**Decorators:**
(Each should append a comma and the topping name to the description, e.g., \`", Milk"\`, and add the extra cost)
- \`MilkDecorator\` — Cost: \`+0.5\`
- \`SugarDecorator\` — Cost: \`+0.2\`
- \`CreamDecorator\` — Cost: \`+0.7\`
- \`ChocolateDecorator\` — Cost: \`+1.0\`

**Context class:**
- \`CoffeeShop()\`
  - \`String order(String[] toppings)\` — Starts with a \`BasicCoffee\`. It iterates through the \`toppings\` array, wrapping the coffee with the requested decorators ("Milk", "Sugar", "Cream", "Chocolate" - case-insensitive). Finally, it formats and returns the result strictly like this: \`"{description} | Cost: \${cost}"\`, formatting the cost to 2 decimal places (e.g. \`"Basic Coffee, Milk, Sugar | Cost: $2.70"\`).`,
  constraints: [
    'The toppings array can be empty but will not be null in tests.',
    'At most \`1000\` calls will be made.'
  ],
  examples: [
    {
      input: `CoffeeShop shop = new CoffeeShop();
shop.order(new String[]{"Milk", "Sugar"});   // return "Basic Coffee, Milk, Sugar | Cost: $2.70"
shop.order(new String[]{});                  // return "Basic Coffee | Cost: $2.00"
shop.order(new String[]{"Chocolate", "Milk"});  // return "Basic Coffee, Chocolate, Milk | Cost: $3.50"`,
      output: '[null, "Basic Coffee, Milk, Sugar | Cost: $2.70", "Basic Coffee | Cost: $2.00", "Basic Coffee, Chocolate, Milk | Cost: $3.50"]'
    }
  ],

  starter: {
    file: 'CoffeeShop.java',
    code: `interface Coffee {
    String getDescription();
    double getCost();
}

class BasicCoffee {
}

abstract class CoffeeDecorator {
}

class MilkDecorator {
}

class SugarDecorator {
}

class CreamDecorator {
}

class ChocolateDecorator {
}

class CoffeeShop {

    public CoffeeShop() {
        
    }

    public String order(String[] toppings) {
        return "";
    }
}`,
  },

  requiredStructure: {
    className: 'CoffeeShop',
    requiredMethods: [
      'CoffeeShop()',
      'String order(String[] toppings)'
    ],
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 99112233,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        String[] possibleToppings = {"Milk", "Sugar", "Cream", "Chocolate", "InvalidTopping"};
        
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 10 : 100;
            CoffeeShop obj = new CoffeeShop();

            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int numToppings;
                if (i < 3) numToppings = 0; // Empty topping test
                else if (i < 6) numToppings = 10; // Large toppings test
                else numToppings = rng.nextInt(5);
                
                String[] toppings = new String[numToppings];
                
                String expectedDesc = "Basic Coffee";
                // Track cost in cents (integer) to avoid floating point issues
                int expectedCostCents = 200; // $2.00 = 200 cents

                for (int t = 0; t < numToppings; t++) {
                    String top = possibleToppings[rng.nextInt(possibleToppings.length)];
                    toppings[t] = top;
                    
                    if (top.equals("Milk")) {
                        expectedDesc += ", Milk";
                        expectedCostCents += 50; // $0.50
                    } else if (top.equals("Sugar")) {
                        expectedDesc += ", Sugar";
                        expectedCostCents += 20; // $0.20
                    } else if (top.equals("Cream")) {
                        expectedDesc += ", Cream";
                        expectedCostCents += 70; // $0.70
                    } else if (top.equals("Chocolate")) {
                        expectedDesc += ", Chocolate";
                        expectedCostCents += 100; // $1.00
                    }
                }

                // Format cost manually: e.g. 270 cents -> "$2.70"
                int dollars = expectedCostCents / 100;
                int cents = expectedCostCents % 100;
                String costStr = dollars + "." + (cents < 10 ? "0" : "") + cents;
                String expectedAns = expectedDesc + " | Cost: $" + costStr;
                String actualAns = obj.order(toppings);

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
