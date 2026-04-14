import { defineTests } from '../../_test-utils';
export default defineTests('contains-duplicate', (t, rng) => {
  t.visible('has-dup', { args: [[1, 2, 3, 1]], expected: true });
  t.visible('no-dup', { args: [[1, 2, 3, 4]], expected: false });
  t.hidden('single', { args: [[1]], expected: false });
  t.hidden('two-same', { args: [[5, 5]], expected: true });
  t.hidden('two-diff', { args: [[5, 6]], expected: false });
  t.hidden('all-same', { args: [[9, 9, 9, 9]], expected: true });
  t.hidden('negatives', { args: [[-1, -2, -1]], expected: true });
  const unique = rng.sortedUniqueIntArray(500, 1, 300000);
  t.hidden('stress-no-dup', { args: [rng.shuffle(unique)], expected: false });
  const withDup = [...unique, unique[0]!];
  t.hidden('stress-with-dup', { args: [rng.shuffle(withDup)], expected: true });

  // ── Generated ──
  for (let i = 0; i < 11; i++) {
    const isLarge = i >= 9;
    const len = isLarge ? rng.int(1000, 2000) : rng.int(5, 500);
    const testArr = rng.intArray(len, -1000, 1000);
    // Force a duplicate 90% of the time, to avoid returning false commonly
    if (rng.bool(0.9) && testArr.length >= 2) {
        testArr[0] = testArr[1]!;
    }
    const expected = new Set(testArr).size !== testArr.length;
    t.hidden(`gen-${i}`, { args: [testArr], expected });
  }
});
