import { defineTests } from '../../_test-utils';

export default defineTests('most-frequent', (t, rng) => {
  // ── Visible Tests ──
  t.visible('clear-winner', { args: [[2, 2, 3, 3, 3, 1]], expected: 3 });
  t.visible('frequency-tie', { args: [[5, 1, 5, 1, 2]], expected: 1 });
  t.visible('negative-winner', { args: [[-2, -2, -1, -1, -1, 0]], expected: -1 });
  t.visible('all-same', { args: [[4, 4, 4, 4]], expected: 4 });
  t.visible('late-cluster', { args: [[3, 2, 3, 2, 1, 1, 1]], expected: 1 });

  // ── Hidden Tests ──
  t.hidden('large-clear-winner', { args: [[7, 7, 7, 2, 3, 7, 7, 7, 2, 3, 7, 7, 7, 2, 3, 7, 7, 7, 2, 3, 7, 7]], expected: 7 });
  t.hidden('tie-resolves-smaller', { args: [[9, 1, 9, 1, 2, 2, 9, 1, 9, 1, 2, 2, 9, 1, 9, 1, 2, 2, 9, 1, 9, 1, 2, 2]], expected: 1 });
  t.hidden('negative-tie', { args: [[-5, -5, -4, -4, -4, -3, -5, -5, -4, -4, -4, -3, -5, -5, -4, -4, -4, -3]], expected: -4 });
  t.hidden('uniform-large', { args: [Array(28).fill(6)], expected: 6 });
  t.hidden('clusters', { args: [[8, 3, 8, 3, 8, 2, 2, 8, 3, 8, 3, 8, 2, 2, 8, 3, 8, 3, 8, 2, 2]], expected: 8 });
  t.hidden('perfect-tie', { args: [[4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1]], expected: 1 });
  t.hidden('edges-out-tie', { args: [[11, 10, 11, 10, 11, 9, 11, 10, 11, 10, 11, 9, 11, 10, 11, 10, 11, 9, 11]], expected: 11 });
  t.hidden('winner-not-largest', { args: [[3, 3, 2, 2, 1, 1, 1, 3, 3, 2, 2, 1, 1, 1, 3, 3, 2, 2, 1, 1, 1]], expected: 1 });

  // ── Generated Tests ──
  for (let i = 0; i < 7; i++) {
    const len = rng.int(10, 5000);
    const testArr = rng.intArray(len, -20, 20); // frequent duplicates
    
    const counts = new Map<number, number>();
    let bestValue = testArr[0]!;
    let bestCount = 0;
    
    for (const val of testArr) {
        const nextCount = (counts.get(val) || 0) + 1;
        counts.set(val, nextCount);
        if (nextCount > bestCount || (nextCount === bestCount && val < bestValue)) {
            bestCount = nextCount;
            bestValue = val;
        }
    }
    
    t.hidden(`gen-${i}`, { args: [testArr], expected: bestValue });
  }
});
