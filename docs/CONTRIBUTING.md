# Contributing to algo-journey

Welcome! This guide helps you get started as a contributor to **algo-journey** — a browser-based programming practice platform.

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- A modern browser (Chrome, Firefox, Edge)
- Git

### Setup

```bash
git clone https://github.com/your-org/algo-journey.git
cd algo-journey
npm install
npm run dev
```

Open `http://localhost:5173/` in your browser.

### Project Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npx tsc --noEmit` | TypeScript type check (strict mode) |

---

## Project Architecture

```text
src/
├─ main.ts                    # Application entry point
├─ app/                       # Config, routing
├─ shared/                    # Types, events, DOM utilities
├─ content/                   # Exercise data (catalog + full definitions)
├─ exercise-engine/           # Loading, comparators, structural validation
├─ runner/                    # Execution pipeline (currently mock)
├─ progress/                  # IndexedDB persistence
├─ ui/                        # Vanilla DOM components
│  ├─ app-shell.ts
│  └─ pages/
│     ├─ catalog-page.ts
│     └─ problem-page.ts
└─ styles/                    # Vanilla CSS design system
```

### Key Principles

1. **Vanilla DOM** — No React/Vue/Angular. We use plain TypeScript + CSS.
2. **TypeScript strict mode** — All code must pass `tsc --noEmit` with zero errors.
3. **CSS design tokens** — All colors, spacing, and shadows use CSS custom properties from `variables.css`.
4. **Data-driven exercises** — Adding problems should not require changing engine code.

---

## Adding a New Exercise

This is the most common contribution. You need to edit two files:

### Step 1: Add catalog entry

Edit `src/content/catalog-data.ts` and add a new `CatalogEntry`:

```typescript
{
  id: 'your-problem-id',
  slug: 'your-problem-id',      // URL-friendly, must match id
  title: 'Your Problem Title',
  summary: 'One-line description.',
  topic: 'arrays',              // See Topic type for options
  difficulty: 'easy',           // 'easy' | 'medium' | 'hard'
  tags: ['relevant-tag'],
  estimatedMinutes: 10,
  order: 1,                     // Display order within the topic
  mode: 'function_implementation',
}
```

### Step 2: Add full exercise definition

Edit `src/content/exercise-registry.ts` and add an `Exercise` object:

```typescript
'your-problem-id': {
  // Same metadata as catalog entry, plus:
  version: 1,
  learningGoals: ['Goal 1', 'Goal 2'],
  statement: 'Full problem statement with `backtick` code formatting.',
  constraints: ['Constraint 1', 'Constraint 2'],
  examples: [
    { input: 'arr = [1, 2, 3]', output: '6' },
  ],
  editableFiles: [{
    path: 'Solution.java',
    role: 'main',
    starter: `class Solution {
    int yourMethod(int[] arr) {
        // Write your code here
        return 0;
    }
}`,
  }],
  requiredStructure: {
    className: 'Solution',
    methodName: 'yourMethod',
    signature: 'int yourMethod(int[] arr)',
  },
  limits: {
    timeLimitMs: 1000,
    outputLimitBytes: 32768,
    maxVisibleTests: 2,
    maxHiddenTests: 10,
  },
  evaluation: {
    comparator: 'exact_json',
    visibleTests: [
      { name: 'example-1', args: [[1, 2, 3]], expected: 6 },
    ],
  },
}
```

### Adding Test Cases

Test cases are defined within the `evaluation` block of your exercise definition in `src/content/exercise-registry.ts`. You must provide `args` (arguments passed to the function) and `expected` (the expected return value).

#### Visible Tests
These tests are shown directly to the user to help them understand the problem. Add them to the `visibleTests` array:

```typescript
  evaluation: {
    comparator: 'exact_json',
    visibleTests: [
      { name: 'example-1', args: [[1, 2, 3]], expected: 6 },
      { name: 'example-2', args: [[-1, -2, -3]], expected: -6 },
    ],
    // ...
```

#### Hidden Tests
Hidden tests evaluate edge cases or performance and are not shown to the learner. Use the `hiddenTestStrategy` object set to `inline`:

```typescript
  evaluation: {
    // ...
    hiddenTestStrategy: {
      type: 'inline',
      tests: [
        { name: 'hidden-1-edge-case', args: [[]], expected: 0 },
        { name: 'hidden-2-large', args: [[100, 200, 300]], expected: 600 },
      ]
    }
  }
```

### Exercise Modes

| Mode | Use When | Key Fields |
|---|---|---|
| `function_implementation` | Learner writes a single method | `requiredStructure.methodName` |
| `class_implementation` | Learner writes a full class with multiple methods | `requiredStructure.requiredMethods` |
| `main_program` | Learner writes a `main` method with stdout output | `comparator: 'trimmed_text'` |

### Comparators

| Comparator | Description |
|---|---|
| `exact_json` | Deep equality on JSON values (default) |
| `unordered_json` | Array order doesn't matter |
| `trimmed_text` | String comparison ignoring leading/trailing whitespace |
| `exact_text` | Exact string match |
| `numeric_tolerance` | Floating-point comparison with epsilon |

### Available Topics

`arrays`, `strings`, `loops`, `conditionals`, `recursion`, `searching`, `sorting`, `math`, `classes`, `collections`

### Difficulty Levels

- **easy** — Introductory. One concept, straightforward solution.
- **medium** — Combines 2+ concepts or requires a specific algorithm.
- **hard** — Optimization, edge cases, or advanced data structures.

---

## Modifying the UI

### CSS Design System

All styles use CSS custom properties defined in `src/styles/variables.css`:

```css
/* Colors use the `--color-` prefix */
background: var(--color-surface-1);
color: var(--color-text-primary);

/* Spacing uses the `--space-` prefix */
padding: var(--space-4);
gap: var(--space-3);

/* Font sizes use `--text-` prefix */
font-size: var(--text-sm);
```

Both dark and light themes are supported via `[data-theme="dark"]` / `[data-theme="light"]` attribute selectors.

### DOM Utilities

Use the `el()` helper from `shared/dom-utils.ts` instead of raw `document.createElement`:

```typescript
import { el, svgIcon, icons } from '../shared/dom-utils';

const card = el('div', {
  className: 'problem-card',
  children: [
    el('span', { text: 'Hello' }),
    svgIcon(icons.play, 16),
  ],
  on: { click: () => console.log('clicked') },
});
```

---

## Code Quality Checklist

Before submitting a PR:

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run dev` starts without console errors
- [ ] New exercises have at least 2 visible test cases
- [ ] CSS uses design tokens, not hardcoded colors/sizes
- [ ] No `any` type usage
- [ ] All functions have clear names and JSDoc where non-obvious

---

## Architecture Docs

For deeper context, see:

- [Architecture.md](./Architecture.md) — System design and module overview
- [Tasks.md](./Tasks.md) — Product roadmap and task breakdown
- [ExerciseSchema.md](./ExerciseSchema.md) — Exercise format specification
