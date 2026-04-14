import { defineTests } from '../../_test-utils';

export default defineTests('two-sum-sorted', (t, rng) => {
  // ── Visible Tests ──
  t.visible('simple-pair', { args: [[-3, 1, 4, 7, 11], 8], expected: [1, 3] });
  t.visible('no-pair', { args: [[1, 2, 3, 4, 5], 20], expected: [-1, -1] });
  t.visible('zeros', { args: [[0, 0, 3, 5], 0], expected: [0, 1] });
  t.visible('mixed-signs', { args: [[-4, -2, 0, 3, 7], 3], expected: [0, 4] });
  t.visible('extremes', { args: [[1, 3, 5, 7, 9], 10], expected: [0, 4] });

  // ── Hidden Tests ──
  t.hidden('large-target', { args: [[int(1e8), int(1e8) + 1, int(1e8) + 2], int(2e8) + 1], expected: [0, 1] });
  t.hidden('all-same', { args: [Array(100).fill(5), 10], expected: [0, 99] });
  t.hidden('not-found-large', { args: [[10, 11, 12, 13, 14, 15, 16], 30], expected: [-1, -1] });

  // ── Generated Tests ──
  for (let i = 0; i < 12; i++) {
    const len = rng.int(10, 5000);
    const testArr = rng.intArray(len, -100, 100);
    testArr.sort((a, b) => a - b);
    
    // Pick a random target that might or might not exist
    let target = 0;
    if (rng.bool(0.7)) {
        const i1 = rng.int(0, len - 1);
        let i2 = rng.int(0, len - 1);
        while (i2 === i1 && len > 1) { i2 = rng.int(0, len - 1); }
        target = testArr[i1]! + testArr[i2]!;
    } else {
        target = rng.int(-500, 500); 
    }
    
    let expected = [-1, -1];
    let left = 0, right = len - 1;
    while(left < right) {
        const sum = testArr[left]! + testArr[right]!;
        if (sum === target) {
            expected = [left, right];
            break;
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }

    t.hidden(`gen-${i}`, { args: [testArr, target], expected });
  }

  function int(n: number) { return Math.floor(n); }
});
