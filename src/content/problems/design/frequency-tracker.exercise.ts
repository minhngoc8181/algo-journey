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
            
            boolean pass = true;
            String firstMismatchAct = "[]";
            String firstMismatchExp = "[]";

            for (int k = 0; k < opsCount; k++) {
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
                    
                    if (expectedAns != actualAns) {
                        pass = false;
                        firstMismatchAct = "[hasFreq " + param + " -> " + actualAns + "]";
                        firstMismatchExp = "[hasFreq " + param + " -> " + expectedAns + "]";
                        break;
                    }
                }
            }
            System.out.println("AJ|test-" + i + "|" + pass + "|" + firstMismatchAct + "|" + firstMismatchExp);
        }`
    }
  }
});
