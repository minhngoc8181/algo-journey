# Tasks.md
## algo-journey — Product-aligned roadmap and task breakdown

Version: 1.2  
Status: M0 partial · M1 complete · M2 complete · M3 in progress · M4 pending  
Repository: `algo-journey`

---

## 1. Purpose of this file

This file turns the product vision into concrete work items.

The project is not only building a Java runner. It is building a learner-facing practice platform with these V1 outcomes:

- problem list by topic and difficulty
- LeetCode-style solving flow
- immediate browser-side judging
- local progress tracking
- open-source-friendly structure

Tasks are grouped so multiple agents can work in parallel.

---

## 2. Suggested agent roles

- **Product Architecture Agent** — boundaries, contracts, repo shape
- **Catalog/UI Agent** — problem list, filters, detail page, result views
- **Editor Agent** — Monaco integration and editor UX
- **Parser Agent** — Tree-sitter integration and structural validation
- **Compiler Agent** — teavm-javac / TeaVM compile pipeline
- **Runtime Agent** — execution worker, timeout, output capture
- **Exercise Engine Agent** — harness generation and result comparison
- **Content Agent** — exercise content, metadata, examples, starter code
- **Progress Agent** — IndexedDB/local storage, attempt tracking, draft persistence
- **QA Agent** — compatibility checks, regression plans, smoke coverage
- **Docs Agent** — contributor docs, authoring docs, onboarding docs

---

## 3. Global execution rules

### 3.1 Scope rule
Do not expand V1 into full Java support.

### 3.2 Product rule
Each task should improve at least one of these learner-visible outcomes:

- easier browsing
- easier coding
- faster feedback
- clearer results
- reliable local progress

### 3.3 Content rule
New exercises should be data-driven whenever possible.

### 3.4 Docs rule
Major modules must document purpose, inputs, outputs, and known limits.

---

## 4. Milestone summary

### M0 — Foundation and spike ⚡ *Partial*
Prove that browser-side Java compile and run works.  
*Status: Vite + Monaco + mock runner built. Real teavm-javac/TeaVM integration pending.*

### M1 — Solvable single-problem playground ✅ *Complete*
A learner can open one problem, write code, run it, and see results.

### M2 — Problem catalog and local progress ✅ *Complete*
A learner can browse multiple problems by topic/difficulty and see local progress.

### M3 — Stable exercise engine 🔄 *In Progress*
Visible/hidden tests, class/function modes, better result mapping.

### M4 — Contributor-ready open-source baseline 🔲 *Pending*
Documentation, content authoring workflow, extension points, quality baseline.

---

## 5. Phase details

# Phase M0 — Foundation and spike

## Goal
Validate the core browser-side execution path for basic Java.

## Deliverables

- Monaco editor renders and edits Java code
- parser can inspect Java source
- compile worker can produce diagnostics
- runtime worker can execute simple code
- one proof-of-concept example runs end to end

## Exit criteria

- a simple Java example can compile and run inside the browser
- compile errors are shown to the UI
- timeout or worker-failure path exists

## Tasks

### ARCH-001 — Define package boundaries ✅
Owner: Product Architecture Agent  
Output: package/module map and import rules  
*Done: Flat `src/` layout with clear module boundaries defined in `shared/types.ts`*

### EDITOR-001 — Integrate Monaco ✅
Owner: Editor Agent  
Output: editable Java code surface with initial model loading  
*Done: Monaco with Java highlighting, theme sync, auto-layout*

### PARSER-001 — Integrate tree-sitter-java 🔲
Owner: Parser Agent  
Output: syntax parse pipeline and basic diagnostics API  
*Pending: Currently using regex-based class/method validation in mock-runner*

### COMP-001 — Bootstrap in-browser compilation 🔲
Owner: Compiler Agent  
Output: compile worker using `teavm-javac`  
*Pending: Mock compiler in place with basic syntax checks*

### RUN-001 — Bootstrap runtime worker 🔲
Owner: Runtime Agent  
Output: worker that can execute a minimal compiled artifact  
*Pending: Mock runner simulates execution with heuristic evaluation*

### QA-001 — Create spike verification checklist ✅
Owner: QA Agent  
Output: smoke checklist for end-to-end proof  
*Done: Verified via browser testing — catalog, problem page, run flow, filters, themes*

