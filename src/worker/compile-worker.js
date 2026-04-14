/**
 * compile-worker.js — TeaVM-javac Compile Worker
 * ═══════════════════════════════════════════════
 * Runs as an ES module Web Worker.
 * Loads compiler.wasm once, keeps instance alive for fast re-compiles.
 *
 * Message protocol (main → worker):
 *   { id, cmd: 'init' }
 *   { id, cmd: 'compile', files: Record<string,string>, mainClass: string }
 *
 * Messages (worker → main):
 *   { id, cmd: 'ready' }
 *   { id, cmd: 'compiled',     wasmBytes: Int8Array, diagnostics: [] }
 *   { id, cmd: 'compile-error', diagnostics: [] }
 *   { id, cmd: 'error',         message: string }
 */

/* global load */  // exported by compiler.wasm-runtime.js

// ── Lazy-loaded state ─────────────────────────────────────
let compiler = null;
let runtimeLoad = null; // the `load` function from compiler.wasm-runtime.js

// ── Message handler ───────────────────────────────────────
self.onmessage = async (event) => {
  const { id, cmd, ...payload } = event.data;
  try {
    switch (cmd) {
      case 'init':
        await initCompiler();
        self.postMessage({ id, cmd: 'ready' });
        break;

      case 'compile': {
        if (!compiler) await initCompiler();
        const result = await compileFiles(payload.files, payload.mainClass);
        if (result.wasmBuffer) {
           self.postMessage({ id, ...result }, [result.wasmBuffer]);
        } else {
           self.postMessage({ id, ...result });
        }
        break;
      }

      default:
        self.postMessage({ id, cmd: 'error', message: `Unknown command: ${cmd}` });
    }
  } catch (err) {
    self.postMessage({ id, cmd: 'error', message: String(err) });
  }
};

// ── Compiler initialization (once) ───────────────────────
async function initCompiler() {
  if (compiler) return; // already initialized

  // Bypass Vite import-analysis by using runtime string construction
  const runtimeModule = await import('../vendor/teavm/compiler.wasm-runtime.js');
  runtimeLoad = runtimeModule.load ?? runtimeModule.default?.load ?? runtimeModule.default;

  if (typeof runtimeLoad !== 'function') {
    throw new Error('compiler.wasm-runtime.js does not export a `load` function');
  }

  // Load the compiler WASM — this is ~4 MB, loaded once
  const teavm = await runtimeLoad('/vendor/teavm/compiler.wasm');
  const compilerLib = teavm.exports;

  compiler = compilerLib.createCompiler();

  // Load Java class libraries (fetch in parallel)
  const [sdkBuf, rtBuf] = await Promise.all([
    fetch('/vendor/teavm/compile-classlib-teavm.bin').then(r => {
      if (!r.ok) throw new Error(`Failed to load compile-classlib: ${r.status}`);
      return r.arrayBuffer();
    }),
    fetch('/vendor/teavm/runtime-classlib-teavm.bin').then(r => {
      if (!r.ok) throw new Error(`Failed to load runtime-classlib: ${r.status}`);
      return r.arrayBuffer();
    }),
  ]);

  compiler.setSdk(new Int8Array(sdkBuf));
  compiler.setTeaVMClasslib(new Int8Array(rtBuf));
}

// ── Compile sources ───────────────────────────────────────
async function compileFiles(files, mainClass) {
  const diagnostics = [];

  // Reset source files from previous compilation
  compiler.clearSourceFiles();
  if (typeof compiler.clearInputClassFiles === 'function') {
    compiler.clearInputClassFiles();
  }
  if (typeof compiler.clearOutputFiles === 'function') {
    compiler.clearOutputFiles();
  }
  
  for (const [name, content] of Object.entries(files)) {
    compiler.addSourceFile(name, content);
  }

  // Subscribe to diagnostics
  const reg = compiler.onDiagnostic(d => diagnostics.push({
    type:     d.type,       // 'javac' | 'teavm'
    severity: d.severity,   // 'error' | 'warning' | 'other'
    fileName: d.fileName,
    line:     d.lineNumber,
    column:   d.columnNumber ?? 0,
    message:  d.message,
  }));

  const compileOk = compiler.compile();
  
  if (reg && typeof reg.destroy === 'function') {
    reg.destroy();
  } else if (typeof reg === 'function') {
    reg();
  }

  if (!compileOk) {
    return { cmd: 'compile-error', diagnostics };
  }

  // Generate WebAssembly output
  const wasmOk = compiler.generateWebAssembly({ outputName: 'app', mainClass });
  if (!wasmOk) {
    return { cmd: 'compile-error', diagnostics };
  }

  let wasmBuffer = null;
  let wasmBytes = compiler.getWebAssemblyOutputFile('app.wasm');
  if (wasmBytes) {
    wasmBuffer = wasmBytes.buffer.slice(wasmBytes.byteOffset, wasmBytes.byteOffset + wasmBytes.byteLength);
  }
  return { cmd: 'compiled', wasmBuffer, diagnostics };
}
