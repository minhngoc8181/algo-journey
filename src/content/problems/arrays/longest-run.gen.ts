import { defineTests } from '../../_test-utils';

export default defineTests('longest-run', (t, rng) => {
  // ── Visible Tests ──
  t.visible('run-in-middle', { args: [[1, 1, 2, 2, 2, 3]], expected: 3 });
  t.visible('entire-array', { args: [[4, 4, 4, 4]], expected: 4 });
  t.visible('no-repeats', { args: [[1, 2, 3, 4]], expected: 1 });
  t.visible('run-at-end', { args: [[5, 5, 1, 1, 1, 1, 2]], expected: 4 });
  t.visible('multiple-runs', { args: [[0, 0, 1, 1, 1, 0, 0]], expected: 3 });

  // ── Hidden Tests ──
  t.hidden('several-long-runs', { args: [[1, 1, 1, 2, 2, 3, 1, 1, 1, 2, 2, 3, 1, 1, 1, 2, 2, 3]], expected: 3 });
  t.hidden('large-uniform', { args: [Array(26).fill(4)], expected: 26 });
  t.hidden('ones-and-zeros', { args: [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]], expected: 1 });
  t.hidden('dominates-in-middle', { args: [[3, 3, 2, 2, 2, 2, 1, 3, 3, 2, 2, 2, 2, 1]], expected: 4 });
  t.hidden('competing-lengths', { args: [[7, 6, 6, 6, 5, 5, 5, 5, 7, 6, 6, 6, 5, 5, 5, 5]], expected: 4 });

  // ── Generated Tests ──
  for (let i = 0; i < 10; i++) {
    const len = rng.int(10, 5000);
    const testArr = [];
    let currentVal = rng.int(0, 5);
    for (let k = 0; k < len; k++) {
        // Occasionally switch the value to create runs
        if (rng.bool(0.3)) {
            currentVal = rng.int(0, 5);
        }
        testArr.push(currentVal);
    }
    
    let expected = 1;
    let run = 1;
    for (let k = 1; k < testArr.length; k++) {
        if (testArr[k] === testArr[k-1]) {
            run++;
            if (run > expected) expected = run;
        } else {
            run = 1;
        }
    }

    t.hidden(`gen-${i}`, { args: [testArr], expected });
  }
});
