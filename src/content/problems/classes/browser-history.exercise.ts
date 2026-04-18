import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'browser-history',
  version: 1,
  title: 'Design Browser History',
  summary: 'Design a system that allows navigating back and forward in browsing history.',
  topic: 'classes',
  difficulty: 'medium',
  tags: ['array', 'stack', 'design', 'doubly-linked-list', 'cse201'],
  estimatedMinutes: 30,
  order: 442,
  mode: 'class_implementation',

  learningGoals: ['Manage complex state changes with back, forward, and overwrite semantics', 'Use arrays or stacks to track browser history'],
  statement: `You have a browser of one tab where you start on the \`homepage\` and you can visit another \`url\`, get back in the history number of \`steps\` or move forward in the history number of \`steps\`.

Implement the \`BrowserHistory\` class:\n\n- \`BrowserHistory(String homepage)\` Initializes the object with the \`homepage\` of the browser.
- \`void visit(String url)\` Visits \`url\` from the current page. It clears up all the forward history.
- \`String back(int steps)\` Move \`steps\` back in history. If you can only return \`x\` steps in the history and \`steps > x\`, you will return only \`x\` steps. Return the current \`url\` after moving back in history at most \`steps\`.
- \`String forward(int steps)\` Move \`steps\` forward in history. If you can only forward \`x\` steps in the history and \`steps > x\`, you will forward only \`x\` steps. Return the current \`url\` after forwarding in history at most \`steps\`.`,
  constraints: [
    '\`1 <= url.length <= 20\`',
    '\`1 <= steps <= 100\`',
    'At most \`5000\` calls will be made to \`visit\`, \`back\`, and \`forward\`.'
  ],
  examples: [
    { 
      input: 'BrowserHistory bh = new BrowserHistory("eiu.edu.vn");\nbh.visit("google.com");\nbh.visit("facebook.com");\nbh.visit("youtube.com");\nbh.back(1);                   // return "facebook.com"\nbh.back(1);                   // return "google.com"\nbh.forward(1);                // return "facebook.com"\nbh.visit("linkedin.com");     // clear forward history\nbh.forward(2);                // return "linkedin.com" (cannot forward 2 steps)\nbh.back(2);                   // return "google.com"\nbh.back(7);                   // return "eiu.edu.vn"', 
      output: '[null, null, null, null, "facebook.com", "google.com", "facebook.com", null, "linkedin.com", "google.com", "eiu.edu.vn"]'
    },
  ],

  starter: {
    file: 'BrowserHistory.java',
    code: `class BrowserHistory {

    public BrowserHistory(String homepage) {
        
    }
    
    public void visit(String url) {
        
    }
    
    public String back(int steps) {
        return "";
    }
    
    public String forward(int steps) {
        return "";
    }
}`,
  },

  requiredStructure: {
    className: 'BrowserHistory',
    requiredMethods: [
      'BrowserHistory(String homepage)',
      'void visit(String url)',
      'String back(int steps)',
      'String forward(int steps)'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 54321,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 100 : 5000;
            
            BrowserHistory obj = new BrowserHistory("start.com");
            java.util.ArrayList<String> refHistory = new java.util.ArrayList<>();
            refHistory.add("start.com");
            int curr = 0;

            boolean pass = true;
            String firstMismatchAct = "[]";
            String firstMismatchExp = "[]";

            for (int k = 0; k < opsCount; k++) {
                int type = rng.nextInt(10);
                
                if (type < 4) { // Visit (40%)
                    String url = "url" + rng.nextInt(10000) + ".com";
                    
                    // ref visit
                    while (refHistory.size() > curr + 1) {
                        refHistory.remove(refHistory.size() - 1);
                    }
                    refHistory.add(url);
                    curr++;
                    
                    // actual
                    obj.visit(url);
                } else if (type < 7) { // back (30%)
                    int steps = rng.nextInt(50) + 1;
                    
                    curr = Math.max(0, curr - steps);
                    String expUrl = refHistory.get(curr);
                    String actUrl = obj.back(steps);
                    
                    if (!expUrl.equals(actUrl)) {
                        pass = false;
                        firstMismatchAct = "[" + actUrl + "]";
                        firstMismatchExp = "[" + expUrl + "]";
                        break;
                    }
                } else { // forward (30%)
                    int steps = rng.nextInt(50) + 1;
                    
                    curr = Math.min(refHistory.size() - 1, curr + steps);
                    String expUrl = refHistory.get(curr);
                    String actUrl = obj.forward(steps);
                    
                    if (!expUrl.equals(actUrl)) {
                        pass = false;
                        firstMismatchAct = "[" + actUrl + "]";
                        firstMismatchExp = "[" + expUrl + "]";
                        break;
                    }
                }
            }
            System.out.println("AJ|test-" + i + "|" + pass + "|" + firstMismatchAct + "|" + firstMismatchExp);
        }`
    }
  }
});
