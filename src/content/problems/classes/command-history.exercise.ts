import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'command-history',
  version: 1,
  title: 'Command History Simulator',
  summary: 'Design a system that acts upon an integer value and supports undo and redo of mathematical commands.',
  topic: 'classes',
  difficulty: 'easy',
  tags: ['stack', 'design', 'command-pattern', 'cse201'],
  estimatedMinutes: 20,
  order: 449,
  mode: 'class_implementation',

  learningGoals: ['Implement the Command Design Pattern with concrete operations', 'Use stacks or lists to track history bounds for undo and redo operations'],
  statement: `You are simulating a command-line interface that modifies a single integer \`value\` that starts at \`0\`.

Implement the \`CommandHistory\` class:\n\n- \`CommandHistory()\` Initializes the system with the value \`0\`.
- \`void add(int amount)\` Adds \`amount\` to the current value. Saves this operation to the history. Clear any forward (redo) history.
- \`void subtract(int amount)\` Subtracts \`amount\` from the current value. Saves this operation to the history. Clear any forward (redo) history.
- \`void undo()\` Undoes the last \`add\` or \`subtract\` operation. If there is no operation to undo, does nothing.
- \`void redo()\` Redoes the most recently undone operation. If there is no operation to redo, does nothing.
- \`int getValue()\` Returns the current value.`,
  constraints: [
    '\`1 <= amount <= 10^4\`',
    'At most \`1000\` calls will be made in total to \`add\`, \`subtract\`, \`undo\`, \`redo\`, and \`getValue\`.'
  ],
  examples: [
    { 
      input: `CommandHistory ch = new CommandHistory();
ch.add(5);
ch.getValue();      // return 5
ch.subtract(2);
ch.getValue();      // return 3
ch.undo();
ch.getValue();      // return 5 (undo subtract 2)
ch.undo();
ch.getValue();      // return 0 (undo add 5)
ch.undo();          // does nothing
ch.redo();
ch.getValue();      // return 5 (redo add 5)
ch.add(10);
ch.redo();          // does nothing, because add(10) cleared the redo history
ch.getValue();      // return 15`, 
      output: '[null, null, 5, null, 3, null, 5, null, 0, null, null, 5, null, null, 15]'
    },
  ],

  starter: {
    file: 'CommandHistory.java',
    code: `class CommandHistory {

    public CommandHistory() {
        
    }
    
    public void add(int amount) {
        
    }
    
    public void subtract(int amount) {
        
    }
    
    public void undo() {
        
    }
    
    public void redo() {
        
    }
    
    public int getValue() {
        return 0;
    }
}`,
  },

  requiredStructure: {
    className: 'CommandHistory',
    requiredMethods: [
      'CommandHistory()',
      'void add(int amount)',
      'void subtract(int amount)',
      'void undo()',
      'void redo()',
      'int getValue()'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 2468135,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        // Interface-based command pattern to simulate the reference model
        interface CommandOp {
            void execute();
            void undo();
        }

        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 100 : 5000;
            
            CommandHistory obj = new CommandHistory();
            
            java.util.Stack<CommandOp> undoStack = new java.util.Stack<>();
            java.util.Stack<CommandOp> redoStack = new java.util.Stack<>();
            
            // To pass final value into lambda, use an array
            int[] refValue = {0};
            
            boolean pass = true;
            String firstMismatchAct = "[]";
            String firstMismatchExp = "[]";

            for (int k = 0; k < opsCount; k++) {
                int type = rng.nextInt(5);
                
                if (type == 0) { // add
                    int amount = rng.nextInt(100) + 1;
                    
                    obj.add(amount);
                    
                    CommandOp cmd = new CommandOp() {
                        public void execute() { refValue[0] += amount; }
                        public void undo() { refValue[0] -= amount; }
                    };
                    cmd.execute();
                    undoStack.push(cmd);
                    redoStack.clear();
                } else if (type == 1) { // subtract
                    int amount = rng.nextInt(100) + 1;
                    
                    obj.subtract(amount);
                    
                    CommandOp cmd = new CommandOp() {
                        public void execute() { refValue[0] -= amount; }
                        public void undo() { refValue[0] += amount; }
                    };
                    cmd.execute();
                    undoStack.push(cmd);
                    redoStack.clear();
                } else if (type == 2) { // undo
                    obj.undo();
                    
                    if (!undoStack.isEmpty()) {
                        CommandOp cmd = undoStack.pop();
                        cmd.undo();
                        redoStack.push(cmd);
                    }
                } else if (type == 3) { // redo
                    obj.redo();
                    
                    if (!redoStack.isEmpty()) {
                        CommandOp cmd = redoStack.pop();
                        cmd.execute();
                        undoStack.push(cmd);
                    }
                } else { // getValue
                    int expectedAns = refValue[0];
                    int actualAns = obj.getValue();
                    
                    if (expectedAns != actualAns) {
                        pass = false;
                        firstMismatchAct = "[getValue -> " + actualAns + "]";
                        firstMismatchExp = "[getValue -> " + expectedAns + "]";
                        break;
                    }
                }
            }
            System.out.println("AJ|test-" + i + "|" + pass + "|" + firstMismatchAct + "|" + firstMismatchExp);
        }`
    }
  }
});
