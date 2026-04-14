import { defineTests } from '../../_test-utils';
export default defineTests('binary-search', (t, rng) => {
  t.visible('found', { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 });
  t.visible('not-found', { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 });
  t.hidden('empty', { args: [[], 1], expected: -1 });
  t.hidden('single-found', { args: [[5], 5], expected: 0 });
  t.hidden('single-not', { args: [[5], 3], expected: -1 });
  t.hidden('first', { args: [[1,2,3,4,5], 1], expected: 0 });
  t.hidden('last', { args: [[1,2,3,4,5], 5], expected: 4 });
  const arr = rng.sortedUniqueIntArray(1000, 1, 100000);
  const idx = rng.int(0, arr.length - 1);
  t.hidden('stress-found', { args: [arr, arr[idx]!], expected: idx });
  t.hidden('stress-not', { args: [arr, -999], expected: -1 });

  // Rule #6: only 1-2 not-found tests in generated
  for (let i = 0; i < 11; i++) {
    const len = rng.int(5, 1000);
    const testArr = rng.sortedUniqueIntArray(len, -20000, 20000);
    if (i === 1) {
      // The single not-found generated test
      const target = testArr[0]! - rng.int(1, 100);
      t.hidden(`gen-not-${i}`, { args: [testArr, target], expected: -1 });
    } else {
      const targetIdx = rng.int(0, len - 1);
      t.hidden(`gen-found-${i}`, { args: [testArr, testArr[targetIdx]!], expected: targetIdx });
    }
  }
});
