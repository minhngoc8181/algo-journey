import { defineTests } from '../../_test-utils';

export default defineTests('is-sorted', (t, rng) => {
  // ── Visible Tests ──
  t.visible('strictly-increasing', { args: [[1, 2, 3, 4]], expected: true });
  t.visible('non-decreasing-duplicates', { args: [[1, 1, 2, 2, 3]], expected: true });
  t.visible('single-inversion', { args: [[1, 3, 2, 4]], expected: false });
  t.visible('strictly-decreasing', { args: [[4, 3, 2, 1]], expected: false });
  t.visible('inversion-near-end', { args: [[1, 2, 3, 5, 4]], expected: false });

  // ── Hidden Tests ──
  t.hidden('long-sorted-repeated', { args: [[1, 2, 3, 4, 5, 1, 2, 3, 4, 5]], expected: false });
  t.hidden('long-non-decreasing', { args: [[0, 0, 1, 1, 2, 2, 3, 3, 4, 4]], expected: true });
  t.hidden('empty-array', { args: [[]], expected: true });
  t.hidden('single-element', { args: [[42]], expected: true });

  // ── Generated Tests ──
  for (let i = 0; i < 11; i++) {
    const len = rng.int(10, 5000);
    const testArr = rng.intArray(len, -1000, 1000);
    
    // Half the time we generate a purely sorted array
    if (rng.bool(0.5)) {
        testArr.sort((a, b) => a - b);
        t.hidden(`gen-sorted-${i}`, { args: [testArr], expected: true });
    } else {
        // Unsorted array, we can safely just use the random array which is likely unsorted
        let sorted = true;
        for (let k = 1; k < testArr.length; k++) {
            if (testArr[k]! < testArr[k-1]!) {
                sorted = false;
                break;
            }
        }
        t.hidden(`gen-random-${i}`, { args: [testArr], expected: sorted });
    }
  }
});
