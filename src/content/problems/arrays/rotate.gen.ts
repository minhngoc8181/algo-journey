import { defineTests } from '../../_test-utils';

export default defineTests('rotate', (t, rng) => {
  // ── Visible Tests ──
  t.visible('left-1', { args: [[1, 2, 3, 4, 5], 1, "left"], expected: [2, 3, 4, 5, 1] });
  t.visible('right-2', { args: [[1, 2, 3, 4, 5], 2, "right"], expected: [4, 5, 1, 2, 3] });
  t.visible('rotate-by-len', { args: [[1, 2, 3, 4], 4, "left"], expected: [1, 2, 3, 4] });
  t.visible('k-larger-than-len', { args: [[9, 8, 7, 6], 6, "right"], expected: [7, 6, 9, 8] });
  t.visible('with-duplicates', { args: [[1, 1, 2, 2, 3], 3, "left"], expected: [2, 3, 1, 1, 2] });

  // ── Hidden Tests ──
  t.hidden('long-left', { args: [[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6], 5, "left"], expected: [6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5] });
  t.hidden('long-right-wrap', { args: [[9, 8, 7, 6, 5, 4, 9, 8, 7, 6, 5, 4, 9, 8, 7, 6, 5, 4, 9, 8], 7, "right"], expected: [8, 9, 8, 7, 6, 5, 4, 9, 8, 7, 6, 5, 4, 9, 8, 7, 6, 5, 4, 9] });
  t.hidden('zero-rotate', { args: [[3, 3, 2, 2, 1, 1], 0, "left"], expected: [3, 3, 2, 2, 1, 1] });
  t.hidden('mixed-signs-left', { args: [[-4, -3, -2, -1, 0, 1], 13, "left"], expected: [-3, -2, -1, 0, 1, -4] });
  t.hidden('single-element', { args: [[42], 5, "right"], expected: [42] });

  // ── Generated Tests ──
  for (let i = 0; i < 10; i++) {
    const isLarge = i >= 8;
    const len = isLarge ? rng.int(1000, 2000) : rng.int(2, 500);
    const testArr = rng.intArray(len, -20, 20);
    const k = rng.int(1, 500);
    const direction = rng.bool(0.5) ? "left" : "right";

    const shift = ((k % len) + len) % len;
    let expected: number[];
    if (shift === 0) {
      expected = [...testArr];
    } else if (direction === "left") {
      expected = testArr.slice(shift).concat(testArr.slice(0, shift));
    } else {
      expected = testArr.slice(len - shift).concat(testArr.slice(0, len - shift));
    }

    t.hidden(`gen-${i}`, { args: [testArr, k, direction], expected });
  }
});
