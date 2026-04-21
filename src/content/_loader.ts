/// <reference types="vite/client" />

/* ═══════════════════════════════════════════════════════════
   Content Loader — Auto-discovers exercises from problems/
   Uses Vite import.meta.glob for zero-config discovery.
   ═══════════════════════════════════════════════════════════ */

import type {
  Exercise,
  ExerciseExample,
  ExerciseMode,
  Topic,
  Difficulty,
  ComparatorType,
  RequiredStructure,
  CatalogEntry,
  TestCase,
  HelperClass,
} from '../shared/types';
import type { TestSuite } from './_test-utils';

// ── Exercise Definition (what authors write) ─────────────

export interface ExerciseDefinition {
  id: string;
  version: number;
  title: string;
  summary: string;
  topic: Topic;
  difficulty: Difficulty;
  tags: string[];
  estimatedMinutes: number;
  order?: number;
  mode: ExerciseMode;

  hints?: string[];
  learningGoals?: string[];
  prerequisites?: string[];
  statement: string;
  constraints: string[];
  examples: ExerciseExample[];

  /** Simplified starter: single file (covers 99% of exercises) */
  starter: {
    file: string;
    code: string;
  };

  requiredStructure?: RequiredStructure;

  /** Platform-injected helper classes (e.g. ListNode.java, TreeNode.java) */
  helperClasses?: HelperClass[];

  evaluation: {
    comparator: ComparatorType;
    timeLimitMs?: number;
    outputLimitBytes?: number;
    /**
     * Optional Java-side generator for large tests.
     * The gen loop logic is ported to Java and runs inside Wasm — no 64KB limit.
     */
    javaGenerator?: import('../shared/types').JavaGenerator;
  };
}

/** Helper for type-safe exercise definitions */
export function defineExercise(def: ExerciseDefinition): ExerciseDefinition {
  return def;
}

// ── Glob-discovered modules ──────────────────────────────

// Eager: exercise definitions (small metadata, needed for catalog)
const exerciseModules = import.meta.glob<{ default: ExerciseDefinition }>(
  './problems/**/*.exercise.ts',
  { eager: true },
);

// Lazy: test generators (only loaded when running tests)
const testModules = import.meta.glob<{ default: TestSuite }>(
  './problems/**/*.gen.ts',
);

// Lazy: reference solutions (raw text)
const solutionModules = import.meta.glob<string>(
  './problems/**/*.solution.java',
  { query: '?raw', import: 'default' },
);

// ── Build registry from discovered modules ───────────────

const registry: Map<string, ExerciseDefinition> = new Map();
const testLoaders: Map<string, () => Promise<{ default: TestSuite }>> = new Map();
const solutionLoaders: Map<string, () => Promise<string>> = new Map();

for (const [path, mod] of Object.entries(exerciseModules)) {
  const def = mod.default;
  if (def?.id) {
    registry.set(def.id, def);
  } else {
    console.warn(`[content] Skipping invalid exercise module: ${path}`);
  }
}

for (const [path, loader] of Object.entries(testModules)) {
  // Extract id from path: ./problems/arrays/first-index-of.gen.ts → first-index-of
  const match = path.match(/\/([^/]+)\.gen\.ts$/);
  if (match?.[1]) {
    testLoaders.set(match[1], loader as () => Promise<{ default: TestSuite }>);
  }
}

for (const [path, loader] of Object.entries(solutionModules)) {
  const match = path.match(/\/([^/]+)\.solution\.java$/);
  if (match?.[1]) {
    solutionLoaders.set(match[1], loader as () => Promise<string>);
  }
}

// ── Public API ───────────────────────────────────────────

/** Get all exercises as catalog entries (sorted by topic → order) */
export function getAllCatalogEntries(): CatalogEntry[] {
  const entries: CatalogEntry[] = [];

  for (const def of registry.values()) {
    entries.push({
      id: def.id,
      slug: def.id,
      title: def.title,
      summary: def.summary,
      topic: def.topic,
      difficulty: def.difficulty,
      tags: def.tags,
      estimatedMinutes: def.estimatedMinutes,
      order: def.order,
      mode: def.mode,
      learningGoals: def.learningGoals,
      prerequisites: def.prerequisites,
    });
  }

  return entries.sort((a, b) => {
    const orderA = a.order ?? 10000;
    const orderB = b.order ?? 10000;
    if (orderA !== orderB) return orderA - orderB;
    return a.title.localeCompare(b.title);
  });
}

/** Convert an ExerciseDefinition into a full Exercise (with tests loaded) */
export async function getFullExercise(id: string): Promise<Exercise | null> {
  const def = registry.get(id);
  if (!def) return null;

  // Load tests
  let visibleTests: TestCase[] = [];
  let hiddenTests: TestCase[] = [];

  const testLoader = testLoaders.get(id);
  if (testLoader) {
    try {
      const mod = await testLoader();
      const suite = mod.default;
      visibleTests = suite.visible;
      hiddenTests = suite.hidden;
    } catch (err) {
      console.warn(`[content] Failed to load tests for ${id}:`, err);
    }
  }

  return definitionToExercise(def, visibleTests, hiddenTests);
}

/** Synchronous version using cached tests (for when tests are pre-loaded) */
export function getExerciseSync(id: string): Exercise | null {
  const def = registry.get(id);
  if (!def) return null;
  // Return with empty tests; they'll be loaded async when needed
  return definitionToExercise(def, [], []);
}

/** Load reference solution for an exercise */
export async function getSolution(id: string): Promise<string | null> {
  const loader = solutionLoaders.get(id);
  if (!loader) return null;
  try {
    return await loader();
  } catch {
    return null;
  }
}

/** Check if an exercise exists in the registry */
export function hasExercise(id: string): boolean {
  return registry.has(id);
}

/** Get count of registered exercises */
export function getExerciseCount(): number {
  return registry.size;
}

// ── Internal helpers ─────────────────────────────────────

function definitionToExercise(
  def: ExerciseDefinition,
  visibleTests: TestCase[],
  hiddenTests: TestCase[],
): Exercise {
  return {
    id: def.id,
    slug: def.id,
    version: def.version,
    title: def.title,
    summary: def.summary,
    topic: def.topic,
    difficulty: def.difficulty,
    tags: [...def.tags],
    estimatedMinutes: def.estimatedMinutes,
    order: def.order,
    hints: def.hints,
    learningGoals: def.learningGoals,
    prerequisites: def.prerequisites,
    mode: def.mode,
    statement: def.statement,
    constraints: [...def.constraints],
    examples: [...def.examples],
    editableFiles: [
      {
        path: def.starter.file,
        role: 'main',
        starter: def.starter.code,
      },
    ],
    requiredStructure: def.requiredStructure,
    helperClasses: def.helperClasses,
    limits: {
      timeLimitMs: def.evaluation.timeLimitMs ?? 1000,
      outputLimitBytes: def.evaluation.outputLimitBytes ?? 32768,
      maxVisibleTests: visibleTests.length,
      maxHiddenTests: hiddenTests.length,
    },
    evaluation: {
      comparator: def.evaluation.comparator,
      visibleTests,
      hiddenTestStrategy: hiddenTests.length > 0
        ? { type: 'inline', tests: hiddenTests }
        : undefined,
      javaGenerator: def.evaluation.javaGenerator,
    },
  };
}
