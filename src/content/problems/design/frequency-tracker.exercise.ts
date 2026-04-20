import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'frequency-tracker',
  version: 1,
  title: 'Frequency Tracker',
  summary: 'Design a data structure that keeps track of the frequencies of added numbers.',
  topic: 'design',
  difficulty: 'medium',
  tags: ['hash-table', 'design', 'cse201'],
  estimatedMinutes: 20,
  order: 445,
  mode: 'class_implementation',
  hints: [
    'Use two tracking maps (either `HashMap` or pre-allocated arrays if constraints are small).',
    'Map 1: `elementFrequency` maps an element to its frequency.',
    'Map 2: `frequencyCount` maps a frequency to how many elements currently have that frequency.',
    'When adding/deleting an element, carefully update its count in the first map AND update the counts in the second map.'
  ],

  learningGoals: ['Maintain bi-directional tracking of states', 'Use multiple hash maps or arrays to answer queries in O(1) time'],
  statement: `Design a data structure that keeps track of the values in it and answers some queries regarding their frequencies.

Implement the \`FrequencyTracker\` class:\n\n- \`FrequencyTracker()\` Initializes the \`FrequencyTracker\` object with an empty array initially.
- \`void add(int number)\` Adds \`number\` to the data structure.
- \`void deleteOne(int number)\` Deletes **one** occurrence of \`number\` from the data structure. The data structure **may not contain** \`number\`, and in this case nothing is deleted.
- \`boolean hasFrequency(int frequency)\` Returns \`true\` if there is a number in the data structure that occurs \`frequency\` number of times, otherwise, it returns \`false\`.`,
  constraints: [
    '\`1 <= number <= 10^5\`',
    '\`1 <= frequency <= 10^5\`',
    'At most \`100,000\` calls will be made to \`add\`, \`deleteOne\`, and \`hasFrequency\`. (For this testing environment, up to 10,000)'
  ],
  examples: [
    { 
      input: `FrequencyTracker ft = new FrequencyTracker();
ft.add(3); // The data structure now contains [3]
ft.add(3); // The data structure now contains [3, 3]
ft.hasFrequency(2); // Returns true, because 3 occurs twice
ft.deleteOne(3); // The data structure now contains [3]
ft.hasFrequency(2); // Returns false, because no number occurs twice
ft.hasFrequency(1); // Returns true, because 3 occurs once`, 
      output: '[null, null, null, true, null, false, true]'
    },
  ],

  starter: {
    file: 'FrequencyTracker.java',
    code: `class FrequencyTracker {

    public FrequencyTracker() {
        
    }
    
    public void add(int number) {
        
    }
    
    public void deleteOne(int number) {
        
    }
    
    public boolean hasFrequency(int frequency) {
        return false;
    }
}`,
  },

  requiredStructure: {
    className: 'FrequencyTracker',
    requiredMethods: [
      'FrequencyTracker()',
      'void add(int number)',
      'void deleteOne(int number)',
      'boolean hasFrequency(int frequency)'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 8888,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 200 : 10000;
            
            FrequencyTracker obj = new FrequencyTracker();
            // Reference arrays since max range is 10^5
            int[] refCounts = new int[100001];
            int[] refFreqs = new int[100001];
            
            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int type = rng.nextInt(3);
                int param = rng.nextInt(100) + 1; // Testing dense ranges forces collisions
                
                if (type == 0) { // add
                    int oldFreq = refCounts[param];
                    if (oldFreq > 0) refFreqs[oldFreq]--;
                    refCounts[param]++;
                    refFreqs[refCounts[param]]++;
                    
                    obj.add(param);
                } else if (type == 1) { // deleteOne
                    int oldFreq = refCounts[param];
                    if (oldFreq > 0) {
                        refFreqs[oldFreq]--;
                        refCounts[param]--;
                        if (refCounts[param] > 0) refFreqs[refCounts[param]]++;
                    }
                    
                    obj.deleteOne(param);
                } else { // hasFrequency
                    boolean expectedAns = refFreqs[param] > 0;
                    boolean actualAns = obj.hasFrequency(param);
                    
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
