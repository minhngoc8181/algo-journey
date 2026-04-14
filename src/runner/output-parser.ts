/* ═══════════════════════════════════════════════════════════
   Output Parser
   Parses structured AJ| lines from RunnerMain.java stdout.
   Protocol:
     AJ|<name>|<pass>|<actual>|<expected>
     AJ_ERROR|<message>
     __AJ_DONE__
   ═══════════════════════════════════════════════════════════ */

import type { TestCase, TestResult } from '../shared/types';

export interface ParsedResult {
  tests: Omit<TestResult, 'visibility'>[];
  runtimeError?: string;
  done: boolean;
}

/**
 * Parse stdout lines from RunnerMain into structured TestResults.
 */
export function parseRunnerOutput(
  stdout: string,
  allTests: TestCase[],
): ParsedResult {
  const lines = stdout.split('\n').map(l => l.trim()).filter(Boolean);

  const resultMap = new Map<string, Omit<TestResult, 'visibility'>>();
  let runtimeError: string | undefined;
  let done = false;

  for (const line of lines) {
    if (line === '__AJ_DONE__') {
      done = true;
      continue;
    }

    if (line.startsWith('AJ_ERROR|')) {
      const body = line.slice('AJ_ERROR|'.length);
      // Per-test RE: format is "AJ_ERROR|testname: exception message"
      // Global RE:   format is "AJ_ERROR|some crash message" (no pipe-separated name)
      const colonIdx = body.indexOf(': ');
      if (colonIdx > 0) {
        const testName = body.slice(0, colonIdx);
        const errMsg   = body.slice(colonIdx + 2);
        resultMap.set(testName, {
          name: testName,
          status: 'error' as const,
          message: errMsg,
        });
      } else {
        runtimeError = body;
      }
      continue;
    }

    if (line.startsWith('AJ|')) {
      // AJ|<name>|<pass>|<actual>|<expected>
      const parts = line.split('|');
      if (parts.length < 5) continue;
      const [, name, passStr, actual, expected] = parts;
      if (!name) continue;

      resultMap.set(name, {
        name,
        status: passStr === 'true' ? 'passed' : 'failed',
        actualPreview:   actual?.slice(0, 300),
        expectedPreview: expected?.slice(0, 300),
      });
      continue;
    }
  }

  // Build ordered results aligned with allTests
  const tests: Omit<TestResult, 'visibility'>[] = allTests.map(tc => {
    const parsed = resultMap.get(tc.name);
    if (parsed) return parsed;
    // Test didn't produce output (e.g. crashed before reaching it)
    return {
      name: tc.name,
      status: 'error' as const,
      message: runtimeError ? `Runtime error before this test` : 'No output — test may not have run',
    };
  });

  return { tests, runtimeError, done };
}
