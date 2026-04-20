import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'payment-method',
  version: 1,
  title: 'Payment Method - Strategy Pattern',
  summary: 'Implement a payment system using the Strategy Pattern, allowing flexible payment methods without modifying the Order class.',
  topic: 'design',
  difficulty: 'easy',
  tags: ['design', 'strategy-pattern', 'polymorphism', 'cse202'],
  estimatedMinutes: 20,
  order: 451,
  mode: 'class_implementation',
  hints: [
    'Define `PaymentStrategy` as a Java interface with one method: `String pay(int amount)`.',
    'Each concrete strategy (`CashPayment`, `CreditCardPayment`, `EWalletPayment`) implements this interface and returns a descriptive string.',
    'The `Order` class stores a `PaymentStrategy` field. `checkout()` simply delegates to the strategy\'s `pay()` method.',
    'If no strategy is set when `checkout()` is called, return `"No payment strategy set"`.'
  ],

  learningGoals: [
    'Understand and implement the Strategy Design Pattern',
    'Use interfaces to achieve polymorphism and loose coupling',
    'Design classes that are open for extension but closed for modification (OCP)'
  ],
  statement: `You are building a simple e-commerce checkout system. The system should allow an \`Order\` to be paid using different payment methods **without the \`Order\` class knowing the details** of how each payment works.

Implement the **Strategy Pattern** with the following:

**Interface:**
- \`PaymentStrategy\` — declares a single method \`String pay(int amount)\`.

**Concrete Strategies (each implements \`PaymentStrategy\`):**
- \`CashPayment\` — \`pay(amount)\` returns \`"Paid {amount} using Cash"\`
- \`CreditCardPayment\` — \`pay(amount)\` returns \`"Paid {amount} using Credit Card"\`
- \`EWalletPayment\` — \`pay(amount)\` returns \`"Paid {amount} using E-Wallet"\`

**Context class:**
- \`Order(int amount)\` — Creates an order with the given total amount.
- \`void setPaymentStrategy(PaymentStrategy strategy)\` — Sets the payment method for this order.
- \`String checkout()\` — Processes the payment using the current strategy and returns the result string. If no strategy has been set, returns \`"No payment strategy set"\`.`,
  constraints: [
    '`1 <= amount <= 10^6`',
    'At most `1000` calls will be made in total.',
    '`checkout()` can be called multiple times; it always uses the most recently set strategy.'
  ],
  examples: [
    {
      input: `Order order = new Order(100);
order.setPaymentStrategy(new CashPayment());
order.checkout();        // return "Paid 100 using Cash"
order.setPaymentStrategy(new CreditCardPayment());
order.checkout();        // return "Paid 100 using Credit Card"
order.setPaymentStrategy(new EWalletPayment());
order.checkout();        // return "Paid 100 using E-Wallet"`,
      output: '[null, null, "Paid 100 using Cash", null, "Paid 100 using Credit Card", null, "Paid 100 using E-Wallet"]'
    },
    {
      input: `Order order = new Order(250);
order.checkout();        // return "No payment strategy set"
order.setPaymentStrategy(new CashPayment());
order.checkout();        // return "Paid 250 using Cash"`,
      output: '[null, "No payment strategy set", null, "Paid 250 using Cash"]'
    },
  ],

  starter: {
    file: 'Order.java',
    code: `interface PaymentStrategy {
    String pay(int amount);
}

class CashPayment {
}

class CreditCardPayment {
}

class EWalletPayment {
}

class Order {

    public Order(int amount) {
        
    }
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        
    }
    
    public String checkout() {
        return "";
    }
}`,
  },

  requiredStructure: {
    className: 'Order',
    requiredMethods: [
      'Order(int amount)',
      'void setPaymentStrategy(PaymentStrategy strategy)',
      'String checkout()'
    ],
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 7719531,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        String[] strategyLabels = {"Cash", "Credit Card", "E-Wallet"};

        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 50 : 500;

            int amount = rng.nextInt(10000) + 1;
            Order obj = new Order(amount);

            // Reference: track current strategy label (null = not set)
            String currentLabel = null;

            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int type = rng.nextInt(4);

                if (type == 0) { // setPaymentStrategy
                    int stratIdx = rng.nextInt(3);
                    PaymentStrategy strategy;
                    if (stratIdx == 0) {
                        strategy = new CashPayment();
                    } else if (stratIdx == 1) {
                        strategy = new CreditCardPayment();
                    } else {
                        strategy = new EWalletPayment();
                    }
                    currentLabel = strategyLabels[stratIdx];
                    obj.setPaymentStrategy(strategy);
                } else if (type == 1) { // checkout
                    String expectedAns = (currentLabel == null)
                        ? "No payment strategy set"
                        : "Paid " + amount + " using " + currentLabel;
                    String actualAns = obj.checkout();

                    expTrace.add(expectedAns);
                    actTrace.add(actualAns);
                } else { // create a brand new Order (reset)
                    amount = rng.nextInt(10000) + 1;
                    obj = new Order(amount);
                    currentLabel = null;
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