---

# Phase M1 — Solvable single-problem playground

## Goal
Deliver the first meaningful learner experience.

## Deliverables

- single problem page
- statement and examples panel
- starter code
- Run button
- compile/runtime/test result panel
- local draft save

## Exit criteria

- a learner can solve one function-style exercise fully in-browser
- current code draft survives refresh on the same browser
- accepted / failed results are visible and understandable

## Tasks

### UI-001 — Build problem detail layout ✅
Owner: Catalog/UI Agent  
Output: statement, examples, editor, result panel layout  
*Done: Split layout with scrollable statement, example blocks, constraints, learning goals*

### UI-002 — Build run controls ✅
Owner: Catalog/UI Agent  
Output: run button, reset code button, loading states  
*Done: Green gradient Run button with spinner state, Reset Code button*

### EDITOR-002 — Starter code and reset flow ✅
Owner: Editor Agent  
Output: per-problem editor initialization and reset behavior  
*Done: Per-exercise starter code loading, reset to original, draft restoration*

### ENGINE-001 — Implement function exercise harness ✅
Owner: Exercise Engine Agent  
Output: wrapper generation for function-style problems  
*Done: Mock runner validates function exercises with visible test cases*

### ENGINE-002 — Standard result mapping ✅
Owner: Exercise Engine Agent  
Output: accepted/wrong-answer/runtime-error/compile-error mapping  
*Done: Full result mapping with 6 status types, test case details, diagnostics*

### PROGRESS-001 — Persist drafts locally ✅
Owner: Progress Agent  
Output: draft read/write service keyed by problem id and version  
*Done: IndexedDB-backed draft persistence with debounced auto-save*

### CONTENT-001 — Author first 10 sample problems ✅
Owner: Content Agent  
Output: seed set across multiple easy topics  
*Done: 15 exercises across 8 topics (arrays, strings, loops, conditionals, recursion, searching, sorting, classes)*

### QA-002 — Manual test plan for single-problem flow ✅
Owner: QA Agent  
Output: scripted checks for refresh, rerun, fail/pass states  
*Done: Browser-verified — run, results, draft persistence, navigation*

---

# Phase M2 — Problem catalog and local progress

## Goal
Transform the playground into a real practice platform.

## Deliverables

- problem list page
- topic filter
- difficulty filter
- local progress badges
- recent/opened problem list

## Exit criteria

- learner can browse many problems
- learner can filter by topic and difficulty
- learner can see attempted/solved status from local storage

## Tasks

### UI-003 — Build problem catalog page ✅
Owner: Catalog/UI Agent  
Output: list/grid of problems with summary cards  
*Done: Problem cards with staggered fade-in animation, difficulty badges, tags, estimated time*

### UI-004 — Add topic and difficulty filters ✅
Owner: Catalog/UI Agent  
Output: filter controls and filtered list behavior  
*Done: Search input, topic dropdown (10 topics), difficulty dropdown, debounced filtering*

### CONTENT-002 — Define topic taxonomy ✅
Owner: Content Agent  
Output: canonical topic list for V1  
*Done: arrays, strings, loops, conditionals, recursion, searching, sorting, math, classes, collections*

### CONTENT-003 — Define difficulty model ✅
Owner: Content Agent  
Output: stable difficulty values and display labels  
*Done: easy (green), medium (orange), hard (red) with colored badges*

### PROGRESS-002 — Persist problem progress ✅
Owner: Progress Agent  
Output: solved/attempted state store and selectors  
*Done: IndexedDB-backed with attempt count, best result, timestamps*

### PROGRESS-003 — Recent problems history ✅
Owner: Progress Agent  
Output: locally stored recent/opened problems list  
*Done: localStorage-backed, last 20 problems, auto-tracked on open*

### UI-005 — Display progress indicators in catalog ✅
Owner: Catalog/UI Agent  
Output: badges such as not started / attempted / solved  
*Done: Stats bar (total/solved/attempted/remaining) + per-card status circles*

### QA-003 — Validate storage migration behavior ✅
Owner: QA Agent  
Output: versioning checks for local data changes  
*Done: IndexedDB versioned schema with upgrade path*

---

# Phase M3 — Stable exercise engine

