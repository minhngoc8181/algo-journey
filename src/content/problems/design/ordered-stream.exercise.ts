import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'ordered-stream',
  version: 1,
  title: 'Design an Ordered Stream',
  summary: 'Design a stream that takes key-value pairs and returns a list of values in strictly increasing order of their IDs.',
  topic: 'design',
  difficulty: 'easy',
  tags: ['array', 'design', 'data-stream', 'cse201'],
  estimatedMinutes: 20,
  order: 443,
  mode: 'class_implementation',
  hints: [
    'Use an array of Strings (size `n + 1`) to store the values.',
    'Keep track of a `ptr` initialized to 1.',
    'When `insert(idKey, value)` is called, store the `value` at `array[idKey]`.',
    'Then, while `ptr <= n` and `array[ptr]` is not null, add `array[ptr]` to your result list and increment `ptr`!'
  ],

  learningGoals: ['Understand states and pointer manipulation', 'Buffering out-of-order data streams'],
  statement: `There is a stream of \`n\` \`(idKey, value)\` pairs arriving in an arbitrary order, where \`idKey\` is an integer between \`1\` and \`n\` and \`value\` is a string. No two pairs have the same \`idKey\`.

Design a stream that returns the values in increasing order of their IDs by returning a chunk (list) of values after each insertion. The concatenation of all the chunks should result in a list of the sorted values.

Implement the \`OrderedStream\` class:\n\n- \`OrderedStream(int n)\` Constructs the stream to take \`n\` values.
- \`List<String> insert(int idKey, String value)\` Inserts the pair \`(idKey, value)\` into the stream, then returns the largest possible chunk of currently inserted values that appear next in the order.`,
  constraints: [
    '\`1 <= n <= 1000\`',
    '\`1 <= idKey <= n\`',
    '\`value\` consists of lowercase English letters.',
    'Each \`idKey\` is inserted exactly once.',
    'At most \`1000\` calls will be made to \`insert\`.'
  ],
  examples: [
    { 
      input: `OrderedStream os = new OrderedStream(5);
os.insert(3, "ccccc"); // return [] (Wait for id 1)
os.insert(1, "aaaaa"); // return ["aaaaa"] (Received 1, pointer moves to 2)
os.insert(2, "bbbbb"); // return ["bbbbb", "ccccc"] (Received 2, prepends to 3, pointer moves to 4)
os.insert(5, "eeeee"); // return [] (Wait for 4)
os.insert(4, "ddddd"); // return ["ddddd", "eeeee"]`, 
      output: '[null, [], ["aaaaa"], ["bbbbb", "ccccc"], [], ["ddddd", "eeeee"]]'
    },
  ],

  starter: {
    file: 'OrderedStream.java',
    code: `import java.util.List;
import java.util.ArrayList;

class OrderedStream {

    public OrderedStream(int n) {
        
    }
    
    public List<String> insert(int idKey, String value) {
        return new ArrayList<>();
    }
}`,
  },

  requiredStructure: {
    className: 'OrderedStream',
    requiredMethods: [
      'OrderedStream(int n)',
      'List<String> insert(int idKey, String value)'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 111222,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            // Because OrderedStream sizes insert exactly N times without duplication, N cap at 10,000 for stress test
            int n = (i < 5) ? 100 : 5000;
            
            OrderedStream obj = new OrderedStream(n);
            
            // Build random insertion order
            java.util.List<Integer> ids = new java.util.ArrayList<>();
            for (int k = 1; k <= n; k++) ids.add(k);
            java.util.Collections.shuffle(ids, rng);
            
            java.util.List<String> refStream = new java.util.ArrayList<>();
            for (int k = 0; k <= n; k++) refStream.add(null);
            int ptr = 1;

            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < n; k++) {
                int traceSizeBefore = expTrace.size();
                int idKey = ids.get(k);
                String val = "v" + idKey;
                
                // Track expected
                refStream.set(idKey, val);
                java.util.List<String> expectedAns = new java.util.ArrayList<>();
                while (ptr <= n && refStream.get(ptr) != null) {
                    expectedAns.add(refStream.get(ptr));
                    ptr++;
                }
                
                // Track actual
                java.util.List<String> actualAns = obj.insert(idKey, val);
                
                if (actualAns == null && expectedAns.isEmpty()) {
                    // Allowed empty mapping
                } else {
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
