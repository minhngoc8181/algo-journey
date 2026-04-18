interface PaymentStrategy {
    String pay(int amount);
}

class CashPayment implements PaymentStrategy {
    public String pay(int amount) {
        return "Paid " + amount + " using Cash";
    }
}

class CreditCardPayment implements PaymentStrategy {
    public String pay(int amount) {
        return "Paid " + amount + " using Credit Card";
    }
}

class EWalletPayment implements PaymentStrategy {
    public String pay(int amount) {
        return "Paid " + amount + " using E-Wallet";
    }
}

class Order {
    private int amount;
    private PaymentStrategy paymentStrategy;

    public Order(int amount) {
        this.amount = amount;
    }

    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }

    public String checkout() {
        if (paymentStrategy == null) {
            return "No payment strategy set";
        }
        return paymentStrategy.pay(amount);
    }
}
