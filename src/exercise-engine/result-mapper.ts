/* ═══════════════════════════════════════════════════════════
   Result Mapper — Build structured RunResult from engine output
   ═══════════════════════════════════════════════════════════ */

import type { Exercise, RunResult, RunStatus, TestResult } from '../shared/types';
import { compare } from './comparators';

/**
 * Evaluate learner code output against exercise test cases.
 * Returns a fully structured RunResult.
 */
export function evaluateTests(
  exercise: Exercise,
  outputs: TestOutput[],
  elapsedMs: number,
): RunResult {
  const testResults: TestResult[] = [];

  // Evaluate visible tests
  for (const test of exercise.evaluation.visibleTests) {
    const output = outputs.find(o => o.testName === test.name);

    if (!output) {
      testResults.push({
        name: test.name,
        visibility: 'visible',
        status: 'error',
        message: 'Test did not execute',
      });
      continue;
    }

    if (output.error) {
      testResults.push({
        name: test.name,
        visibility: 'visible',
        status: 'error',
        inputPreview: test.args ? JSON.stringify(test.args) : undefined,
        expectedPreview: JSON.stringify(test.expected),
        message: output.error,
      });
      continue;
    }

    const passed = compare(exercise.evaluation.comparator, output.actual, test.expected);

    testResults.push({
      name: test.name,
      visibility: 'visible',
      status: passed ? 'passed' : 'failed',
      inputPreview: test.args ? JSON.stringify(test.args) : undefined,
      expectedPreview: JSON.stringify(test.expected),
      actualPreview: JSON.stringify(output.actual),
      message: passed ? undefined : 'Output does not match expected value',
    });
  }

  // Determine overall status
  const status = determineStatus(testResults, elapsedMs, exercise.limits.timeLimitMs);

  return {
    problemId: exercise.id,
    exerciseVersion: exercise.version,
    status,
    elapsedMs,
    tests: testResults,
  };
}

/**
 * Determine overall run status from individual test results.
 */
function determineStatus(
  tests: TestResult[],
  elapsedMs: number,
  timeLimitMs: number,
): RunStatus {
  if (elapsedMs > timeLimitMs) {
    return 'time_limit_exceeded';
  }

  const hasError = tests.some(t => t.status === 'error');
  if (hasError) {
    return 'runtime_error';
  }

  const allPassed = tests.every(t => t.status === 'passed');
  return allPassed ? 'accepted' : 'wrong_answer';
}

/**
 * Output from executing a single test case.
 */
export interface TestOutput {
  testName: string;
  actual: unknown;
  error?: string;
  stdout?: string;
}
