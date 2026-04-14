# algo-journey

Practice programming problems in a **LeetCode-style experience**, directly in your browser.

`algo-journey` is an open-source learning platform for **students and educators**. Learners pick a problem, write code, click **Run**, and see results immediately — with **basic Java** checked entirely on the browser, without requiring a backend judge.

---

## What learners can do

- Solve common programming exercises in a familiar online-judge style
- Practice by **topic** and **difficulty**
- See **compile errors, runtime errors, and test results instantly**
- Track progress locally in the browser
- Learn step by step without a heavy setup

---

## What makes this project different

### Browser-side judging
For V1, code checking for **basic Java** runs fully in the browser.

That means:
- faster feedback
- simpler deployment
- lower infrastructure cost
- no backend judge required for core practice

### Built for learning
This project is not trying to be a full Java IDE.
It is designed to help students practice:
- algorithms
- problem solving
- core programming logic
- introductory object-oriented programming

### Open source and extensible
`algo-journey` is built to be easy to grow.
Future contributors can extend it with:
- more exercises
- better hints and feedback
- teacher workflows
- saved submissions
- cloud sync
- more languages
- optional hybrid backend execution

---

## Planned learner experience

1. Open a problem
2. Read the statement
3. Write code in the browser
4. Click **Run**
5. See the result immediately
6. Continue learning with progress saved locally

---

## V1 scope

The first version focuses on:

- **basic Java**
- common algorithm exercises
- LeetCode-style practice flow
- browser-based judging
- problem organization by topic and difficulty
- local progress tracking

Planned Java support includes common beginner-friendly features such as:

- classes
- methods
- arrays
- strings
- loops
- recursion
- `List`
- `ArrayList`
- `Map`
- `HashMap`
- `Hashtable`

---

## Who this is for

### Students
A lightweight place to practice programming and see results quickly.

### Teachers
A practical platform for classroom exercises and guided self-study.

### Contributors
An open-source foundation for browser-based coding education.

---

## Project direction

`algo-journey` starts with a clear and practical goal:

> Help students practice common programming problems in a browser-first environment with immediate feedback.

From there, it can grow into a richer open-source learning platform.

---

## Technical foundation

The current V1 direction uses open-source browser-first tooling:

- **Monaco Editor**
- **Tree-sitter**
- **teavm-javac**
- **TeaVM**
- **Web Workers**

These tools make it possible to support browser-based Java practice without depending on a traditional server-side judge for the first version.

---

## File Structure & Docs

- `scripts/` — administrative utilities for catalog arrangement and automation
- `docs/Architecture.md` — system architecture and product boundaries
- `docs/Tasks.md` — implementation phases and tracking
- `docs/ExerciseSchema.md` — exercise format and evaluation schema

---

## Contributing

If you care about programming education, browser tooling, or open-source learning platforms, this project is built to be easy to understand and extend.

Contributions are welcome.
