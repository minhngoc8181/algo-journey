/* ═══════════════════════════════════════════════════════════
   Java Runner — Main-thread coordinator
   Orchestrates:  harness gen → compile worker → run worker
   Enforces timeout by terminating run worker.
   ═══════════════════════════════════════════════════════════ */

import type { Exercise, RunResult, RunStatus, TestCase, CompileDiagnostic } from '../shared/types';
import { buildHarnessFiles } from './harness-generator';
import { parseRunnerOutput } from './output-parser';

// ── Worker management ─────────────────────────────────────

// Keep a SINGLE compile worker alive (reuse across runs for speed)
let compileWorker: Worker | null = null;
let compileWorkerReady = false;
const compileQueue: Array<(w: Worker) => void> = [];

function getCompileWorker(): Promise<Worker> {
  return new Promise((resolve, reject) => {
    if (compileWorker && compileWorkerReady) {
      resolve(compileWorker);
      return;
    }

    // Spin up worker on first use
    if (!compileWorker) {
      compileWorker = new Worker(
        new URL('../worker/compile-worker.js?v=' + Date.now(), import.meta.url),
        { type: 'module' },
      );

      compileWorker.onerror = (e) => {
        console.error('[compile-worker] Error:', e);
        compileWorker = null;
        compileWorkerReady = false;
        reject(new Error(`Compile worker crashed: ${e.message}`));
      };

      // Send init
      const initId = `init-${Date.now()}`;
      compileWorker.postMessage({ id: initId, cmd: 'init' });

      compileWorker.onmessage = (e) => {
        if (e.data.cmd === 'ready') {
          compileWorkerReady = true;
          // Re-set the normal message handler
          compileWorker!.onmessage = null;
          resolve(compileWorker!);
          // Drain queue
          const w = compileWorker!;
          for (const fn of compileQueue) fn(w);
          compileQueue.length = 0;
        } else {
          reject(new Error(`Unexpected init response: ${JSON.stringify(e.data)}`));
        }
      };
    } else {
      // Worker exists but not yet ready — queue
      compileQueue.push(resolve);
    }
  });
}

// ── Worker message with Promise helper ────────────────────

