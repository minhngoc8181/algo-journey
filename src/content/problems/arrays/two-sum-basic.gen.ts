import { defineTests } from '../../_test-utils';

export default defineTests('two-sum-basic', (t, rng) => {
  t.visible('example-1', { args: [[2, 7, 11, 15], 9], expected: [0, 1] });
  t.visible('example-2', { args: [[3, 2, 4], 6], expected: [1, 2] });

  t.hidden('first-last', { args: [[1, 5, 3, 7], 8], expected: [0, 3] });
  t.hidden('negatives', { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] });
  t.hidden('zeros', { args: [[0, 4, 3, 0], 0], expected: [0, 3] });
  t.hidden('large-values', { args: [[1000000, 500000, 500000], 1000000], expected: [1, 2] });

  // Stress: array of 1000 elements with one known pair
  const arr = rng.intArray(998, 1, 50000);
  const a = 60001, b = 60002;
  arr.push(a, b);
  const shuffled = rng.shuffle(arr);
  const idxA = shuffled.indexOf(a);
  const idxB = shuffled.indexOf(b);
  t.hidden('stress-1k', { args: [shuffled, a + b], expected: [Math.min(idxA, idxB), Math.max(idxA, idxB)] });

  for (let i = 0; i < 15; i++) {
    const len = rng.int(10, 500);
    const testArr = rng.intArray(len, 1, 1000);
    const i1 = rng.int(0, len - 2);
    const i2 = rng.int(i1 + 1, len - 1);
    const target = testArr[i1]! + testArr[i2]!;
    
    let expected = [-1, -1];
    outer: for(let x=0; x<len; x++) {
        for(let y=x+1; y<len; y++) {
            if(testArr[x]! + testArr[y]! === target) {
                expected = [x, y];
                break outer;
            }
        }
    }
    
    t.hidden(`gen-${i}`, { args: [testArr, target], expected });
  }
});
