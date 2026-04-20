import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'text-editor-command',
  version: 1,
  title: 'Undo/Redo Text Editor - Command Pattern',
  summary: 'Implement a text editor with undo and redo capabilities using the Command Design Pattern to encapsulate operations.',
  topic: 'design',
  difficulty: 'medium',
  tags: ['design', 'command-pattern', 'stack', 'cse202'],
  estimatedMinutes: 30,
  order: 454,
  mode: 'class_implementation',
  hints: [
    'The `Command` interface acts as a contract for all operations, requiring `execute()` and `undo()`.',
    'Commands like `AddTextCommand` need a reference to the `TextEditor` in their constructor to modify it.',
    'For `DeleteTextCommand`, remember to save the deleted text during `execute()` so you can restore it during `undo()`.',
    'The `CommandManager` uses two Stacks (`undoStack`, `redoStack`). Executing a new command clears the `redoStack`.'
  ],

  learningGoals: [
    'Implement the Command Pattern to encapsulate requests as objects',
    'Manage state transitions using Undo/Redo stacks',
    'Decouple the invoker (CommandManager) from the receiver (TextEditor)'
  ],
  statement: `Design a text editor with undo and redo functionality using the **Command Pattern**.

Implement the following classes and interfaces:

**Interface:**
- \`Command\` — declares two methods: \`void execute()\` and \`void undo()\`.

**Command Manager:**
- \`CommandManager\`
  - \`void executeCommand(Command command)\` — executes the command, pushes it to the undo stack, and clears the redo stack.
  - \`void undo()\` — pops the last command from the undo stack, calls \`undo()\`, and pushes it to the redo stack.
  - \`void redo()\` — pops the last undone command from the redo stack, calls \`execute()\`, and pushes it to the undo stack.

**Concrete Commands (each implements \`Command\`):**
- \`AddTextCommand(TextEditor editor, String text)\`
- \`DeleteTextCommand(TextEditor editor, int length)\` — must store the deleted text so it can be completely restored on undo.

**Context class:**
- \`TextEditor()\` — Initializes an empty string. You should instantiate a \`CommandManager\` inside it.
- \`void addText(String text)\` — Creates an \`AddTextCommand\` and passes it to the manager.
- \`void deleteText(int length)\` — Creates a \`DeleteTextCommand\` and passes it to the manager.
- \`void undo()\` — Delegates to the manager.
- \`void redo()\` — Delegates to the manager.
- \`String getContent()\` — Returns the current text.

*(Note: You may need to add helper methods in \`TextEditor\` so the commands can modify its text)*`,
  constraints: [
    'The text editor will only process strings of lowercase English letters.',
    'Deleting more characters than currently exist should just clear the text.',
    'Undo/redo when the respective stack is empty should do nothing.',
    'At most \`1000\` operations will be executed.'
  ],
  examples: [
    {
      input: `TextEditor editor = new TextEditor();
editor.addText("hello");
editor.getContent();     // return "hello"
editor.addText("world");
editor.getContent();     // return "helloworld"
editor.deleteText(3);
editor.getContent();     // return "hellowo"
editor.undo();
editor.getContent();     // return "helloworld"
editor.redo();
editor.getContent();     // return "hellowo"
editor.addText("!");
editor.redo();           // does nothing because redo stack was cleared
editor.getContent();     // return "hellowo!"`,
      output: '[null, null, "hello", null, "helloworld", null, "hellowo", null, "helloworld", null, "hellowo", null, null, "hellowo!"]'
    }
  ],

  starter: {
    file: 'TextEditor.java',
    code: `import java.util.Stack;

interface Command {
    void execute();
    void undo();
}

class AddTextCommand {
}

class DeleteTextCommand {
}

class CommandManager {
}

class TextEditor {

    public TextEditor() {
        
    }
    
    public void addText(String text) {
        
    }
    
    public void deleteText(int length) {
        
    }
    
    public void undo() {
        
    }
    
    public void redo() {
        
    }
    
    public String getContent() {
        return "";
    }
}`,
  },

  requiredStructure: {
    className: 'TextEditor',
    requiredMethods: [
      'TextEditor()',
      'void addText(String text)',
      'void deleteText(int length)',
      'void undo()',
      'void redo()',
      'String getContent()'
    ],
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 837421,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 100 : 2000;
            
            TextEditor obj = new TextEditor();
            
            // Reference tracking
            java.util.Stack<String> undoStack = new java.util.Stack<>();
            java.util.Stack<String> redoStack = new java.util.Stack<>();
            String currentText = "";
            undoStack.push(currentText); // Initial state
            
            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int type = rng.nextInt(5);
                
                if (type == 0) { // addText
                    String letters = "abcdefghijklmnopqrstuvwxyz";
                    StringBuilder sb = new StringBuilder();
                    int len = rng.nextInt(5) + 1;
                    for (int j = 0; j < len; j++) sb.append(letters.charAt(rng.nextInt(26)));
                    String add = sb.toString();
                    
                    undoStack.push(currentText);
                    currentText += add;
                    redoStack.clear();
                    
                    obj.addText(add);
                } else if (type == 1) { // deleteText
                    int delCount = rng.nextInt(10) + 1;
                    
                    undoStack.push(currentText);
                    int remain = Math.max(0, currentText.length() - delCount);
                    currentText = currentText.substring(0, remain);
                    redoStack.clear();
                    
                    obj.deleteText(delCount);
                } else if (type == 2) { // undo
                    if (!undoStack.isEmpty() && undoStack.size() > 1) {
                        redoStack.push(currentText);
                        currentText = undoStack.pop();
                    }
                    obj.undo();
                } else if (type == 3) { // redo
                    if (!redoStack.isEmpty()) {
                        undoStack.push(currentText);
                        currentText = redoStack.pop();
                    }
                    obj.redo();
                } else { // getContent
                    String expectedAns = currentText;
                    String actualAns = obj.getContent();
                    
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
