import { defineTests } from '../../_test-utils';

export default defineTests('index-of-min', (t, rng) => {
  // ── Visible Tests ──
  t.visible('min-repeats-first', { args: [[1, -7, 3, -7, 4]], expected: 1 });
  t.visible('min-repeats-middle', { args: [[2, 9, 4, 1, 1]], expected: 3 });
  t.visible('negatives-repeat', { args: [[-5, -5, -1, -3]], expected: 0 });
  t.visible('min-at-last', { args: [[6, 4, 2, 0]], expected: 3 });
  t.visible('all-equal', { args: [[5, 5, 5, 5]], expected: 0 });

  // ── Hidden Tests ──
  t.hidden('large-tied-minima', { args: [[-9, 1, -9, 2, -9, 3, -9, 1, -9, 2, -9, 3]], expected: 0 });
  t.hidden('tied-minima-middle', { args: [[4, -12, 7, -12, 2, -12, 4, -12]], expected: 1 });
  t.hidden('repeated-negative-min', { args: [[-8, -8, -1, -5, -1, -8, -8]], expected: 0 });
  t.hidden('min-near-tail-large', { args: [[20, 3, 2, 1, 0, 20, 3, 2, 1, 0]], expected: 4 });
  t.hidden('min-starts-at-index-0', { args: [[-13, -13, 8, 7, 6, -13, -13]], expected: 0 });
  t.hidden('first-repeated', { args: [[5, -11, -11, 10, 9, 5, -11]], expected: 1 });
  t.hidden('large-minima-gaps', { args: [[3, -14, 1, -14, 2, -14, 0, 3]], expected: 1 });
  t.hidden('descending-segments', { args: [[8, 7, 6, 5, 4, 3, 2, -1, 8, 7, 6]], expected: 7 });
  t.hidden('first-top-not-last', { args: [[-10, 0, -9, 0, -8, 0, -10, -10, 0]], expected: 0 });

  // ── Generated Tests ──
  for (let i = 0; i < 6; i++) {
    const len = rng.int(10, 5000);
    const testArr = rng.intArray(len, -1000, 1000);
    // Find expected index using standard JS logic
    let bestIdx = 0;
    for (let j = 1; j < testArr.length; j++) {
        if (testArr[j]! < testArr[bestIdx]!) {
            bestIdx = j;
        }
    }
    t.hidden(`gen-${i}`, { args: [testArr], expected: bestIdx });
  }
});
