import { defineTests } from '../../_test-utils';
function solveFizzBuzz(n: number): string[] {
  const r: string[] = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) r.push('FizzBuzz');
    else if (i % 3 === 0) r.push('Fizz');
    else if (i % 5 === 0) r.push('Buzz');
    else r.push(String(i));
  }
  return r;
}

export default defineTests('fizz-buzz', (t, rng) => {
  t.visible('n5', { args: [5], expected: ['1','2','Fizz','4','Buzz'] });
  t.visible('n15', { args: [15], expected: solveFizzBuzz(15) });
  t.hidden('n1', { args: [1], expected: ['1'] });
  t.hidden('n3', { args: [3], expected: ['1','2','Fizz'] });
  t.hidden('n30', { args: [30], expected: solveFizzBuzz(30) });
  t.hidden('n100', { args: [100], expected: solveFizzBuzz(100) });

  // Use seeded rng for determinism (was Math.random() before)
  for (let i = 0; i < 14; i++) {
    const n = rng.int(1, 500);
    t.hidden(`gen-${i}`, { args: [n], expected: solveFizzBuzz(n) });
  }
});
