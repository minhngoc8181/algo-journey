import { defineTests } from '../../_test-utils';

export default defineTests('payment-method', (t) => {
  t.visible('example-1', {
    operations: [
      ['Order', 100],
      ['setPaymentStrategy', 'new CashPayment()'],
      ['checkout'],
      ['setPaymentStrategy', 'new CreditCardPayment()'],
      ['checkout'],
      ['setPaymentStrategy', 'new EWalletPayment()'],
      ['checkout'],
    ],
    expected: [null, null, 'Paid 100 using Cash', null, 'Paid 100 using Credit Card', null, 'Paid 100 using E-Wallet']
  });

  t.visible('example-2', {
    operations: [
      ['Order', 250],
      ['checkout'],
      ['setPaymentStrategy', 'new CashPayment()'],
      ['checkout'],
    ],
    expected: [null, 'No payment strategy set', null, 'Paid 250 using Cash']
  });

  t.hidden('switch-strategy', {
    operations: [
      ['Order', 500],
      ['setPaymentStrategy', 'new EWalletPayment()'],
      ['checkout'],
      ['setPaymentStrategy', 'new CreditCardPayment()'],
      ['checkout'],
      ['checkout'],
    ],
    expected: [null, null, 'Paid 500 using E-Wallet', null, 'Paid 500 using Credit Card', 'Paid 500 using Credit Card']
  });

  t.hidden('large-amount', {
    operations: [
      ['Order', 999999],
      ['setPaymentStrategy', 'new CashPayment()'],
      ['checkout'],
    ],
    expected: [null, null, 'Paid 999999 using Cash']
  });
});
