import { defineTests } from '../../_test-utils';

export default defineTests('range-sum-queries', (t, rng) => {
  // ── Visible Tests ──
  t.visible('basic', { args: [[1, 2, 3, 4, 5], [[0, 4], [1, 3], [2, 2]]], expected: [15, 9, 3] });
  t.visible('mixed-signs', { args: [[-1, 2, -3, 4], [[0, 3], [0, 1]]], expected: [2, 1] });
  t.visible('uniform', { args: [[5, 5, 5, 5, 5], [[0, 4], [1, 3]]], expected: [25, 15] });
  t.visible('alternating', { args: [[1, -1, 1, -1, 1], [[0, 4], [0, 1], [2, 3]]], expected: [1, 0, 0] });
  t.visible('single-element-range', { args: [[10, 20, 30], [[0, 0], [2, 2], [1, 1]]], expected: [10, 30, 20] });

  // ── Hidden Tests ──
  t.hidden('large-array', { args: [Array(50).fill(2), [[0, 49], [10, 20], [0, 0]]], expected: [100, 22, 2] });
  t.hidden('single-query', { args: [[1, 2, 3], [[1, 2]]], expected: [5] });
  t.hidden('overlapping-queries', { args: [[1, 2, 3, 4], [[0, 2], [1, 3], [0, 3]]], expected: [6, 9, 10] });

  // ── Generated Tests ──
  for (let i = 0; i < 12; i++) {
    const len = rng.int(10, 500);
    const testArr = rng.intArray(len, -20, 20);
    const queries: number[][] = [];
    const numQueries = rng.int(1, 200);
    
    for (let j = 0; j < numQueries; j++) {
        const l = rng.int(0, len - 1);
        const r = rng.int(l, len - 1);
        queries.push([l, r]);
    }
    
    // JS Logic
    const expected: number[] = [];
    const prefix = [0];
    for (let j = 0; j < len; j++) {
        prefix.push(prefix[j]! + testArr[j]!);
    }
    for (const q of queries) {
        expected.push(prefix[q[1]! + 1]! - prefix[q[0]!]!);
    }

    t.hidden(`gen-${i}`, { args: [testArr, queries], expected });
  }
});