let _msgId = 0;
function workerRequest<T>(
  worker: Worker,
  msg: Record<string, unknown>,
  timeoutMs = 30_000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = `req-${++_msgId}`;
    const timer = setTimeout(() => {
      reject(new Error(`Worker request timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    const handler = (e: MessageEvent) => {
      if (e.data.id !== id) return;
      worker.removeEventListener('message', handler);
      clearTimeout(timer);
      resolve(e.data as T);
    };

    worker.addEventListener('message', handler);
    worker.postMessage({ id, ...msg });
  });
}

// ── Public API ────────────────────────────────────────────

export async function javaRun(
  exercise: Exercise,
  studentCode: string,
  isSubmit: boolean,
  timeLimitMs: number,
): Promise<RunResult> {
  const startTime = Date.now();

  // ── 1. Select test cases ──────────────────────────────
  const visibleTests: TestCase[]  = exercise.evaluation.visibleTests;
  const hiddenTests: TestCase[]   =
    isSubmit && exercise.evaluation.hiddenTestStrategy?.type === 'inline'
      ? exercise.evaluation.hiddenTestStrategy.tests ?? []
      : [];

  const allTests = [...visibleTests, ...hiddenTests];

  if (allTests.length === 0) {
    return makeError(exercise, startTime, 'No test cases defined for this exercise.');
  }

  // ── 2. Generate harness ───────────────────────────────
  let files: Record<string, string>;
  try {
    files = buildHarnessFiles(exercise, studentCode, allTests);
    console.log('[java-runner] RunnerMain.java size:', files['RunnerMain.java']?.length, 'chars');
  } catch (err) {
    return makeError(exercise, startTime, `Harness generation failed: ${err}`);
  }

  // ── 3. Compile (in compile worker) ───────────────────
  let worker: Worker;
  try {
    worker = await getCompileWorker();
  } catch (err) {
    return makeError(exercise, startTime, `Failed to start compile worker: ${err}`);
  }

  let compileResult: any;
  try {
    compileResult = await workerRequest<any>(worker, {
      cmd: 'compile',
      files,
      mainClass: 'RunnerMain',
    }, 60_000); // 60s compile timeout
  } catch (err) {
    return makeError(exercise, startTime, `Compilation timed out or failed: ${err}`);
  }

  if (compileResult.cmd === 'compile-error') {
    return {
      problemId: exercise.id,
      exerciseVersion: exercise.version,
      status: 'compile_error',
      elapsedMs: Date.now() - startTime,
      compileDiagnostics: mapDiagnostics(compileResult.diagnostics),
      tests: [],
    };
  }

  if (compileResult.cmd === 'error') {
    return makeError(exercise, startTime, `Compile Worker Error: ${compileResult.message}`);
  }

  const wasmBuffer: ArrayBuffer = compileResult.wasmBuffer;
  // console.log(`[java-runner] wasmBuffer size: ${wasmBuffer?.byteLength} bytes`);

  // ── 4. Run (in fresh worker per run, for isolation + timeout) ──
  const stdout = await runWithTimeout(wasmBuffer, timeLimitMs);

  if (stdout.timedOut) {
    return {
      problemId: exercise.id,
      exerciseVersion: exercise.version,
      status: 'time_limit_exceeded',
      elapsedMs: timeLimitMs,
      tests: allTests.map(t => ({
        name: t.name,
        visibility: visibleTests.includes(t) ? 'visible' : 'hidden',
        status: 'failed' as const,
        message: `Time Limit Exceeded (${timeLimitMs}ms)`,
      })),
      compileDiagnostics: mapDiagnostics(compileResult.diagnostics ?? []),
    };
  }

  if (stdout.error) {
    return makeRuntimeError(exercise, startTime, stdout.error, allTests, visibleTests);
  }

  // ── 5. Parse output ───────────────────────────────────
  const parsed = parseRunnerOutput(stdout.output!, allTests);
  const elapsedMs = Date.now() - startTime;

  if (parsed.runtimeError && !parsed.done) {
    return makeRuntimeError(exercise, startTime, parsed.runtimeError, allTests, visibleTests);
  }

  const testResults = parsed.tests.map(t => ({
    ...t,
    visibility: (visibleTests.some(v => v.name === t.name) ? 'visible' : 'hidden') as 'visible' | 'hidden',
  }));

  const allPassed = testResults.every(t => t.status === 'passed');
  const anyTle    = testResults.some(t => t.status === 'tle');
  const anyError  = testResults.some(t => t.status === 'error');

  let status: RunStatus;
  if (anyTle)    status = 'time_limit_exceeded';
  else if (allPassed)  status = 'accepted';
  else if (anyError) status = 'runtime_error';
  else            status = 'wrong_answer';

  const result: RunResult = {
    problemId: exercise.id,
    exerciseVersion: exercise.version,
    status,
    elapsedMs,
    tests: testResults,
  };

  if ((compileResult.diagnostics ?? []).length > 0) {
    result.compileDiagnostics = mapDiagnostics(compileResult.diagnostics);
  }

  return result;
}

// ── Timeout runner ────────────────────────────────────────

interface RunOutcome {
  output?: string;
  error?: string;
  timedOut?: boolean;
}

function runWithTimeout(wasmBuffer: ArrayBuffer, timeLimitMs: number): Promise<RunOutcome> {
  return new Promise((resolve) => {
    const runWorker = new Worker(
      new URL('../worker/run-worker.js?v=' + Date.now(), import.meta.url),
      { type: 'module' },
    );

    const timer = setTimeout(() => {
      runWorker.terminate();
      resolve({ timedOut: true });
    }, timeLimitMs);

    runWorker.onmessage = (e) => {
      clearTimeout(timer);
      runWorker.terminate();

      if (e.data.cmd === 'run-complete') {
        resolve({ output: e.data.stdout ?? '' });
      } else if (e.data.cmd === 'run-error') {
        resolve({
          error: e.data.message,
          output: e.data.stdout ?? '',
        });
      } else {
        resolve({ error: `Unexpected message: ${JSON.stringify(e.data)}` });
      }
    };

    runWorker.onerror = (e) => {
      clearTimeout(timer);
      runWorker.terminate();
      resolve({ error: `Run worker crashed: ${e.message}` });
    };

    runWorker.postMessage({ id: 'run', cmd: 'run', wasmBuffer }, [wasmBuffer]);
  });
}

// ── Helpers ───────────────────────────────────────────────

function makeError(exercise: Exercise, startTime: number, msg: string): RunResult {
  return {
    problemId: exercise.id,
    exerciseVersion: exercise.version,
    status: 'platform_error',
    elapsedMs: Date.now() - startTime,
    tests: [],
    runtimeError: msg,
  };
}

function makeRuntimeError(
  exercise: Exercise,
  startTime: number,
  errorMsg: string,
  allTests: TestCase[],
  visibleTests: TestCase[],
): RunResult {
  return {
    problemId: exercise.id,
    exerciseVersion: exercise.version,
    status: 'runtime_error',
    elapsedMs: Date.now() - startTime,
    runtimeError: errorMsg,
    tests: allTests.map(t => ({
      name: t.name,
      visibility: visibleTests.includes(t) ? 'visible' : 'hidden',
      status: 'error' as const,
      message: errorMsg,
    })),
  };
}

function mapDiagnostics(raw: any[]): CompileDiagnostic[] {
  return (raw ?? []).map(d => ({
    file:     d.fileName ?? 'Solution.java',
    line:     d.line     ?? 0,
    column:   d.column   ?? 0,
    severity: d.severity === 'error' ? 'error' : 'warning',
    message:  d.message  ?? '',
  }));
}
