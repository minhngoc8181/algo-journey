/**
 * run-worker.js — TeaVM Program Run Worker
 * ═════════════════════════════════════════
 * Receives compiled WASM bytes, loads them with the TeaVM runtime,
 * intercepts System.out, runs main(), and returns captured stdout.
 *
 * Timeout is enforced by the MAIN THREAD terminating this worker.
 * Do NOT put timeout logic here.
 *
 * Message protocol (main → worker):
 *   { id, cmd: 'run', wasmBytes: Int8Array }
 *
 * Messages (worker → main):
 *   { id, cmd: 'run-complete', stdout: string }
 *   { id, cmd: 'run-error',    message: string }
 */

self.onmessage = async (event) => {
  const { id, cmd, wasmBuffer } = event.data;
  if (cmd !== 'run') return;

  const lines = [];

  try {
    // Bypass Vite import-analysis by using runtime string construction
    const runtimeModule = await import('../vendor/teavm/compiler.wasm-runtime.js');
    const load = runtimeModule.load ?? runtimeModule.default?.load ?? runtimeModule.default;

    if (typeof load !== 'function') {
      throw new Error('Could not find load function in compiler.wasm-runtime.js');
    }

    const stdoutHook = (text) => lines.push(text);

    let outputModule;
    const wasmBytes = new Uint8Array(wasmBuffer);
    
    // Always hook console.log before executing WASM logic
    const origLog = console.log;
    console.log = (...args) => lines.push(args.map(String).join(' '));
    const origError = console.error;
    console.error = (...args) => lines.push(args.map(String).join(' '));

    try {
      outputModule = await load(wasmBytes);
    } catch (e) {
      throw new Error(`Failed to load wasm runtime: ${e.message}`);
    }

    // Call main entry point
    if (typeof outputModule?.exports?.main === 'function') {
      outputModule.exports.main([]);
    } else if (typeof outputModule?.main === 'function') {
      outputModule.main([]);
    } else {
      throw new Error('Compiled module has no main() export');
    }

    console.log = origLog;
    console.error = origError;

    self.postMessage({ id, cmd: 'run-complete', stdout: lines.join('\n') });
  } catch (err) {
    self.postMessage({ id, cmd: 'run-error', message: String(err), stdout: lines.join('\n') });
  }
};
