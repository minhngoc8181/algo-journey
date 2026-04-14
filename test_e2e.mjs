import { readFileSync, writeFileSync } from 'fs';
import * as runtime from './src/vendor/teavm/compiler.wasm-runtime.js';

async function main() {
  const compilerWasm = readFileSync('./public/vendor/teavm/compiler.wasm');
  const teavm = await runtime.load(compilerWasm);
  const compiler = teavm.exports.createCompiler();

  compiler.setSdk(new Int8Array(readFileSync('./public/vendor/teavm/compile-classlib-teavm.bin')));
  compiler.setTeaVMClasslib(new Int8Array(readFileSync('./public/vendor/teavm/runtime-classlib-teavm.bin')));

  compiler.addSourceFile('Solution.java', 'class Solution { boolean containsDuplicate(int[] arr) { return false; } }');
  compiler.addSourceFile('RunnerMain.java', `
    public class RunnerMain {
        public static void main(String[] args) {
            Solution s = new Solution();
            try {
                boolean actual_has_dup = s.containsDuplicate(new int[]{1, 2, 3, 1});
                boolean expect_has_dup = true;
                boolean pass_has_dup = (actual_has_dup == expect_has_dup);
                System.out.println("AJ|has-dup|" + pass_has_dup + "|" + String.valueOf(actual_has_dup) + "|" + String.valueOf(expect_has_dup));
            } catch (Exception t) {
                UNDEFINED_THING("AJ_ERROR|" + t);
            }
            System.out.println("__AJ_DONE__");
        }
    }
  `);

  const diagnostics = [];
  compiler.onDiagnostic(d => diagnostics.push({
    type:     d.type,
    severity: d.severity,
    fileName: d.fileName,
    line:     d.lineNumber,
    column:   d.columnNumber ?? 0,
    message:  d.message,
  }));

  console.log('compilation:', compiler.compile());
  console.log('diagnostics length:', diagnostics.length);
  if (diagnostics.length > 0) {
      const d = diagnostics[0];
      console.log('message typeof:', typeof d.message, 'constructor:', d.message?.constructor?.name);
      console.log('fileName typeof:', typeof d.fileName, 'constructor:', d.fileName?.constructor?.name);
  }
  console.log('wasmGen:', compiler.generateWebAssembly({ outputName: 'app', mainClass: 'RunnerMain' }));

  const wasmBytes = compiler.getWebAssemblyOutputFile('app.wasm');
  console.log('instanceof Int8Array:', wasmBytes instanceof Int8Array);
  console.log('instanceof Uint8Array:', wasmBytes instanceof Uint8Array);
  console.log('instanceof Array:', wasmBytes instanceof Array);
  const wasmBytesCloned = new Uint8Array(wasmBytes);
  console.log('wasmBytes.buffer === teavm.memory.buffer?', wasmBytes.buffer === teavm.exports.memory?.buffer);
  console.log('wasmBytesCloned.buffer === teavm.memory.buffer?', wasmBytesCloned.buffer === teavm.exports.memory?.buffer);

  // Now emulate run-worker:
  let outputModule;
  const lines = [];
  const hook = t => lines.push(t);
  
  try {
      console.log('loading...');
      outputModule = await runtime.load(wasmBytesCloned, { stdout: hook, stderr: hook });
      console.log('loaded!');
  } catch (e) {
      console.log('Fallback load...', e);
      outputModule = await runtime.load(wasmBytesCloned);
  }

  const origLog = console.log;
  console.log = (...args) => lines.push(args.join(' '));

  if (typeof outputModule.exports.main === 'function') {
      outputModule.exports.main([]);
  } else {
      console.error("NO MAIN");
  }

  console.log = origLog;
  console.log('==== OUTPUT ====');
  console.log(lines.join('\\n'));
}

main().catch(console.error);
