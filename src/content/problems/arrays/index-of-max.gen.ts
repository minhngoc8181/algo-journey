import { defineTests } from '../../_test-utils';

export default defineTests('index-of-max', (t, rng) => {
  // ── Visible Tests ──
  t.visible('max-repeats-middle', { args: [[2, 9, 4, 9, 1]], expected: 1 });
  t.visible('negatives-repeat', { args: [[-5, -1, -5, -3]], expected: 1 });
  t.visible('max-at-last', { args: [[0, 2, 4, 6]], expected: 3 });
  t.visible('all-equal', { args: [[5, 5, 5, 5]], expected: 0 });
  t.visible('max-repeats', { args: [[1, 7, 7, 3, 7]], expected: 1 });

  // ── Hidden Tests ──
  t.hidden('large-tied-maxima', { args: [[1, 9, 1, 9, 2, 9, 3, 9, 1, 9, 2, 9, 3, 9, 1, 9, 2, 9, 3, 9, 1, 9, 2, 9, 3]], expected: 1 });
  t.hidden('tied-maxima-middle', { args: [[4, 12, 7, 12, 2, 12, 4, 12, 7, 12, 2, 12]], expected: 1 });
  t.hidden('repeated-negative-max', { args: [[-4, -1, -1, -5, -1, -1, -4, -1, -5, -1]], expected: 1 });
  t.hidden('max-near-tail-large', { args: [[0, 1, 2, 3, 20, 0, 1, 2, 3, 20, 0, 1, 2, 3, 20]], expected: 4 });
  t.hidden('max-starts-at-index-1', { args: [[6, 13, 13, 8, 7, 6, 13, 13, 8, 7, 6]], expected: 1 });
  t.hidden('first-repeated', { args: [[5, 11, 11, 10, 9, 5, 11, 11, 10, 9]], expected: 1 });
  t.hidden('large-maxima-gaps', { args: [[3, 14, 1, 14, 2, 14, 0, 3, 14, 1, 14, 2, 14, 0]], expected: 1 });
  t.hidden('descending-segments', { args: [[7, 8, 7, 6, 5, 4, 3, 2, 1, 8, 7, 6, 5]], expected: 1 });
  t.hidden('first-top-not-last', { args: [[8, 10, 0, 9, 0, 8, 0, 10, 10, 0, 9, 0, 8]], expected: 1 });

  // ── Generated Tests ──
  for (let i = 0; i < 9; i++) {
    const isLarge = i >= 7;
    const len = isLarge ? rng.int(1000, 2000) : rng.int(10, 500);
    const testArr = rng.intArray(len, -1000, 1000);
    // Find expected index using standard JS logic
    let bestIdx = 0;
    for (let j = 1; j < testArr.length; j++) {
        if (testArr[j]! > testArr[bestIdx]!) {
            bestIdx = j;
        }
    }
    t.hidden(`gen-${i}`, { args: [testArr], expected: bestIdx });
  }
});
