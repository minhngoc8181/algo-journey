/* ═══════════════════════════════════════════════════════════
   Comparators — Result comparison strategies
   ═══════════════════════════════════════════════════════════ */

import type { ComparatorType } from '../shared/types';

/**
 * Compare actual output against expected, using the specified strategy.
 * Returns true if the values match.
 */
export function compare(
  strategy: ComparatorType,
  actual: unknown,
  expected: unknown,
  options?: { tolerance?: number },
): boolean {
  switch (strategy) {
    case 'exact_json':
      return exactJson(actual, expected);
    case 'unordered_json':
      return unorderedJson(actual, expected);
    case 'exact_text':
      return exactText(actual, expected);
    case 'trimmed_text':
      return trimmedText(actual, expected);
    case 'numeric_tolerance':
      return numericTolerance(actual, expected, options?.tolerance ?? 1e-6);
    case 'custom_named_comparator':
      // Custom comparators are resolved by name — fallback to exact_json
      return exactJson(actual, expected);
    default:
      return exactJson(actual, expected);
  }
}

/**
 * Exact JSON deep equality.
 * Handles primitives, arrays, and plain objects.
 */
function exactJson(actual: unknown, expected: unknown): boolean {
  if (actual === expected) return true;
  if (actual === null || expected === null) return actual === expected;
  if (typeof actual !== typeof expected) return false;

  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;
    for (let i = 0; i < actual.length; i++) {
      if (!exactJson(actual[i], expected[i])) return false;
    }
    return true;
  }

  if (typeof actual === 'object' && typeof expected === 'object') {
    const a = actual as Record<string, unknown>;
    const b = expected as Record<string, unknown>;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!exactJson(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}

/**
 * Unordered JSON: arrays are compared as sets (order doesn't matter).
 * Useful for problems where return order is irrelevant (e.g., Two Sum).
 */
function unorderedJson(actual: unknown, expected: unknown): boolean {
  if (actual === expected) return true;
  if (actual === null || expected === null) return actual === expected;
  if (typeof actual !== typeof expected) return false;

  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;

    // Try sorted comparison for primitive arrays
    const sortedActual = [...actual].sort(defaultSort);
    const sortedExpected = [...expected].sort(defaultSort);
    return exactJson(sortedActual, sortedExpected);
  }

  // For non-arrays, fall back to exact comparison
  return exactJson(actual, expected);
}

/**
 * Exact text comparison (string equality).
 */
function exactText(actual: unknown, expected: unknown): boolean {
  return String(actual) === String(expected);
}

/**
 * Trimmed text: compare after trimming whitespace and normalizing line endings.
 */
function trimmedText(actual: unknown, expected: unknown): boolean {
  const a = String(actual).trim().replace(/\r\n/g, '\n');
  const b = String(expected).trim().replace(/\r\n/g, '\n');
  return a === b;
}

/**
 * Numeric comparison with tolerance (for floating-point results).
 */
function numericTolerance(
  actual: unknown,
  expected: unknown,
  tolerance: number,
): boolean {
  const a = Number(actual);
  const b = Number(expected);
  if (isNaN(a) || isNaN(b)) return false;
  return Math.abs(a - b) <= tolerance;
}

/**
 * Default sort for unordered comparison — handles mixed types.
 */
function defaultSort(a: unknown, b: unknown): number {
  const sa = JSON.stringify(a);
  const sb = JSON.stringify(b);
  return sa < sb ? -1 : sa > sb ? 1 : 0;
}
