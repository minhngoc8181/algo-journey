// Test: how large is stdinData for a 100K element array test?
function serializeArg(value, javaType) {
  if (value === null || value === undefined) {
    if (javaType.includes('[]')) return '0\n';
    return 'null\n';
  }
  if (javaType.includes('[]')) {
    const arr = value;
    const n = arr.length;
    if (n === 0) return '0\n';
    const elems = arr.map(e => String(e)).join(' ');
    return `${n}\n${elems}\n`;
  }
  return `${String(value)}\n`;
}

// Simulate a 100K element test case
const testArr = Array.from({ length: 100000 }, (_, i) => (i % 1001) - 500);
const tgt = testArr[42];
const expected = testArr.indexOf(tgt);

const stdinLines = ['1']; // 1 test case
stdinLines.push('gen-8');
stdinLines.push(serializeArg(testArr, 'int[]').trimEnd());
stdinLines.push(serializeArg(tgt, 'int').trimEnd());
stdinLines.push(serializeArg(expected, 'int').trimEnd());
const stdinData = stdinLines.join('\n') + '\n';

console.log('stdinData total length:', stdinData.length, 'chars');
console.log('stdinData total bytes (ASCII):', Buffer.byteLength(stdinData, 'utf8'));
console.log('Chunks needed (60000 chars each):', Math.ceil(stdinData.length / 60000));
console.log('First 200 chars:', stdinData.substring(0, 200));
