# Agent Guide — Implement `teavm-javac` for Browser-side Java Execution

## 1. Core correction

Do **not** build the main execution path as a regex-based Java-to-JavaScript transpiler.

The intended V1 direction is:

- compile **Java source in the browser**
- generate runnable browser output with TeaVM
- run inside a Worker
- enforce timeout by terminating the Worker

Your job is to implement the real `teavm-javac` pipeline, not a fake Java subset transpiler.

---

## 2. What to build

Implement a minimal but real browser-side Java execution pipeline with these parts:

1. **Compile Worker**
   - loads `compiler.wasm`
   - creates a compiler instance
   - loads SDK/classlib assets
   - receives Java source files
   - compiles them
   - generates WebAssembly output
   - returns diagnostics + wasm bytes

2. **Run Worker**
   - receives wasm bytes
   - loads and runs the compiled output
   - captures console output
   - returns structured execution result

3. **Main-thread coordinator**
   - sends sources to compile worker
   - maps diagnostics to the editor
   - sends compiled output to run worker
   - kills run worker on timeout

---

## 3. Required files/assets

Self-host these assets under a predictable folder such as:

```text
public/vendor/teavm/
├─ compiler.wasm
├─ compiler.wasm-runtime.js
├─ compile-classlib-teavm.bin
└─ runtime-classlib-teavm.bin
```

Do not depend on ad-hoc remote fetching in the main implementation.

---

## 4. Execution model for V1

For each Run:

- take the user code as `Solution.java`
- generate one extra file such as `RunnerMain.java`
- compile both files together
- make `RunnerMain` the entry point
- run `RunnerMain.main(...)`
- print structured result lines
- parse these lines in JavaScript

Do **not** try to solve JS↔Java object marshalling first.

Use generated Java harness code instead.

This is the simplest stable path.

---

## 5. Minimal compile flow

Inside the compile worker:

1. initialize compiler once
2. load SDK/classlib once
3. on each compile:
   - clear previous source files
   - add current source files
   - subscribe to diagnostics
   - call `compile()`
   - if success, call `generateWebAssembly(...)`
   - return wasm output + diagnostics

Important:
- keep the compiler instance alive across runs
- reuse it for faster repeated compiles

---

## 6. Minimal run flow

Inside the run worker:

1. receive wasm bytes
2. load runtime
3. run exported `main([])`
4. capture logs/output
5. return:
   - success/failure
   - stdout logs
   - runtime error if any

Timeout handling must be outside the worker:

- create run worker
- start timer
- terminate worker if timeout is exceeded

Do not rely on measuring time in the main thread without worker termination.

---

## 7. Recommended first milestone

Get this exact scenario working first:

### Input
User code:

```java
class Solution {
    public int firstIndexOf(int[] numbers, int target) {
        for (int i = 0; i < numbers.length; i++) {
            if (numbers[i] == target) return i;
        }
        return -1;
    }
}
```

Generated harness:

```java
public class RunnerMain {
    public static void main(String[] args) {
        Solution s = new Solution();
        runCase("case1", s.firstIndexOf(new int[]{1,2,3}, 2), 1);
        runCase("case2", s.firstIndexOf(new int[]{5,5,5}, 7), -1);
        System.out.println("__AJ_DONE__");
    }

    static void runCase(String id, int actual, int expected) {
        boolean pass = actual == expected;
        System.out.println("AJ_CASE|" + id + "|" + pass + "|" + actual + "|" + expected);
    }
}
```

### Expected behavior
- compile succeeds
- run succeeds
- browser receives structured lines from stdout
- UI shows per-test results

If this works, the pipeline is proven.

---

## 8. Scope boundary for V1

Target only a practical Java subset:

- class declarations
- fields
- constructors
- methods
- primitive types
- arrays
- `String`
- loops and conditions
- recursion
- `List`, `ArrayList`
- `Map`, `HashMap`, `Hashtable`

Avoid spending time on:

- reflection
- class loaders
- threads
- file system
- networking
- arbitrary third-party JARs
- complex runtime interop

