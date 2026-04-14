import { SeededRng, seedFromId } from './src/content/_test-utils';
import testDef from './src/content/problems/arrays/all-indices.gen';
import loader from './src/content/_loader'; // actually testDef is enough if we mock builder

const visible = [];
const hidden = [];
const rng = new SeededRng(seedFromId('all-indices'));
testDef.default({
  visible(name, tc) { visible.push({ name, tc }); },
  hidden(name, tc) { hidden.push({ name, tc }); }
}, rng);

let emptyCount = 0;
visible.forEach(t => {
  if (JSON.stringify(t.tc.expected) === '[]') emptyCount++;
});
hidden.forEach(t => {
  if (JSON.stringify(t.tc.expected) === '[]') emptyCount++;
});

console.log('Total empty expected outputs:', emptyCount);
console.log('Tests:');
console.log(visible.map(v => v.name + ': ' + JSON.stringify(v.tc.expected)));
console.log(hidden.map(h => h.name + ': ' + (JSON.stringify(h.tc.expected) === '[]' ? '[]' : '[...]')));
