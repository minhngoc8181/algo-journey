# Algo Journey

> A hands-on programming practice platform for university courses — built to help students learn programming through fast feedback, reflection, and deliberate practice, and to help educators author high-quality exercises with AI-assisted but rigorously verified workflows.

---

## What is Algo Journey?

**Algo Journey** is an open-source coding practice platform designed for Java programming courses at the university level. It covers a broad curriculum — from classic algorithms and data structures to object-oriented design and Design Patterns — presented in a clean, interactive interface that runs entirely in the browser.

Students write, run, and get results immediately. No setup. No login. No waiting.

The deeper goal is not just convenience. It is to support a more scientific way of learning programming: make an attempt, observe concrete feedback, inspect failure, refine the mental model, and try again. On the educator side, the same philosophy leads to a different requirement: exercises must be auditable, measurable, and strong enough that student progress is driven by real understanding rather than weak or misleading tests.

The project is now evolving in two parallel directions:
- **Student-side AI assistance** — prompt-based support through **Ask AI** on each problem and **AI Progress** on the catalog page, designed to strengthen reasoning, reflection, and self-correction
- **Educator-side AI-assisted exercise authoring** — a structured content pipeline for drafting, verifying, and expanding exercises with AI support under instructor control

---

## Quick Start

```bash
npm install
npm run dev
```

This starts the local app and authoring environment. Build the production bundle with:

```bash
npm run build
```

---

## For Students

The student experience is designed around deliberate practice. The goal is not to remove challenge; it is to make challenge more visible, more interpretable, and more productive.

- **Write code, see results instantly** — browser-based Java execution with compile errors, runtime errors, and test output shown in real time
- **Learn through guided thinking, not answer dumping** — use **Ask AI** to generate structured prompts for hints, debugging, explanation, or review, so support arrives in stages and still pushes students to reason, inspect their own code, test ideas, and discover the next step themselves
- **Build metacognition, not just momentum** — use **AI Progress** to turn browser-stored solving history into a reflective prompt that helps students identify patterns, monitor strengths and weaknesses, and choose what to practice next with more intention
- **Practice by topic and difficulty** — algorithms, data structures, OOP, Design Patterns, and more
- **Learn at your own pace** — progress, drafts, and submission history are stored locally in the browser, so students can revisit attempts, compare outcomes, and pick up where they left off without an account system
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

Algo Journey is more than a student-facing tool. It includes a full **instructor-side framework** for creating, verifying, and quality-controlling exercises — built for educators who want assignments that genuinely reward understanding, expose misconceptions, and produce trustworthy feedback.

### AI-Assisted Exercise Authoring

This is a core direction of the project, not a side feature. The role of AI here is deliberately constrained: it accelerates drafting and iteration, while correctness, auditability, and final approval remain with the instructor and are enforced through a deterministic verification pipeline.

That constraint is part of the pedagogy. If the platform is meant to train students through meaningful feedback, then the exercises themselves must be well-designed, the reference solutions must be trustworthy, and the tests must be strong enough to distinguish shallow pattern-matching from genuine understanding.

Each exercise is defined in a structured TypeScript schema (`.exercise.ts` + `.gen.ts` + `.solution.java`) that separates:
- **Problem statement and constraints**
- **Test case generation** (both static and randomized stress tests)
- **Reference solution** for ground-truth validation

This schema is designed to be drafted with AI assistance, then verified and committed by the instructor. The separation of concerns makes it easy to audit, update, and expand the exercise library systematically, while keeping the final artifact understandable to humans rather than opaque to them.

In practice, that gives educators a repeatable workflow:
- Draft or refine the problem statement with AI
- Encode the exercise in a reviewable schema
- Verify the reference solution and generated tests
- Measure coverage and detect weak tests before publishing

### Educator Commands

The core educator workflow is available directly from the project root:

```bash
# Start the local authoring UI
npm run dev

# Validate the app still builds
npm run build

# Catch common exercise authoring mistakes
npm run lint:exercises

# Generate standalone Java packages for PC Judge
npm run pc-judge:all
npm run pc-judge <slug>

# Verify reference solutions and generators
npm run pc-judge:verify verify-refs
npm run pc-judge:verify verify-refs "slug1;slug2"
npm run pc-judge:verify -- verify-refs "--tags=cse202"

# Clean generated runtime artifacts
npm run pc-judge:verify clean

# Measure JaCoCo coverage for the generated test suites
npm run pc-judge:coverage
npm run pc-judge:coverage -- "--tags=cse202"
```

For day-to-day authoring and verification, these commands are enough without needing to dig into the implementation details. Advanced catalog-maintenance utilities remain documented separately in `scripts/README.md`.

### PC Judge — Offline Grading Toolkit

For in-class or exam scenarios where students submit `.java` files directly, the **PC Judge** system converts any exercise into a self-contained grading package that runs with a single command:

```bash
javac Runner.java StudentFile.java
java Runner
```

Each package includes a test harness (`Runner.java`), a reference solution, and automated grading scripts. No internet. No backend. Just JDK.

### Quality Control Pipeline

A set of CLI tools keeps the exercise library honest. The commands above are the operational entry points; the value of this pipeline is that it turns exercise quality into something measurable instead of subjective.

That matters because weak exercises do not just lower assessment quality; they also distort student learning. If tests are shallow, repetitive, or incomplete, students are rewarded for brittle tactics instead of robust reasoning. The pipeline exists to prevent that.

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

Contributions are especially valuable when they strengthen one of the project's two core bets: helping students learn through evidence, reflection, and iteration, or helping educators publish exercises whose quality can be inspected and defended.

Contributions welcome — new exercises, new Design Pattern problems, UI improvements, or enhancements to the instructor toolchain.
