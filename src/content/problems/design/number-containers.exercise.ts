import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'number-containers',
  version: 1,
  title: 'Design a Number Container System',
  summary: 'Design a system that tracks numbers by indices and finds the smallest index for a given number.',
  topic: 'design',
  difficulty: 'medium',
  tags: ['hash-table', 'design', 'heap', 'tree', 'cse201'],
  estimatedMinutes: 30,
  order: 446,
  mode: 'class_implementation',

  learningGoals: ['Combine Maps and Priority Queues/Sorted Sets for complex tracking', 'Manage data relations across multiple data structures'],
  statement: `Design a number container system that can do the following:\n\n**Insert** or **Replace** a number at the given index in the system.
- **Return** the smallest index for the given number in the system.

Implement the \`NumberContainers\` class:\n\n- \`NumberContainers()\` Initializes the number container system.
- \`void change(int index, int number)\` Fills the container at \`index\` with the \`number\`. If there is already a number at that \`index\`, replace it.
- \`int find(int number)\` Returns the smallest index for the given \`number\`, or \`-1\` if there is no index that is filled by \`number\` in the system.`,
  constraints: [
    '\`1 <= index, number <= 10^9\`',
    'At most \`10^5\` calls will be made in total to \`change\` and \`find\`. (For this testing environment, up to 10,000)'
  ],
  examples: [
    { 
      input: `NumberContainers nc = new NumberContainers();
nc.find(10); // There is no index that is filled with number 10. Therefore, we return -1.
nc.change(2, 10); // Your container at index 2 will be filled with number 10.
nc.change(1, 10); // Your container at index 1 will be filled with number 10.
nc.change(3, 10); // Your container at index 3 will be filled with number 10.
nc.change(5, 10); // Your container at index 5 will be filled with number 10.
nc.find(10); // Number 10 is at the indices 1, 2, 3, and 5. Since the smallest index that is filled with 10 is 1, we return 1.
nc.change(1, 20); // Your container at index 1 will be filled with number 20. Note that index 1 was filled with 10 and then replaced with 20. 
nc.find(10); // Number 10 is at the indices 2, 3, and 5. The smallest index that is filled with 10 is 2. Therefore, we return 2.`, 
      output: '[null, -1, null, null, null, null, 1, null, 2]'
    },
  ],

  starter: {
    file: 'NumberContainers.java',
    code: `class NumberContainers {

    public NumberContainers() {
        
    }
    
    public void change(int index, int number) {
        
    }
    
    public int find(int number) {
        return -1;
    }
}`,
  },

  requiredStructure: {
    className: 'NumberContainers',
    requiredMethods: [
      'NumberContainers()',
      'void change(int index, int number)',
      'int find(int number)'
    ],
  },

  evaluation: { 
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 9876543,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 200 : 10000;
            
            NumberContainers obj = new NumberContainers();
            java.util.Map<Integer, Integer> indexToNumber = new java.util.HashMap<>();
            java.util.Map<Integer, java.util.TreeSet<Integer>> numberToIndices = new java.util.HashMap<>();
            
            boolean pass = true;
            String firstMismatchAct = "[]";
            String firstMismatchExp = "[]";

            for (int k = 0; k < opsCount; k++) {
                int type = rng.nextInt(3);
                int num = rng.nextInt(100) + 1; // 1-100 to increase collision frequency
                int idx = rng.nextInt(500) + 1;
                
                if (type < 2) { // change
                    // Track expected
                    if (indexToNumber.containsKey(idx)) {
                        int oldNum = indexToNumber.get(idx);
                        if (numberToIndices.containsKey(oldNum)) {
                            numberToIndices.get(oldNum).remove(idx);
                            if (numberToIndices.get(oldNum).isEmpty()) {
                                numberToIndices.remove(oldNum);
                            }
                        }
                    }
                    indexToNumber.put(idx, num);
                    numberToIndices.computeIfAbsent(num, x -> new java.util.TreeSet<>()).add(idx);
                    
                    // Track actual
                    obj.change(idx, num);
                } else { // find
                    // Track expected
                    int expectedAns = -1;
                    if (numberToIndices.containsKey(num) && !numberToIndices.get(num).isEmpty()) {
                        expectedAns = numberToIndices.get(num).first();
                    }
                    
                    // Track actual
                    int actualAns = obj.find(num);
                    
                    if (expectedAns != actualAns) {
                        pass = false;
                        firstMismatchAct = "[find " + num + " -> " + actualAns + "]";
                        firstMismatchExp = "[find " + num + " -> " + expectedAns + "]";
                        break;
                    }
                }
            }
            System.out.println("AJ|test-" + i + "|" + pass + "|" + firstMismatchAct + "|" + firstMismatchExp);
        }`
    }
  }
});
