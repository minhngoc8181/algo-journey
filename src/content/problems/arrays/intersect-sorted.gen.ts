import { defineTests } from '../../_test-utils';

export default defineTests('intersect-sorted', (t, rng) => {
  // ── Visible Tests ──
  t.visible('partial-overlap', { args: [[1, 2, 3, 4], [2, 4, 6, 8]], expected: [2, 4] });
  t.visible('no-common', { args: [[1, 2, 3], [4, 5, 6]], expected: [] });
  t.visible('with-duplicates', { args: [[1, 1, 2, 3], [1, 1, 3, 3]], expected: [1, 1, 3] });
  t.visible('identical', { args: [[0, 1, 2, 3], [0, 1, 2, 3]], expected: [0, 1, 2, 3] });
  t.visible('mixed-signs', { args: [[-3, -1, 0, 2], [-2, 0, 1, 3]], expected: [0] });

  // ── Hidden Tests ──
  t.hidden('large-identical-elements', { args: [Array(500).fill(1), Array(300).fill(1)], expected: Array(300).fill(1) });
  t.hidden('empty-left', { args: [[], [1, 2, 3]], expected: [] });
  t.hidden('empty-right', { args: [[1, 2, 3], []], expected: [] });
  t.hidden('large-distinct', { args: [Array.from({ length: 50 }, (_, i) => i * 2), Array.from({ length: 50 }, (_, i) => i * 2 + 1)], expected: [] });
  t.hidden('staggered-duplicates', { args: [[2, 2, 2, 2, 2, 3, 3, 3, 4], [2, 2, 3, 3, 3, 3, 5]], expected: [2, 2, 3, 3, 3] });

  // ── Generated Tests ──
  for (let i = 0; i < 11; i++) {
    const isLarge = i >= 9;
    const lenA = isLarge ? rng.int(1000, 2000) : rng.int(10, 500);
    const lenB = isLarge ? rng.int(1000, 2000) : rng.int(10, 500);
    const arrA = rng.intArray(lenA, -50, 50).sort((a, b) => a - b);
    const arrB = rng.intArray(lenB, -50, 50).sort((a, b) => a - b);
    
    // Compute intersection
    const expected: number[] = [];
    let p = 0, q = 0;
    while (p < lenA && q < lenB) {
        if (arrA[p] === arrB[q]) {
            expected.push(arrA[p]!);
            p++; q++;
        } else if (arrA[p]! < arrB[q]!) {
            p++;
        } else {
            q++;
        }
    }

    t.hidden(`gen-${i}`, { args: [arrA, arrB], expected });
  }
});
