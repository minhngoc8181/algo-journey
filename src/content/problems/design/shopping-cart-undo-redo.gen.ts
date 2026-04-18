import { defineTests } from '../../_test-utils';

export default defineTests('shopping-cart-undo-redo', (t) => {
  t.visible('example-1', { 
    operations: [
      ['ShoppingCart'],
      ['addItem', 'apple', 2],
      ['addItem', 'banana', 3],
      ['getCartTotalQuantity'],
      ['removeItem', 'apple', 1],
      ['getCartTotalQuantity'],
      ['undo'],
      ['getCartTotalQuantity'],
      ['removeItem', 'banana', 5],
      ['getCartTotalQuantity'],
      ['undo'],
      ['getCartTotalQuantity'],
      ['redo'],
      ['getCartTotalQuantity']
    ],
    expected: [null, null, null, 5, null, 4, null, 5, null, 2, null, 5, null, 2] 
  });
});
