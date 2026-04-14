# ExerciseSchema.md
## algo-journey — Exercise definition, metadata, and evaluation contract

Version: 1.2  
Status: Implemented — 15 exercises authored, schema validated  
Repository: `algo-journey`

---

## 1. Purpose

This document defines how programming exercises should be represented in `algo-journey`.

The schema has two jobs at the same time:

1. describe the learner-facing problem clearly
2. give the browser runner enough information to evaluate the learner’s code consistently

This is important because the project is not just a runner. It is a practice platform with:

- topic and difficulty organization
- LeetCode-style problem solving
- immediate browser-side judging
- local progress tracking
- open-source content contribution

A content author should be able to add new exercises mostly by editing data files, not by changing runner code.

---

## 2. Design principles

### 2.1 Product-first schema

An exercise file must support what the learner sees, not only what the runner needs.

### 2.2 Stable metadata

Topic, difficulty, title, and identifiers must stay stable because catalog pages and local progress depend on them.

### 2.3 Runner-neutral content

Adding new exercises should not require editing compile or runtime internals.

### 2.4 Hidden evaluation stays platform-owned

Hidden harness code and hidden tests must remain separate from learner-editable content.

### 2.5 Deterministic results

Given the same exercise version and test seed, the same learner code should produce the same result.

---

## 3. Required exercise metadata

Every exercise should include learner-facing metadata.

### 3.1 Core identity fields

- `id` — stable internal id
- `slug` — URL-friendly identifier
- `title` — display title
- `version` — schema/content version

### 3.2 Catalog fields

- `topic` — primary topic used for organization
- `difficulty` — learner-facing difficulty label
- `tags` — optional finer-grained labels
- `estimatedMinutes` — approximate solve time for learning flow
- `order` — optional recommended position in a topic path

### 3.3 Content summary fields

- `summary` — short card description
- `learningGoals` — what this exercise teaches
- `prerequisites` — optional prerequisite topics or skills

### 3.4 Evaluation mode field

- `mode` — one of:
  - `main_program`
  - `function_implementation`
  - `class_implementation`

---

## 4. Learner-facing content fields

Every exercise should define what appears on screen.

### 4.1 Statement block

- `statement`
- `constraints`
- `notes` (optional)

### 4.2 Examples block

Examples should help the learner understand expected behavior.

Recommended fields:

- `input`
- `output`
- `explanation` (optional)

### 4.3 Starter code block

The learner should begin from starter code appropriate for the mode.

Examples:

- a `main` skeleton for intro tasks
- a `Solution` class with one method to implement
- a class skeleton with fields and method stubs

---

## 5. Evaluation contract fields

These fields control how the runner evaluates the submission.

### 5.1 Editable files

The schema must define which files the learner can edit.

Examples:

- `Solution.java`
- `Main.java`
- `Counter.java`

### 5.2 Hidden files

The schema may define platform-owned files such as:

- harness files
- generated tests
- adapters
- helper assertions

### 5.3 Structural requirements

Optional requirements checked before or during compile:

- required class name
- required method name
- required signature
- whether extra public classes are allowed

### 5.4 Limits

Recommended runtime limits:

- `timeLimitMs`
- `outputLimitBytes`
- `maxVisibleTests`
- `maxHiddenTests`

---

## 6. Supported exercise modes

### 6.1 `main_program`

Learner writes a complete program.

Use this for:

- early lessons
- input/output
- simple loops and conditionals

Evaluation style:

- run program
- capture stdout
- compare text output

### 6.2 `function_implementation`

Learner implements a function or method body.

Use this for:

- algorithm practice
- LeetCode-style exercises
- deterministic hidden testing

Evaluation style:

- platform harness constructs input values
- harness calls learner method directly
- result comparator validates returned value

This should be the default and most common V1 mode.

### 6.3 `class_implementation`

Learner implements a class.

Use this for:

- OOP basics
- encapsulation exercises
- stateful behaviors

Evaluation style:

- harness creates objects
- harness calls methods in sequence
- comparator checks final behavior and outputs

---

## 7. Recommended metadata taxonomies

### 7.1 Topic values for V1

Suggested stable topic values:

- `arrays`
- `strings`
- `loops`
- `conditionals`
- `recursion`
- `searching`
- `sorting`
- `math`
- `classes`
- `collections`

More can be added later, but the initial set should remain simple.

### 7.2 Difficulty values for V1

Use a simple learner-friendly set:

- `easy`
- `medium`
- `hard`

Avoid too many levels in V1.

### 7.3 Tag examples

Tags may include finer detail such as:

- `two-pointers`
- `simulation`
- `hash-map`
- `array-traversal`
- `constructor`
- `string-builder`

---

## 8. Result model

The runtime should normalize evaluation into a standard result shape.

Recommended top-level fields:

