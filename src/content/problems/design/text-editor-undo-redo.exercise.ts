import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'text-editor-undo-redo',
  version: 1,
  title: 'Text Editor with Undo and Redo',
  summary: 'Design a simple text editor that supports appending text, deleting text, and full undo/redo capabilities.',
  topic: 'design',
  difficulty: 'medium',
  tags: ['stack', 'design', 'command-pattern', 'cse201'],
  estimatedMinutes: 30,
  order: 448,
  mode: 'class_implementation',
  hints: [
    'A `StringBuilder` is good for manipulating the current text.',
    'Use an `undoStack` and a `redoStack` storing Strings (representing the text states).',
    'When typing or deleting, push the current text state to `undoStack` and clear `redoStack` BEFORE you modify the text.',
    'When undoing, push the current text to `redoStack` and update your text to the state popped from `undoStack`.'
  ],

  learningGoals: ['Understand the Command Pattern or State Snapshot pattern', 'Manage parallel stacks for undo and redo history'],
  statement: `Design a simple text editor that supports adding text, deleting text, and undo/redo operations.

Implement the \`TextEditor\` class:\n\n- \`TextEditor()\` Initializes the object with an empty string \`""\`.
- \`void addText(String text)\` Appends \`text\` to the current text.
- \`void deleteText(int k)\` Deletes the last \`k\` characters from the current text. If the text has fewer than \`k\` characters, it clears the entire text.
- \`void undo()\` Reverts the last \`addText\` or \`deleteText\` operation. If there are no operations to undo, does nothing.
- \`void redo()\` Reverts the last \`undo\` operation. If there are no operations to redo (or if a new \`addText\`/\`deleteText\` was performed after an undo, which clears the redo history), does nothing.
- \`String getText()\` Returns the current text.`,
  constraints: [
    '\`k\` is a positive integer',
    '\`text\` consists of lowercase English letters',
    'At most \`1000\` calls will be made in total to \`addText\`, \`deleteText\`, \`undo\`, \`redo\`, and \`getText\`.'
  ],
  examples: [
    { 
      input: `TextEditor editor = new TextEditor();
editor.addText("hello");
editor.getText();     // return "hello"
editor.addText("world");
editor.getText();     // return "helloworld"
editor.deleteText(3);
editor.getText();     // return "hellowo"
editor.undo();
editor.getText();     // return "helloworld"
editor.undo();
editor.getText();     // return "hello"
editor.redo();
editor.getText();     // return "helloworld"
editor.addText("!");
editor.getText();     // return "helloworld!"
editor.redo();        // does nothing because a new edit cleared redo history
editor.getText();     // return "helloworld!"`, 
      output: '[null, null, "hello", null, "helloworld", null, "hellowo", null, "helloworld", null, "hello", null, "helloworld", null, "helloworld!", null, "helloworld!"]'
    },
  ],

  starter: {
    file: 'TextEditor.java',
    code: `class TextEditor {

    public TextEditor() {
        
    }
    
    public void addText(String text) {
        
    }
    
    public void deleteText(int k) {
        
    }
    
    public void undo() {
        
    }
    
    public void redo() {
        
    }
    
    public String getText() {
        return "";
    }
}`,
  },

  requiredStructure: {
    className: 'TextEditor',
    requiredMethods: [
      'TextEditor()',
      'void addText(String text)',
      'void deleteText(int k)',
      'void undo()',
      'void redo()',
      'String getText()'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 1122334,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 100 : 2000;
            
            TextEditor obj = new TextEditor();
            
            // Reference tracking using state snapshot
            java.util.Stack<String> undoStack = new java.util.Stack<>();
            java.util.Stack<String> redoStack = new java.util.Stack<>();
            String currentText = "";
            // undoStack.push(currentText); // Removed sentinel inline with proper Command Pattern
            
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
                    
                    // ref
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
                    if (!undoStack.isEmpty()) {
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
                } else { // getText
                    String expectedAns = currentText;
                    String actualAns = obj.getText();
                    
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
