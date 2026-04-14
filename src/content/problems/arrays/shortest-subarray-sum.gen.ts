import { defineTests } from '../../_test-utils';

export default defineTests('shortest-subarray-sum', (t, rng) => {
  // ── Visible Tests ──
  t.visible('standard', { args: [[2, 3, 1, 2, 4, 3], 7], expected: 2 });
  t.visible('not-found', { args: [[1, 1, 1, 1, 1], 11], expected: 0 });
  t.visible('single-element', { args: [[1, 4, 4], 4], expected: 1 });
  t.visible('medium-length', { args: [[3, 1, 7, 1, 2], 10], expected: 3 });
  t.visible('multiple-candidates', { args: [[5, 1, 3, 5, 10, 7, 4, 9, 2, 8], 15], expected: 2 });

  // ── Hidden Tests ──
  t.hidden('entire-array-exact', { args: [[2, 2, 2], 6], expected: 3 });
  t.hidden('entire-array-more', { args: [[2, 2, 2], 5], expected: 3 });
  t.hidden('large-array', { args: [Array(500).fill(1), 50], expected: 50 });
  t.hidden('large-target-not-found', { args: [[100, 200, 300], 1000], expected: 0 });
  t.hidden('decreasing-elements', { args: [[10, 5, 2, 1], 12], expected: 2 });

  // ── Generated Tests ──
  for (let i = 0; i < 10; i++) {
    const len = rng.int(5, 500);
    const testArr = rng.intArray(len, 1, 100);
    const target = rng.int(10, 1000);
    
    // JS Logic
    let left = 0;
    let sum = 0;
    let minLen = len + 1;
    for (let right = 0; right < len; right++) {
        sum += testArr[right]!;
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= testArr[left]!;
            left++;
        }
    }
    const expected = minLen > len ? 0 : minLen;

    t.hidden(`gen-${i}`, { args: [testArr, target], expected });
  }
});
