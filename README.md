# Algo Journey

> A hands-on programming practice platform for university courses — built for students who want instant feedback, and educators who want rigorous, AI-assisted assessment.

---

## What is Algo Journey?

**Algo Journey** is an open-source coding practice platform designed for Java programming courses at the university level. It covers a broad curriculum — from classic algorithms and data structures to object-oriented design and Design Patterns — presented in a clean, interactive interface that runs entirely in the browser.

Students write, run, and get results immediately. No setup. No login. No waiting.

---

## For Students

- **Write code, see results instantly** — browser-based Java execution with compile errors, runtime errors, and test output shown in real time
- **Practice by topic and difficulty** — algorithms, data structures, OOP, Design Patterns, and more
- **Learn at your own pace** — progress is tracked locally; pick up where you left off
- **Familiar experience** — a clean, distraction-free interface similar to LeetCode or HackerRank

### Curriculum coverage

| Category         | Examples                                           |
|------------------|----------------------------------------------------|
| Algorithms       | Sorting, Binary Search, Prefix Sum, Sliding Window |
| Data Structures  | Stack, Queue, Linked List, Hash Map                |
| OOP & Design     | Polymorphism, Inheritance, Interface               |
| Design Patterns  | Decorator, Observer, Strategy, Factory, Adapter, Command, State |

---

## For Educators

Algo Journey is more than a student-facing tool. It includes a full **instructor-side framework** for creating, verifying, and quality-controlling exercises — built with AI-assisted authoring in mind.

### AI-Assisted Exercise Authoring

Each exercise is defined in a structured TypeScript schema (`.exercise.ts` + `.gen.ts` + `.solution.java`) that separates:
- **Problem statement and constraints**
- **Test case generation** (both static and randomized stress tests)
- **Reference solution** for ground-truth validation

This schema is designed to be drafted with AI assistance, then verified and committed by the instructor. The separation of concerns makes it easy to audit, update, and expand the exercise library systematically.

### PC Judge — Offline Grading Toolkit

For in-class or exam scenarios where students submit `.java` files directly, the **PC Judge** system converts any exercise into a self-contained grading package that runs with a single command:

```bash
javac Runner.java StudentFile.java
java Runner
```

Each package includes a test harness (`Runner.java`), a reference solution, and automated grading scripts. No internet. No backend. Just JDK.

### Quality Control Pipeline

A set of CLI tools keeps the exercise library honest. You can run these commands globally or filter them by slug or tags.

```bash
# 1. Generate standalone Java packages for PC Judge
npm run pc-judge:all                 # Convert all problems
npm run pc-judge <slug>              # Convert specific problem(s)

# 2. Verify Reference Solutions (ensure tests pass 100%)
npm run pc-judge:verify verify-refs                    # Verify all problems
npm run pc-judge:verify verify-refs "slug1;slug2"      # Verify specific problems
npm run pc-judge:verify -- verify-refs "--tags=cse202" # Verify problems by tag

# 3. Clean up generic runtime artifacts (.class, json)
npm run pc-judge:verify clean

# 4. Measure JaCoCo Code Coverage (line, branch, method)
npm run pc-judge:coverage                    # Check coverage for all
npm run pc-judge:coverage -- "--tags=cse202" # Check coverage by tag
```

**Test verification** (`3_report_ref.json`) flags any exercise where the generator logic is broken or the reference solution is wrong — catching authoring errors before students ever see them.

**Code coverage measurement** (`4_report_coverage.json`) uses [JaCoCo](https://www.jacoco.org/) (downloaded automatically — only JDK required) to report exactly which lines and branches of the reference solution the test suite actually exercises:

```
[coffee-decorator] ✓  23/23 pass  |  lines=100%  branches=92.86%  methods=100%
```

Branch coverage below 100% is a concrete signal that the test generator has blind spots — edge cases that exist in the solution but are never tested. This turns qualitative judgment ("are these tests good?") into a measurable, auditable number.

### Suspicious Test Detection

The verification pipeline also flags **statistically weak test suites** — cases where the generator produces repetitive expected outputs (e.g., always returning `false`) that a trivially wrong solution could accidentally pass. These are reported as `POOR_TESTS` warnings in the coverage report.

---

## Technical Foundation

| Layer             | Technology                          |
|-------------------|-------------------------------------|
| Browser editor    | Monaco Editor                       |
| In-browser Java   | TeaVM + teavm-javac + Web Workers   |
| Exercise schema   | TypeScript (`.exercise.ts`, `.gen.ts`) |
| PC Judge harness  | Pure Java (JDK only)                |
| Coverage tooling  | JaCoCo 0.8.13 (auto-downloaded)     |
| Instructor CLI    | Node.js / tsx                       |

---

## Project Structure

```
src/content/problems/     — Exercise definitions (.exercise.ts, .gen.ts, .solution.java)
out/pc-judge/             — Generated PC Judge packages (one folder per exercise)
out/lib/jacoco/           — JaCoCo JARs (auto-downloaded on first coverage run)
scripts/                  — Instructor CLI tools
  generate-pc-judge.ts    — Converts exercises into PC Judge packages
  verify-pc-judge.ts      — Verifies reference solutions (verify-refs, run-starter, clean)
  coverage-refs.ts        — Measures JaCoCo coverage of each exercise's test suite
```

Key reports written to `out/pc-judge/`:

| File | Description |
|------|-------------|
| `1_report_starter.json` | Starter code behavior (does the skeleton compile and run?) |
| `3_report_ref.json`     | Reference solution verification (100% pass check + suspicious test detection) |
| `4_report_coverage.json`| JaCoCo line/branch/method coverage per exercise |

---

## Contributing

If you care about programming education, open-source tooling, or AI-assisted curriculum design, this project is built to be easy to understand and extend.

Contributions welcome — new exercises, new Design Pattern problems, UI improvements, or enhancements to the instructor toolchain.
