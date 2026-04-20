import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'student-grading-strategy',
  version: 1,
  title: 'Student Grading - Strategy Pattern',
  summary: 'Define a family of grading algorithms, encapsulate each one, and make them interchangeable using the Strategy Pattern.',
  topic: 'design',
  difficulty: 'easy',
  tags: ['design', 'strategy-pattern', 'polymorphism', 'cse202'],
  estimatedMinutes: 20,
  order: 459,
  mode: 'class_implementation',
  hints: [
    'Define the `GradingPolicy` interface with a single method `String calculateGrade(int[] scores)`.',
    'Each grading policy class should implement this method according to its specific formula.',
    'The `Course` class maintains a reference to a `GradingPolicy` and delegates the `grade()` calculation to it.'
  ],

  learningGoals: [
    'Implement the Strategy Pattern to allow runtime swapping of algorithms',
    'Encapsulate business logic into independent strategy classes',
    'Avoid embedding multiple formulas inside a single context class'
  ],
  statement: `You are building a learning management system where different courses have different ways of calculating a student's final grade. 

Use the **Strategy Pattern** to separate the grading calculations from the \`Course\` class itself.

**Interface:**
- \`GradingPolicy\`
  - \`String calculateGrade(int[] scores)\`

**Concrete Strategies (each implements \`GradingPolicy\`):**
- \`AverageGradingPolicy\` — calculates the integer average of the scores (sum / count) and returns \`"Average: {avg}"\`. Returns \`"No scores"\` if the array is empty.
- \`HighestScoreGradingPolicy\` — finds the maximum score in the array and returns \`"Highest: {max}"\`. Returns \`"No scores"\` if the array is empty.
- \`PassFailGradingPolicy\` — calculates the integer average. If average >= 50, returns \`"Pass"\`, otherwise returns \`"Fail"\`. Also returns \`"Fail"\` if the array is empty.

**Context class:**
- \`Course()\`
  - \`void setGradingPolicy(GradingPolicy policy)\` — Sets the grading strategy.
  - \`String grade(int[] scores)\` — Calculates the grade using the current policy. If no policy has been set, returns \`"No policy set"\`.`,
  constraints: [
    'The \`scores\` array may be empty but will not be null in visible tests.',
    'Scores are integers between 0 and 100.',
    'At most \`1000\` operations will be performed.'
  ],
  examples: [
    {
      input: `Course course = new Course();
int[] scores = new int[]{40, 60, 50};

course.grade(scores);                                // return "No policy set"

course.setGradingPolicy(new AverageGradingPolicy());
course.grade(scores);                                // return "Average: 50"

course.setGradingPolicy(new PassFailGradingPolicy());
course.grade(scores);                                // return "Pass"

course.setGradingPolicy(new HighestScoreGradingPolicy());
course.grade(scores);                                // return "Highest: 60"`,
      output: '[null, null, "No policy set", null, "Average: 50", null, "Pass", null, "Highest: 60"]'
    }
  ],

  starter: {
    file: 'Course.java',
    code: `interface GradingPolicy {
    String calculateGrade(int[] scores);
}

class AverageGradingPolicy {
}

class HighestScoreGradingPolicy {
}

class PassFailGradingPolicy {
}

class Course {

    public Course() {
        
    }

    public void setGradingPolicy(GradingPolicy policy) {
        
    }

    public String grade(int[] scores) {
        return "";
    }
}`,
  },

  requiredStructure: {
    className: 'Course',
    requiredMethods: [
      'Course()',
      'void setGradingPolicy(GradingPolicy policy)',
      'String grade(int[] scores)'
    ],
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 88112233,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 10 : 50;
            Course obj = new Course();

            int currentPolicy = -1; // -1: none, 0: avg, 1: highest, 2: pf

            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int type = rng.nextInt(2);

                if (type == 0) { // setPolicy
                    int p = rng.nextInt(3);
                    GradingPolicy policy;
                    if (p == 0) { policy = new AverageGradingPolicy(); currentPolicy = 0; }
                    else if (p == 1) { policy = new HighestScoreGradingPolicy(); currentPolicy = 1; }
                    else { policy = new PassFailGradingPolicy(); currentPolicy = 2; }
                    
                    obj.setGradingPolicy(policy);
                } else { // grade
                    int len = rng.nextInt(10);
                    int[] scores = new int[len];
                    int sum = 0;
                    int max = -1;
                    for (int j = 0; j < len; j++) {
                        scores[j] = rng.nextInt(101);
                        sum += scores[j];
                        if (scores[j] > max) max = scores[j];
                    }

                    String expectedAns;
                    if (currentPolicy == -1) {
                        expectedAns = "No policy set";
                    } else if (len == 0) {
                        if (currentPolicy == 0 || currentPolicy == 1) expectedAns = "No scores";
                        else expectedAns = "Fail";
                    } else {
                        int avg = sum / len;
                        if (currentPolicy == 0) expectedAns = "Average: " + avg;
                        else if (currentPolicy == 1) expectedAns = "Highest: " + max;
                        else expectedAns = (avg >= 50) ? "Pass" : "Fail";
                    }

                    String actualAns = obj.grade(scores);

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
