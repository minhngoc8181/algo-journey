import { defineTests } from '../../_test-utils';

export default defineTests('second-extreme', (t, rng) => {
  // ── Visible Tests ──
  t.visible('second-largest', { args: [[4, 1, 9, 2, 9], "largest"], expected: 4 });
  t.visible('second-smallest', { args: [[4, 1, 9, 2, 9], "smallest"], expected: 2 });
  t.visible('no-second-distinct', { args: [[5, 5, 5, 5], "largest"], expected: null });
  t.visible('strictly-increasing-largest', { args: [[1, 2, 3, 4], "largest"], expected: 3 });
  t.visible('strictly-increasing-smallest', { args: [[1, 2, 3, 4], "smallest"], expected: 2 });

  // ── Hidden Tests ──
  t.hidden('large-alternating-largest', { args: [[10, 1, 9, 2, 8, 3, 10, 1, 9, 2, 8, 3], "largest"], expected: 9 });
  t.hidden('large-alternating-smallest', { args: [[10, 1, 9, 2, 8, 3, 10, 1, 9, 2, 8, 3], "smallest"], expected: 2 });
  t.hidden('all-same-large', { args: [Array(22).fill(7), "largest"], expected: null }); // Using expected null
  t.hidden('negative-largest', { args: [[-5, -1, -4, -2, -3, -5, -1, -4, -2, -3], "largest"], expected: -2 });
  t.hidden('negative-smallest', { args: [[-5, -1, -4, -2, -3, -5, -1, -4, -2, -3], "smallest"], expected: -4 });
  t.hidden('duplicates-of-largest', { args: [[12, 5, 12, 4, 11, 3, 12, 5, 12, 4, 11, 3], "largest"], expected: 11 });

  // ── Generated Tests ──
  for (let i = 0; i < 9; i++) {
    const len = rng.int(1, 200);
    const testArr = rng.intArray(len, -50, 50);
    const mode = rng.bool(0.5) ? "largest" : "smallest";
    
    // JS Logic
    const unique = Array.from(new Set(testArr)).sort((a, b) => a - b);
    let expected: number | null = null;
    if (unique.length >= 2) {
        if (mode === "largest") {
            expected = unique[unique.length - 2] ?? null;
        } else {
            expected = unique[1] ?? null;
        }
    }

    t.hidden(`gen-${i}`, { args: [testArr, mode], expected });
  }
});
