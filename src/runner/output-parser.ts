/* ═══════════════════════════════════════════════════════════
   Output Parser
   Parses structured TEST| / ERROR| / TLE| lines from Runner.java stdout.
   Protocol:
     TEST|<name>|<PASS|FAIL>|<actual>|<expected>[|<elapsed>ms]
     ERROR|<name>|<exception>
     TLE|<name>|<elapsed>ms (limit: Xms)
     AJ|<name>|<true|false>|<actual>|<expected>   (legacy stress tests)
     === DONE ===
   ═══════════════════════════════════════════════════════════ */

import type { TestCase, TestResult } from '../shared/types';

export interface ParsedResult {
  tests: Omit<TestResult, 'visibility'>[];
  runtimeError?: string;
  done: boolean;
}



/**
 * Parse stdout lines from Runner.java into structured TestResults.
 * Supports both legacy AJ| format and new TEST|/ERROR| format.
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
    // New format sentinel
    if (line === '=== DONE ===' || line === '__AJ_DONE__') {
      done = true;
      continue;
    }

    // ── TLE: Time Limit Exceeded per test ────────────────────────
    if (line.startsWith('TLE|')) {
      const parts = line.split('|');
      const name = parts[1];
      const elapsedInfo = parts.slice(2).join('|');
      if (name) {
        resultMap.set(name, {
          name,
          status: 'tle' as const,
          message: `Time Limit Exceeded: ${elapsedInfo}`,
        });
      }
      continue;
    }

    // ── New format: ERROR|<name>|<exception> ─────────────────────
    if (line.startsWith('ERROR|')) {
      const parts = line.split('|');
      if (parts.length >= 3) {
        const name   = parts[1];
        const errMsg = parts.slice(2).join('|');
        if (name) {
          resultMap.set(name, { name, status: 'error' as const, message: errMsg });
        }
      }
      continue;
    }

    function truncateWithEllipsis(str: string | undefined, max: number): string | undefined {
      if (!str) return str;
      if (str.length > max) return str.slice(0, max) + '...';
      return str;
    }

    // ── Legacy format: AJ_ERROR|testname: exception ───────────────
    if (line.startsWith('AJ_ERROR|')) {
      const body = line.slice('AJ_ERROR|'.length);
      const colonIdx = body.indexOf(': ');
      if (colonIdx > 0) {
        const testName = body.slice(0, colonIdx);
        const errMsg   = body.slice(colonIdx + 2);
        resultMap.set(testName, { name: testName, status: 'error' as const, message: errMsg });
      } else {
        runtimeError = body;
      }
      continue;
    }

    // ── New format: TEST|<name>|<pass>|<actual>|<expected> ───────
    if (line.startsWith('TEST|') || line.startsWith('AJ|')) {
      const parts = line.split('|');
      if (parts.length < 5) continue;
      
      const name = parts[1];
      const passStr = parts[2];
      if (!name) continue;

      // Updated: TEST|name|PASS|actual|expected[|elapsed]
      // Also legacy: TEST|name|true|actual|expected (pass = 'true')
      const passed = passStr === 'true' || passStr === 'PASS';
      const payload = parts.slice(3).join('|');
      let actual = '';
      let expected = '';

      if (passed) {
          // If passed, actual is identical to expected.
          // The payload is roughly "A|A". We cut exactly in half.
          actual = payload.substring(0, Math.floor(payload.length / 2));
          expected = actual;
      } else {
          // Heuristic to split when both arrays contain '|' inside.
          const splitIdx = payload.indexOf(']|[');
          if (splitIdx !== -1) {
              actual = payload.substring(0, splitIdx + 1);
              expected = payload.substring(splitIdx + 2); // skip '|'
          } else {
              actual = parts[3] ?? '';
              expected = parts.slice(4).join('|');
          }
      }

      resultMap.set(name, {
        name,
        status: passed ? 'passed' : 'failed',
        actualPreview:   truncateWithEllipsis(actual, 200),
        expectedPreview: truncateWithEllipsis(expected, 200),
      });
      continue;
    }
  }

  // Build ordered results aligned with allTests
  const tests: Omit<TestResult, 'visibility'>[] = allTests.map(tc => {
    const parsed = resultMap.get(tc.name);
    if (parsed) return parsed;
    return {
      name: tc.name,
      status: 'error' as const,
      message: runtimeError ? `Runtime error before this test` : 'No output — test may not have run',
    };
  });

  // Append dynamically generated tests (stress tests from javaGenerator)
  for (const [name, parsed] of resultMap.entries()) {
    if (!allTests.some(tc => tc.name === name)) {
      tests.push(parsed);
    }
  }

  return { tests, runtimeError, done };
}