- `problemId`
- `exerciseVersion`
- `status`
- `elapsedMs`
- `compileDiagnostics`
- `runtimeError`
- `tests`
- `stdout`

Recommended `status` values:

- `accepted`
- `wrong_answer`
- `compile_error`
- `runtime_error`
- `time_limit_exceeded`
- `platform_error`

Each test entry should ideally include:

- `name`
- `visibility` (`visible` or `hidden`)
- `status`
- `inputPreview` (only when safe)
- `expectedPreview` (optional)
- `actualPreview` (optional)
- `message` (optional)

---

## 9. Local progress dependencies

Because the product stores progress locally, some exercise fields must remain stable across versions.

### 9.1 Stable identity requirement

The following fields should not change casually:

- `id`
- `slug`
- `version`

### 9.2 Why this matters

Local progress and drafts are keyed by exercise identity. If identifiers change without a migration strategy, learners can lose continuity.

### 9.3 Versioning rule

- change `version` when the evaluation logic or starter contract changes materially
- do not change `id` just because wording improved

---

## 10. Suggested JSON structure

```json
{
  "id": "two-sum-basic",
  "slug": "two-sum-basic",
  "version": 1,
  "title": "Two Sum Basic",
  "summary": "Find two indices whose values add up to a target.",
  "topic": "arrays",
  "difficulty": "easy",
  "tags": ["array-traversal", "hash-map"],
  "estimatedMinutes": 15,
  "order": 3,
  "learningGoals": [
    "Use arrays and loops to scan input",
    "Use HashMap for faster lookup"
  ],
  "prerequisites": ["arrays", "loops"],
  "mode": "function_implementation",
  "statement": "Given an integer array and a target, return the indices of two numbers that add up to the target.",
  "constraints": [
    "You may assume exactly one valid answer exists.",
    "Return indices in any order."
  ],
  "examples": [
    {
      "input": "numbers = [2, 7, 11, 15], target = 9",
      "output": "[0, 1]",
      "explanation": "numbers[0] + numbers[1] = 9"
    }
  ],
  "editableFiles": [
    {
      "path": "Solution.java",
      "role": "main",
      "starter": "class Solution {\n    int[] twoSum(int[] numbers, int target) {\n        return new int[]{-1, -1};\n    }\n}\n"
    }
  ],
  "requiredStructure": {
    "className": "Solution",
    "methodName": "twoSum",
    "signature": "int[] twoSum(int[] numbers, int target)"
  },
  "limits": {
    "timeLimitMs": 1000,
    "outputLimitBytes": 32768,
    "maxVisibleTests": 3,
    "maxHiddenTests": 20
  },
  "evaluation": {
    "comparator": "exact_json",
    "visibleTests": [
      {
        "name": "example-1",
        "args": [[2, 7, 11, 15], 9],
        "expected": [0, 1]
      }
    ],
    "hiddenTestStrategy": {
      "type": "generated",
      "generator": "twoSumBasicGeneratorV1",
      "seed": 12345
    }
  }
}
```

---

## 11. Comparator strategies

Comparators should be declared, not hard-coded per exercise.

Recommended initial comparator names:

- `exact_text`
- `trimmed_text`
- `exact_json`
- `unordered_json`
- `numeric_tolerance`
- `custom_named_comparator`

A custom comparator must still be implemented in a platform-owned registry, not inline in untrusted content.

---

## 12. Hidden test strategies

V1 can support more than one style while keeping the public schema simple.

### 12.1 Inline static hidden tests

Useful for small deterministic exercises.

### 12.2 Generated hidden tests

Useful for broader coverage.

Recommended fields:

- generator id
- seed
- count

### 12.3 Solution-backed validation

For some tasks, the platform may compute the expected answer using a trusted reference solution.

This should remain platform-owned.

---

## 13. Authoring rules

### 13.1 Keep statements short and teachable

A learner should understand the task without reading a long contest editorial.

### 13.2 Keep topics and difficulty consistent

Do not use difficulty as a personal opinion. Use stable content rules.

### 13.3 Avoid exercise-specific runner hacks

If an exercise needs special handling, first check whether it belongs in the schema, comparator registry, or generator library.

### 13.4 Prefer function mode first
For V1, most algorithm practice should be written as `function_implementation`.

### 13.5 Prevent array state corruption in Generators
When injecting arrays into learner functions via a `javaGenerator`, always pass cloned arrays: `s.yourMethod(arr.clone())`. If a student uses in-place operations like `Arrays.sort()`, passing the original reference will permanently corrupt the array and break expected validation logic evaluated sequentially afterwards.

### 13.6 Avoid nested interfaces in minimal Classlib
The TeaVM Java Class Library is condensed. It may struggle parsing deeply nested interface locations like `java.util.Map.Entry` natively during runtime code generation without exhaustive imports. Prefer iterating sets via standard logic: `for (Integer key : map.keySet()) { ... }`.

