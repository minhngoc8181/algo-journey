import { defineTests } from '../../_test-utils';
export default defineTests('merge-sorted-arrays', (t, rng) => {
  t.visible('merge-two', { args: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6] });
  t.visible('empty-b', { args: [[1], []], expected: [1] });
  t.hidden('empty-a', { args: [[], [2]], expected: [2] });
  t.hidden('both-empty', { args: [[], []], expected: [] });
  t.hidden('interleaved', { args: [[1, 4, 7], [2, 3, 5, 6]], expected: [1, 2, 3, 4, 5, 6, 7] });
  t.hidden('duplicates', { args: [[1, 2, 2], [2, 3, 3]], expected: [1, 2, 2, 2, 3, 3] });
  t.hidden('negatives', { args: [[-5, -3, -1], [-4, -2, 0]], expected: [-5, -4, -3, -2, -1, 0] });
  const a = rng.sortedUniqueIntArray(500, 1, 50000);
  const b = rng.sortedUniqueIntArray(500, 1, 50000);
  t.hidden('stress-10k', { args: [a, b], expected: [...a, ...b].sort((x, y) => x - y) });

  for (let i = 0; i < 12; i++) {
    const isLarge = i >= 10;
    const lenA = isLarge ? rng.int(500, 1000) : rng.int(10, 2000);
    const lenB = isLarge ? rng.int(500, 1000) : rng.int(10, 2000);
    const arrA = rng.sortedUniqueIntArray(lenA, -10000, 10000);
    const arrB = rng.sortedUniqueIntArray(lenB, -10000, 10000);
    t.hidden(`gen-${i}`, { args: [arrA, arrB], expected: [...arrA, ...arrB].sort((x, y) => x - y) });
  }
});
