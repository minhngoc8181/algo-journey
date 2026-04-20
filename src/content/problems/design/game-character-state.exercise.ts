import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'game-character-state',
  version: 1,
  title: 'Game Character - State Pattern',
  summary: 'Implement a character whose behavior changes entirely depending on its current state without using long if-else chains.',
  topic: 'design',
  difficulty: 'easy',
  tags: ['design', 'state-pattern', 'polymorphism', 'cse202'],
  estimatedMinutes: 20,
  order: 457,
  mode: 'class_implementation',
  hints: [
    'Define the `CharacterState` interface with `move()` and `attack()` returning `String`.',
    'Create the four concrete state classes. They simply return the corresponding hardcoded strings.',
    'The `GameCharacter` initializes its state to `new NormalState()` in its constructor.',
    'When `move()` or `attack()` is called on the `GameCharacter`, it delegates the call to its internal `CharacterState` reference.'
  ],

  learningGoals: [
    'Implement the State Pattern to alter object behavior dynamically',
    'Eliminate complex state-checking conditionals (if-else/switch)',
    'Separate state-specific behaviors into designated wrapper classes'
  ],
  statement: `You are developing an RPG game. The main character has multiple statuses (states) that completely alter how they move and attack. Instead of using complex \`if-else\` blocks inside the character class, use the **State Pattern** to isolate these behaviors.

**Interface:**
- \`CharacterState\`
  - \`String move()\`
  - \`String attack()\`

**Concrete States (each implements \`CharacterState\`):**
Implement the methods in each state to return EXACTLY the following strings:
- \`NormalState\`
  - move: \`"Walking normally"\`
  - attack: \`"Attacking normally"\`
- \`PoisonedState\`
  - move: \`"Walking slowly and losing health"\`
  - attack: \`"Attacking weakly"\`
- \`StunnedState\`
  - move: \`"Cannot move while stunned"\`
  - attack: \`"Cannot attack while stunned"\`
- \`SpeedBoostState\`
  - move: \`"Running very fast"\`
  - attack: \`"Attacking quickly"\`

**Context class:**
- \`GameCharacter()\` — By default, the character starts in the \`NormalState\`.
- \`void setState(CharacterState state)\` — Changes the character's active state.
- \`String move()\` — Delegates to the current state.
- \`String attack()\` — Delegates to the current state.`,
  constraints: [
    'States can be switched infinitely many times.',
    'At most \`1000\` calls will be made in total.'
  ],
  examples: [
    {
      input: `GameCharacter hero = new GameCharacter();
hero.move();           // return "Walking normally"
hero.setState(new StunnedState());
hero.attack();         // return "Cannot attack while stunned"
hero.setState(new SpeedBoostState());
hero.move();           // return "Running very fast"`,
      output: '[null, "Walking normally", null, "Cannot attack while stunned", null, "Running very fast"]'
    }
  ],

  starter: {
    file: 'GameCharacter.java',
    code: `interface CharacterState {
    String move();
    String attack();
}

class NormalState {
}

class PoisonedState {
}

class StunnedState {
}

class SpeedBoostState {
}

class GameCharacter {

    public GameCharacter() {
        
    }
    
    public void setState(CharacterState state) {
        
    }
    
    public String move() {
        return "";
    }
    
    public String attack() {
        return "";
    }
}`,
  },

  requiredStructure: {
    className: 'GameCharacter',
    requiredMethods: [
      'GameCharacter()',
      'void setState(CharacterState state)',
      'String move()',
      'String attack()'
    ],
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 87693021,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 20 : 150;
            GameCharacter obj = new GameCharacter();

            // Reference tracking
            String currState = "Normal";

            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int type = rng.nextInt(3);

                if (type == 0) { // setState
                    int st = rng.nextInt(4);
                    CharacterState newState;
                    if (st == 0) { newState = new NormalState(); currState = "Normal"; }
                    else if (st == 1) { newState = new PoisonedState(); currState = "Poisoned"; }
                    else if (st == 2) { newState = new StunnedState(); currState = "Stunned"; }
                    else { newState = new SpeedBoostState(); currState = "SpeedBoost"; }
                    
                    obj.setState(newState);
                } else if (type == 1) { // move
                    String expectedAns;
                    if (currState.equals("Normal")) expectedAns = "Walking normally";
                    else if (currState.equals("Poisoned")) expectedAns = "Walking slowly and losing health";
                    else if (currState.equals("Stunned")) expectedAns = "Cannot move while stunned";
                    else expectedAns = "Running very fast";

                    String actualAns = obj.move();

                    expTrace.add(expectedAns);
                    actTrace.add(actualAns);
                } else { // attack
                    String expectedAns;
                    if (currState.equals("Normal")) expectedAns = "Attacking normally";
                    else if (currState.equals("Poisoned")) expectedAns = "Attacking weakly";
                    else if (currState.equals("Stunned")) expectedAns = "Cannot attack while stunned";
                    else expectedAns = "Attacking quickly";

                    String actualAns = obj.attack();

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