### 13.7 Adjust JavaGenerator lengths to avoid VM Timeouts
If the exercise inherently expects an $O(N^2)$ brute-force solution (like Basic Two Sum or Pairs with Sum), strictly cap array bounds to `< 30,000` integers. Generating 100,000 inputs and executing boxed iteration operations locally inside the JS WebAssembly thread easily exceeds the 5-second `RunWorker` watchdog timeline.

---

## 14. Example: function exercise

```json
{
  "id": "first-index-of",
  "slug": "first-index-of",
  "version": 1,
  "title": "First Index Of",
  "summary": "Return the first index of target in the array.",
  "topic": "arrays",
  "difficulty": "easy",
  "tags": ["linear-search"],
  "estimatedMinutes": 10,
  "mode": "function_implementation",
  "statement": "Return the first index of target in numbers. If target does not appear, return -1.",
  "constraints": [],
  "examples": [
    {
      "input": "numbers = [4, 2, 9, 2], target = 2",
      "output": "1"
    }
  ],
  "editableFiles": [
    {
      "path": "Solution.java",
      "role": "main",
      "starter": "class Solution {\n    int firstIndexOf(int[] numbers, int target) {\n        return -1;\n    }\n}\n"
    }
  ],
  "requiredStructure": {
    "className": "Solution",
    "methodName": "firstIndexOf",
    "signature": "int firstIndexOf(int[] numbers, int target)"
  },
  "limits": {
    "timeLimitMs": 1000,
    "outputLimitBytes": 32768,
    "maxVisibleTests": 2,
    "maxHiddenTests": 10
  },
  "evaluation": {
    "comparator": "exact_json",
    "visibleTests": [
      {
        "name": "example-1",
        "args": [[4, 2, 9, 2], 2],
        "expected": 1
      }
    ]
  }
}
```

---

## 15. Example: class exercise

```json
{
  "id": "simple-counter",
  "slug": "simple-counter",
  "version": 1,
  "title": "Simple Counter",
  "summary": "Implement a counter class with increment and getValue.",
  "topic": "classes",
  "difficulty": "easy",
  "tags": ["constructor", "state"],
  "estimatedMinutes": 15,
  "mode": "class_implementation",
  "statement": "Implement a class Counter with a constructor, increment(), and getValue().",
  "constraints": [],
  "examples": [
    {
      "input": "Counter c = new Counter(5); c.increment(); c.getValue();",
      "output": "6"
    }
  ],
  "editableFiles": [
    {
      "path": "Counter.java",
      "role": "main",
      "starter": "class Counter {\n    Counter(int start) {\n    }\n\n    void increment() {\n    }\n\n    int getValue() {\n        return -1;\n    }\n}\n"
    }
  ],
  "requiredStructure": {
    "className": "Counter",
    "requiredMethods": [
      "Counter(int start)",
      "void increment()",
      "int getValue()"
    ]
  },
  "limits": {
    "timeLimitMs": 1000,
    "outputLimitBytes": 32768,
    "maxVisibleTests": 2,
    "maxHiddenTests": 10
  },
  "evaluation": {
    "comparator": "exact_json",
    "visibleTests": [
      {
        "name": "basic-sequence",
        "operations": [
          ["new", 5],
          ["increment"],
          ["getValue"]
        ],
        "expected": 6
      }
    ]
  }
}
```

---

## 16. Minimum authoring checklist

Before adding a new exercise, confirm:

- id and slug are stable
- topic is from the approved list
- difficulty is from the approved list
- starter code compiles after harness injection
- visible example is correct
- hidden tests are deterministic
- limits are realistic
- the exercise works without changing runner code

---

## 17. Current implementation status

### 17.1 Exercises authored

| Topic | Count | Difficulty |
|---|---|---|
| arrays | 5 | easy |
| strings | 2 | easy |
| loops | 2 | easy |
| conditionals | 1 | easy |
| recursion | 2 | easy |
| searching | 1 | medium |
| sorting | 1 | medium |
| classes | 1 | easy |
| **Total** | **15** | |

### 17.2 Modes implemented

- `function_implementation` — ✅ Fully supported (primary mode)
- `class_implementation` — ✅ Schema supported, 1 exercise authored
- `main_program` — 🔲 Schema ready, no exercises authored yet

### 17.3 Comparators implemented

- `exact_json` — ✅ Used by most exercises
- `unordered_json` — ✅ Used by Two Sum
- `exact_text` — 🔲 Planned
- `trimmed_text` — 🔲 Planned
- `numeric_tolerance` — 🔲 Planned
- `custom_named_comparator` — 🔲 Planned

### 17.4 Data format

Exercises are currently defined as TypeScript objects in `src/content/exercise-registry.ts` and `src/content/catalog-data.ts`. The schema matches the JSON spec in this document. Migration to standalone `.json` files is planned for M4.

Future schema extensions should be added carefully without breaking current content.