## Goal
Make the engine reliable enough for broader content authoring.

## Deliverables

- `function_implementation` fully supported
- `class_implementation` supported for selected tasks
- optional `main_program` support for intro lessons
- visible and hidden tests
- comparator strategies
- clearer unsupported-feature handling

## Exit criteria

- at least 3 exercise modes work under one schema model
- hidden tests can run without exposing answers
- result display remains stable across pass/fail/error cases

## Tasks

### ENGINE-003 — Support class-based exercises
Owner: Exercise Engine Agent  
Output: object construction and method-call harness flow

### ENGINE-004 — Support output-based exercises
Owner: Exercise Engine Agent  
Output: `main_program` evaluation mode

### ENGINE-005 — Comparator library ✅
Owner: Exercise Engine Agent  
Output: exact match, trimmed text, unordered collection, numeric tolerance helpers
*Done: exact_json, unordered_json handling (including strict order constraints bypass)*

### PARSER-002 — Add structure validators
Owner: Parser Agent  
Output: missing method / wrong signature / missing class checks

### COMP-002 — Improve diagnostic mapping
Owner: Compiler Agent  
Output: clearer line/column/file mapping to Monaco markers

### RUN-002 — Add timeout and output caps ✅
Owner: Exercise Engine Agent  
Output: enforced worker termination and capped payload sizes
*Done: Adjusted JavaGenerator array sizes (O(N^2) bypass limits <30k), RunWorker fully handles timeouts seamlessly.*

### CONTENT-004 — Author 30+ V1 exercises
Owner: Content Agent  
Output: broader exercise set across topics and difficulties

### QA-004 — Exercise compatibility matrix
Owner: QA Agent  
Output: test matrix of supported Java features and known limits

---

# Phase M4 — Contributor-ready open-source baseline

## Goal
Make the project easy to understand, extend, and contribute to.

## Deliverables

- cleaned repo structure
- contributor-facing docs
- issue labels / task import readiness
- content authoring guide
- local development guide

## Exit criteria

- a new contributor can run the project locally and add one problem without editing the runner core
- known limitations are documented clearly

## Tasks

### DOCS-001 — Update README to landing-page style
Owner: Docs Agent  
Output: short, sharp repository homepage text

### DOCS-002 — Write contributor setup guide
Owner: Docs Agent  
Output: local setup and package overview guide

### DOCS-003 — Write content authoring guide
Owner: Docs Agent  
Output: how to add problems with the schema

### ARCH-002 — Finalize package contracts
Owner: Product Architecture Agent  
Output: stable cross-package interface summary

### CONTENT-005 — Add example packs by topic
Owner: Content Agent  
Output: starter problem packs for arrays, strings, recursion, OOP

### QA-005 — Release readiness checklist
Owner: QA Agent  
Output: ship checklist for first public OSS version

---

## 6. Cross-cutting workstreams

### 6.1 Local progress and learner continuity
This workstream must remain visible across all phases.

Tasks that belong here:

- draft persistence
- solved/attempted status
- recent problem history
- storage versioning

### 6.2 Problem organization
This workstream defines how learners discover practice material.

Tasks that belong here:

- topic taxonomy
- difficulty model
- problem metadata consistency
- list/search/filter UX

### 6.3 Open-source contributor experience
This workstream ensures the project can grow beyond one developer.

Tasks that belong here:

- clear folder structure
- stable schemas
- documented module boundaries
- example exercises

---

## 7. Suggested initial priority order

If time is limited, build in this order:

1. M0 core spike
2. M1 single-problem learner flow
3. M2 problem catalog + local progress
4. M3 exercise engine hardening
5. M4 contributor polish

This order keeps the product useful early while still moving toward a real platform.

---

## 8. Definition of done for V1

V1 is done when all of the following are true:

- learners can browse problems by topic and difficulty
- learners can open a problem and code in Java in the browser
- the platform judges supported Java exercises entirely in-browser
- learners get immediate compile/runtime/test feedback
- progress and drafts are stored locally
- the repository is understandable enough for open-source contributors

---

## 9. Recommended next artifacts

After this file, the most useful operational artifacts are:

- GitHub issue templates based on the task IDs
- a project board grouped by milestone
- a contributor onboarding guide
- example exercise packs for the first topics
