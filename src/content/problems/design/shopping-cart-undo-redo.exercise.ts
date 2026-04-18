import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'shopping-cart-undo-redo',
  version: 1,
  title: 'Shopping Cart with Undo and Redo',
  summary: 'Design a shopping cart system that tracks item quantities and fully supports undoing and redoing operations.',
  topic: 'design',
  difficulty: 'hard',
  tags: ['hash-table', 'stack', 'design', 'command-pattern', 'cse201'],
  estimatedMinutes: 45,
  order: 450,
  mode: 'class_implementation',

  learningGoals: ['Implement a robust Command Pattern handling maps', 'Differentiate between state-snapshots versus operation-deltas for undo strategies'],
  statement: `You are creating a shopping cart that supports adding, removing items, and maintains an undo/redo history.

Implement the \`ShoppingCart\` class:\n\n- \`ShoppingCart()\` Initializes an empty cart.
- \`void addItem(String item, int quantity)\` Adds the specified \`quantity\` to the \`item\` in the cart. If the item doesn't exist, it creates it with that \`quantity\`. Saves this operation to the history. Clear any forward (redo) history.
- \`void removeItem(String item, int quantity)\` Subtracts the specified \`quantity\` from the \`item\`. If the item's quantity drops to \`0\` or below, the item is completely removed from the cart. Does nothing if the item is not currently in the cart. Saves this operation to the history. Clear any forward (redo) history.
- \`void undo()\` Reverts the last \`addItem\` or \`removeItem\` operation. If there is no operation to undo, does nothing.
- \`void redo()\` Reverts the last \`undo\` operation. If there is no operation to redo, does nothing.
- \`int getCartTotalQuantity()\` Returns the total combined quantity of all items in the cart.`,
  constraints: [
    '\`item\` consists of lowercase English letters and is at most 10 characters long',
    '\`1 <= quantity <= 1000\`',
    'At most \`2000\` calls will be made in total to \`addItem\`, \`removeItem\`, \`undo\`, \`redo\`, and \`getCartTotalQuantity\`.'
  ],
  examples: [
    { 
      input: `ShoppingCart cart = new ShoppingCart();
cart.addItem("apple", 2);
cart.addItem("banana", 3);
cart.getCartTotalQuantity();  // return 5 (2 + 3)
cart.removeItem("apple", 1);
cart.getCartTotalQuantity();  // return 4 (1 apple + 3 bananas)
cart.undo();
cart.getCartTotalQuantity();  // return 5 (apple back to 2)
cart.removeItem("banana", 5); // banana is removed (quantity goes below 0)
cart.getCartTotalQuantity();  // return 2 (2 apples)
cart.undo();
cart.getCartTotalQuantity();  // return 5 (3 bananas are restored)
cart.redo();
cart.getCartTotalQuantity();  // return 2 (removes banana again)`, 
      output: '[null, null, null, 5, null, 4, null, 5, null, 2, null, 5, null, 2]'
    },
  ],

  starter: {
    file: 'ShoppingCart.java',
    code: `class ShoppingCart {

    public ShoppingCart() {
        
    }
    
    public void addItem(String item, int quantity) {
        
    }
    
    public void removeItem(String item, int quantity) {
        
    }
    
    public void undo() {
        
    }
    
    public void redo() {
        
    }
    
    public int getCartTotalQuantity() {
        return 0;
    }
}`,
  },

  requiredStructure: {
    className: 'ShoppingCart',
    requiredMethods: [
      'ShoppingCart()',
      'void addItem(String item, int quantity)',
      'void removeItem(String item, int quantity)',
      'void undo()',
      'void redo()',
      'int getCartTotalQuantity()'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 5543321,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 100 : 2000;
            
            ShoppingCart obj = new ShoppingCart();
            
            // To simulate undo/redo without command pattern overhead in test, we snapshot states
            java.util.Stack<java.util.HashMap<String, Integer>> undoStack = new java.util.Stack<>();
            java.util.Stack<java.util.HashMap<String, Integer>> redoStack = new java.util.Stack<>();
            java.util.HashMap<String, Integer> currentCart = new java.util.HashMap<>();
            
            boolean pass = true;
            String firstMismatchAct = "[]";
            String firstMismatchExp = "[]";

            for (int k = 0; k < opsCount; k++) {
                int type = rng.nextInt(5);
                
                if (type == 0) { // addItem
                    String item = "i" + rng.nextInt(10);
                    int q = rng.nextInt(10) + 1;
                    
                    // ref
                    undoStack.push(new java.util.HashMap<>(currentCart));
                    currentCart.put(item, currentCart.getOrDefault(item, 0) + q);
                    redoStack.clear();
                    
                    obj.addItem(item, q);
                } else if (type == 1) { // removeItem
                    String item = "i" + rng.nextInt(10);
                    int q = rng.nextInt(10) + 1;
                    
                    // ref
                    undoStack.push(new java.util.HashMap<>(currentCart));
                    if (currentCart.containsKey(item)) {
                        int currentQ = currentCart.get(item);
                        if (currentQ <= q) {
                            currentCart.remove(item);
                        } else {
                            currentCart.put(item, currentQ - q);
                        }
                    }
                    redoStack.clear();
                    
                    obj.removeItem(item, q);
                } else if (type == 2) { // undo
                    if (!undoStack.isEmpty()) {
                        redoStack.push(currentCart);
                        currentCart = undoStack.pop();
                    }
                    obj.undo();
                } else if (type == 3) { // redo
                    if (!redoStack.isEmpty()) {
                        undoStack.push(currentCart);
                        currentCart = redoStack.pop();
                    }
                    obj.redo();
                } else { // getCartTotalQuantity
                    int expectedAns = 0;
                    for (int v : currentCart.values()) expectedAns += v;
                    
                    int actualAns = obj.getCartTotalQuantity();
                    
                    if (expectedAns != actualAns) {
                        pass = false;
                        firstMismatchAct = "[getTotal -> " + actualAns + "]";
                        firstMismatchExp = "[getTotal -> " + expectedAns + "]";
                        break;
                    }
                }
            }
            System.out.println("AJ|test-" + i + "|" + pass + "|" + firstMismatchAct + "|" + firstMismatchExp);
        }`
    }
  }
});
