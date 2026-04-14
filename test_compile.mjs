import { readFileSync } from 'fs';
import * as runtime from './src/vendor/teavm/compiler.wasm-runtime.js';

async function main() {
  const compilerWasm = readFileSync('./public/vendor/teavm/compiler.wasm');
  const teavm = await runtime.load(compilerWasm);
  const compiler = teavm.exports.createCompiler();

  const sdkBuf = readFileSync('./public/vendor/teavm/compile-classlib-teavm.bin');
  const rtBuf = readFileSync('./public/vendor/teavm/runtime-classlib-teavm.bin');
  compiler.setSdk(new Int8Array(sdkBuf));
  compiler.setTeaVMClasslib(new Int8Array(rtBuf));

  compiler.addSourceFile('Main.java', `
    class Main {
      public static void main(String[] args) {}
    }
  `);

  compiler.compile();
  compiler.generateWebAssembly({ outputName: 'app', mainClass: 'Main' });
  const wasmBytes = compiler.getWebAssemblyOutputFile('app.wasm');

  console.log('wasmBytes constructor:', wasmBytes.constructor.name);
  console.log('wasmBytes keys:', Object.keys(wasmBytes));
  console.log('wasmBytes length:', wasmBytes.length);
  console.log('wasmBytes buffer:', wasmBytes.buffer);

  // How to convert to Uint8Array?
  if (wasmBytes.length !== undefined) {
    const arr = new Uint8Array(wasmBytes.length);
    for (let i = 0; i < wasmBytes.length; i++) {
        arr[i] = wasmBytes[i];
    }
    console.log('first 4 bytes:', arr.slice(0, 4));
  }
}
main().catch(console.error);
