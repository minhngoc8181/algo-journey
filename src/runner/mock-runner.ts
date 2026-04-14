/* ═══════════════════════════════════════════════════════════
   Runner — PLACEHOLDER (TeaVM not yet integrated)
   ═══════════════════════════════════════════════════════════
   This file is intentionally minimal.
   It returns a clear error so developers know the real
   Java compiler/runner has not been connected yet.

   To implement:
     → See docs/Architecture.md § "Execution Pipeline"
     → Replace this with a Worker that runs teavm-javac
   ═══════════════════════════════════════════════════════════ */

import type { Exercise, RunResult } from '../shared/types';

export async function mockRun(
  _exercise: Exercise,
  _code: string,
  _customInput?: string,
  _isSubmit = false,
): Promise<RunResult> {
  return {
    problemId: _exercise.id,
    exerciseVersion: _exercise.version,
    status: 'platform_error',
    elapsedMs: 0,
    tests: [],
    runtimeError:
      'Java runner not yet implemented. ' +
      'This platform requires teavm-javac integration to compile and execute Java code in the browser.',
  };
}
