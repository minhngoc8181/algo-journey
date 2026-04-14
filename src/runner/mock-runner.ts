/* ═══════════════════════════════════════════════════════════
   Mock Runner — Simulates compile + run for development
   Uses structural validator for pre-compile checks.
   Will be replaced with real teavm-javac / TeaVM pipeline.
   ═══════════════════════════════════════════════════════════ */

import type { Exercise, RunResult, TestResult } from '../shared/types';
import { validateStructure } from '../exercise-engine/structural-validator';

/**
 * Simulate running learner code against exercise test cases.
 * This is a development-time mock. In production, this will be
 * replaced by the real Worker-based compilation and execution pipeline.
 */
export async function mockRun(exercise: Exercise, code: string): Promise<RunResult> {
  // Simulate processing delay
  await delay(300 + Math.random() * 500);

  // ── Structural validation (pre-compile) ──
  const validation = validateStructure(code, exercise);
  const errors = validation.diagnostics.filter(d => d.severity === 'error');
  const warnings = validation.diagnostics.filter(d => d.severity === 'warning');

  if (errors.length > 0) {
    return {
      problemId: exercise.id,
      exerciseVersion: exercise.version,
      status: 'compile_error',
      elapsedMs: 0,
      compileDiagnostics: validation.diagnostics,
      tests: [],
    };
  }

  // ── Execute visible tests with mock evaluation ──
  const startTime = Date.now();
  const testResults: TestResult[] = [];

  for (const test of exercise.evaluation.visibleTests) {
    const result = mockEvaluateTest(exercise, code, test);
    testResults.push(result);
  }

  // Add simulated hidden tests
  const hiddenCount = exercise.limits.maxHiddenTests;
  const allVisiblePassed = testResults.every(t => t.status === 'passed');

  for (let i = 0; i < Math.min(hiddenCount, 5); i++) {
    testResults.push({
      name: `hidden-${i + 1}`,
      visibility: 'hidden',
      status: allVisiblePassed ? 'passed' : (Math.random() > 0.5 ? 'passed' : 'failed'),
    });
  }

  const elapsedMs = Date.now() - startTime;
  const allPassed = testResults.every(t => t.status === 'passed');
  const anyError = testResults.some(t => t.status === 'error');

  // Include warnings even on success
  const result: RunResult = {
    problemId: exercise.id,
    exerciseVersion: exercise.version,
    status: allPassed ? 'accepted' : anyError ? 'runtime_error' : 'wrong_answer',
    elapsedMs,
    tests: testResults,
  };

  if (warnings.length > 0) {
    result.compileDiagnostics = warnings;
  }

  return result;
}

function mockEvaluateTest(
  exercise: Exercise,
  code: string,
  test: { name: string; args?: unknown[]; expected: unknown },
): TestResult {
  // Check if the starter code was modified
  const starterCode = exercise.editableFiles[0]?.starter ?? '';
  const codeModified = code.trim() !== starterCode.trim();

  if (!codeModified) {
    return {
      name: test.name,
      visibility: 'visible',
      status: 'failed',
      inputPreview: test.args ? JSON.stringify(test.args) : undefined,
      expectedPreview: JSON.stringify(test.expected),
      actualPreview: 'Default return value (code not modified)',
      message: 'You need to implement the solution',
    };
  }

  // Heuristic: check for meaningful implementation
  const hasReturnStatement = code.includes('return') &&
    !code.includes('return -1;') &&
    !code.includes('return 0;') &&
    !code.includes('return false;') &&
    !code.includes('return new int[]{-1, -1};') &&
    !code.includes('return new String[0];') &&
    !code.includes('return new int[0];');

  const hasLogic = code.includes('for') || code.includes('while') ||
    code.includes('if') || code.includes('.') || code.includes('++') ||
    code.includes('+=');

  if (hasReturnStatement && hasLogic) {
    return {
      name: test.name,
      visibility: 'visible',
      status: 'passed',
      inputPreview: test.args ? JSON.stringify(test.args) : undefined,
      expectedPreview: JSON.stringify(test.expected),
      actualPreview: JSON.stringify(test.expected),
    };
  }

  return {
    name: test.name,
    visibility: 'visible',
    status: 'failed',
    inputPreview: test.args ? JSON.stringify(test.args) : undefined,
    expectedPreview: JSON.stringify(test.expected),
    actualPreview: '(mock: incomplete implementation detected)',
    message: 'Implementation appears incomplete — add loops, conditionals, or method calls',
  };
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
