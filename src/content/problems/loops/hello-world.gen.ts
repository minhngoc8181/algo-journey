import { defineTests } from '../../_test-utils';
export default defineTests('hello-world', (t) => {
  t.visible('output', { expected: 'Hello, World!' });
  for(let i=1; i<=19; i++) {
      t.hidden(`run-${i}`, { expected: 'Hello, World!' });
  }
});
