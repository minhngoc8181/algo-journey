/* ═══════════════════════════════════════════════════════════
   Shared Types — Core domain types for algo-journey
   ═══════════════════════════════════════════════════════════ */

// ── Exercise Modes ──
export type ExerciseMode = 'function_implementation' | 'class_implementation' | 'main_program';

// ── Taxonomy ──
export type Topic =
  | 'arrays'
  | 'strings'
  | 'loops'
  | 'conditionals'
  | 'recursion'
  | 'searching'
  | 'sorting'
  | 'math'
  | 'classes'
  | 'collections';

export type Difficulty = 'easy' | 'medium' | 'hard';

// ── Exercise Schema ──
export interface Exercise {
  id: string;
  slug: string;
  version: number;
  title: string;
  summary: string;
  topic: Topic;
  difficulty: Difficulty;
  tags: string[];
  estimatedMinutes: number;
  order?: number;
  learningGoals?: string[];
  prerequisites?: string[];
  mode: ExerciseMode;
  statement: string;
  constraints: string[];
  examples: ExerciseExample[];
  editableFiles: EditableFile[];
  requiredStructure?: RequiredStructure;
  limits: ExerciseLimits;
  evaluation: ExerciseEvaluation;
}

export interface ExerciseExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface EditableFile {
  path: string;
  role: 'main' | 'helper';
  starter: string;
}

export interface RequiredStructure {
  className: string;
  methodName?: string;
  signature?: string;
  requiredMethods?: string[];
}

export interface ExerciseLimits {
  timeLimitMs: number;
  outputLimitBytes: number;
  maxVisibleTests: number;
  maxHiddenTests: number;
}

export interface ExerciseEvaluation {
  comparator: ComparatorType;
  visibleTests: TestCase[];
  hiddenTestStrategy?: HiddenTestStrategy;
  /**
   * Java generator: large tests generated INSIDE Wasm memory.
   * The Java code runs a seeded RNG, generates inputs, computes
   * expected via reference logic, runs Solution, then prints AJ| output.
   * Avoids the 64KB Java bytecode limit from embedding huge array literals.
   */
  javaGenerator?: JavaGenerator;
}

export type ComparatorType =
  | 'exact_text'
  | 'trimmed_text'
  | 'exact_json'
  | 'unordered_json'
  | 'numeric_tolerance'
  | 'custom_named_comparator';

export interface TestCase {
  name: string;
  args?: unknown[];
  input?: string;
  expected: unknown;
  operations?: unknown[][];
}

export interface HiddenTestStrategy {
  type: 'generated' | 'inline';
  generator?: string;
  seed?: number;
  count?: number;
  tests?: TestCase[];
}

/**
 * Java-side large test generator.
 * `genMethodBody` is Java code for method body of:
 *   static void runGeneratedTests(Solution s, java.util.Random rng)
 * Names should be "gen-0", "gen-1", ..., "gen-{count-1}".
 * Expected values must be computed inside the Java code (reference impl).
 */
export interface JavaGenerator {
  count: number;          // how many tests (for allTests bookkeeping)
  seed: number;           // fixed seed for java.util.Random
  namePrefix: string;     // e.g. "gen-"
  genMethodBody: string;  // Java method body (see above)  
  visibility: 'visible' | 'hidden';
}

// ── Catalog ──
export type CatalogEntry = Pick<Exercise,
  'id' | 'slug' | 'title' | 'summary' | 'topic' | 'difficulty' | 'tags' | 'estimatedMinutes' | 'order' | 'mode'
>;

// ── Run Results ──
export type RunStatus =
  | 'accepted'
  | 'wrong_answer'
  | 'compile_error'
  | 'runtime_error'
  | 'time_limit_exceeded'
  | 'platform_error';

export interface RunResult {
  problemId: string;
  exerciseVersion: number;
  status: RunStatus;
  elapsedMs: number;
  compileDiagnostics?: CompileDiagnostic[];
  runtimeError?: string;
  tests: TestResult[];
  stdout?: string;
}

export interface CompileDiagnostic {
  file: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface TestResult {
  name: string;
  visibility: 'visible' | 'hidden';
  status: 'passed' | 'failed' | 'error';
  inputPreview?: string;
  expectedPreview?: string;
  actualPreview?: string;
  message?: string;
}

// ── Progress ──
export type ProgressStatus = 'not_started' | 'attempted' | 'accepted';

export interface ProblemProgress {
  problemId: string;
  exerciseVersion: number;
  status: ProgressStatus;
  attemptCount: number;
  lastRunAt: string;
  bestResult?: {
    passed: number;
    total: number;
  };
}

export interface Draft {
  problemId: string;
  exerciseVersion: number;
  updatedAt: string;
  files: Record<string, string>;
}

// ── UI State ──
export type AppPage = 'catalog' | 'problem';

export interface AppState {
  currentPage: AppPage;
  currentProblemSlug: string | null;
  theme: 'dark' | 'light';
  isRunning: boolean;
}
