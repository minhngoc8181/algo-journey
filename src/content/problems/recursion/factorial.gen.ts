import { defineTests } from '../../_test-utils';
function fact(n: number): number { return n <= 1 ? 1 : n * fact(n - 1); }
export default defineTests('factorial', (t) => {
  t.visible('n5', { args: [5], expected: 120 }); t.visible('n0', { args: [0], expected: 1 });
  t.hidden('n1', { args: [1], expected: 1 }); t.hidden('n2', { args: [2], expected: 2 }); t.hidden('n6', { args: [6], expected: 720 }); t.hidden('n10', { args: [10], expected: fact(10) }); t.hidden('n12', { args: [12], expected: fact(12) });
  for (let i = 3; i < 16; i++) {
    if (i !== 5 && i !== 6 && i !== 10 && i !== 12) {
      t.hidden(`n${i}`, { args: [i], expected: fact(i) });
    }
  }
  for(let i=0; i<5; i++) {
      const n = Math.floor(Math.random() * 10) + 1;
      t.hidden(`gen-${i}`, { args: [n], expected: fact(n) });
  }
});