---

## 9. Diagnostics and editor integration

Return compiler diagnostics in a structured form:

- source file
- line
- column
- severity
- message
- compiler stage (`javac` or `teavm`)

Map these directly into editor markers.

Do not collapse all failures into a generic “compile failed”.

---

## 10. What not to do

Do not:

- build the main runner around regex Java→JS conversion
- `eval` fake Java as the real product path
- hide compiler/runtime errors
- recreate the compiler from scratch every run
- put execution on the main UI thread
- block progress waiting for “full Java support”

---

## 11. Definition of done for the first real implementation

The first implementation is acceptable when all of the following are true:

- user writes `Solution.java` in the editor
- app generates `RunnerMain.java`
- compile worker compiles both files in browser
- diagnostics are shown in the editor
- wasm output is produced on successful compile
- run worker executes the output
- timeout is enforced by terminating the run worker
- structured per-test results are shown in UI
- no regex Java-to-JS transpiler is used in the main path

---

## 12. Suggested implementation order

1. asset loading
2. compile worker initialization
3. compile one hardcoded Java file
4. compile two files: `Solution.java` + `RunnerMain.java`
5. return diagnostics
6. generate wasm output
7. run wasm in a dedicated worker
8. capture stdout
9. timeout termination
10. wire into editor + Run button
11. parse structured result lines
12. generalize harness generation

---

## 13. Final instruction

Use `teavm-javac` as the real engine.

If something feels difficult, do **not** fall back to writing a fake Java transpiler unless it is explicitly marked as a temporary mock and kept outside the main execution path.

---

## 14. OOP Class Implementations (Lessons Learned)

When implementing complex `class_implementation` exercises (like tracking OOP states or Linked Lists) with heavy stress testing using `javaGenerator`, keep these critical constraints in mind:

1. **WASM Garbage Collection Freezes**: 
   When running test bounds > 10,000 operations, avoid iterative string concatenation inside the Java WebAssembly environment. For example, doing `actual.toString()` repeatedly on an `ArrayList` with 20,000 strings generates 600k+ String objects. Wasm GC cannot keep up and causes `Time Limit Exceeded (1000ms)`! 
   *Fix: Calculate pass/fail inside the Wasm pure Java natively using `Math.abs(expected - actual) < 1e-5` or `expected.equals(actual)` and only stringify exactly the mismatching element, never the entire massive queue log.*

2. **Array Stringification Differences (JS vs Java)**: 
   In `harness-generator.ts`, `String([1, 2])` results in `"1,2"`. However, Java's `List.toString()` outputs `"[1, 2]"`. 
   *Fix: Always use a custom JS stringifier (`javaStringify`) for the `expected` arrays to ensure arrays and subarrays are wrapped in `[]` so that `Comparator: exact_json` perfectly aligns Java output against JS expectation.*

3. **Double Stringification Differences**:
   JS stringifies `1.0` as `"1"`. Java's `String.valueOf(1.0)` is `"1.0"`. 
   *Fix: The harness generator overrides double stringing with `String.valueOf(x).endsWith(".0") ? substring(0, length - 2) : ...` to forcefully clip trailing `.0` in TeaVM before stdout.*

4. **Nested Interfaces Bug (`Map.Entry`)**:
   Deeply nested interfaces occasionally fail to link natively without heavy explicit class imports in TeaVM minimal mode. E.g., overriding `removeEldestEntry(Map.Entry eldest)` in `LinkedHashMap` throws `cannot find symbol: class Entry`.
   *Fix: Bypass nested interfaces if possible. For LRU cache tracking, grab `map.keySet().iterator().next()` to manual-find the eldest key and `.remove()` it.*

5. **Inline Template String Escapes**:
   Beware of Markdown ticks inside JS template literals in `.exercise.ts`. Writing \` \`+\` \` inside a \`\` \` \`\` block halts ESBuild instantly! Always escape them like `\+\` to prevent bundling crashes on the local dev server.
