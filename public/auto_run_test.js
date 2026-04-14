/**
 * auto_run_test.js — Algo Journey automated test runner
 * ═══════════════════════════════════════════════════════
 *
 * HOW TO RUN (from browser DevTools Console):
 *   1. Load the script (once):
 *      import('/auto_run_test.js')
 *   2. Run the test (whenever you want):
 *      auto_run_test()
 *
 * REQUIRES:  npm run dev  (Vite dev server)
 * The app exposes window.__algoDev automatically in dev mode.
 *
 * WHAT IT DOES for each problem:
 *   1. Navigate to problem page
 *   2. Click [Reset Code] → Click [Submit]  → record blank score
 *   3. Load reference solution → Click [Submit] → record solution score
 *   4. Flag problems where blank submission passes too many tests
 *
 * CONFIGURATION — edit these constants if needed:
 */

const CFG = {
  WAIT_NAV:    2500,   // ms after hash navigation before interacting
  WAIT_MONACO: 1500,   // extra ms for Monaco to initialize
  WAIT_SUBMIT: 4000,   // ms after clicking Submit for results
  WEAK_THRESHOLD: 2,   // blank passes > this → flag as WEAK_TESTS
  MAX_PROBLEMS: 9999,  // set lower to test a subset
  SKIP_SLUGS: [],      // e.g. ['hello-world'] to skip trivial problems
};

// ── Helpers ────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function getApi() {
  const api = window.__algoDev;
  if (!api) throw new Error(
    '❌ window.__algoDev not found.\n' +
    '   Make sure the Vite dev server is running and the app has booted.\n' +
    '   Look for "⚡ AlgoDev API ready" in the console.'
  );
  return api;
}

/** Parse passed/total from the result panel */
function readScore() {
  const statsEl = document.querySelector('.result-summary__stats');
  if (!statsEl) return null;
  const m = statsEl.textContent?.match(/(\d+)\s*\/\s*(\d+)/);
  if (!m) return null;
  return { passed: parseInt(m[1]), total: parseInt(m[2]) };
}

/** Click a button by id, return false if not found */
function clickBtn(id) {
  const btn = document.getElementById(id);
  if (!btn) return false;
  btn.click();
  return true;
}

/** Wait for submit button to re-enable (spinner disappears) */
async function waitForResult(timeoutMs = CFG.WAIT_SUBMIT) {
  const start = Date.now();
  // First wait a short time for the button to disable (spinner starts)
  await sleep(300);
  // Then poll until the button is enabled again (result ready)
  while (Date.now() - start < timeoutMs) {
    const btn = document.getElementById('submit-btn');
    if (btn && !btn.disabled) break;
    await sleep(200);
  }
  // Small extra buffer for DOM to paint results
  await sleep(300);
}

/** Switch to the "Test Result" tab so .result-summary__stats is visible */
function switchToResultTab() {
  const tabs = document.querySelectorAll('.tabs .tab');
  for (const tab of tabs) {
    if (tab.textContent?.includes('Test Result')) {
      tab.click();
      return;
    }
  }
}

// ── Main Runner ────────────────────────────────────────────

window.auto_run_test = async function(onlyFailing = false) {
  console.clear();
  console.log('%c🚀 auto_run_test starting…', 'color:#6ee7b7;font-size:14px;font-weight:bold');

  const api = getApi();
  const catalog = api.getCatalog();

  if (!catalog || catalog.length === 0) {
    console.error('❌ No problems found in catalog. Is the app fully loaded?');
    return;
  }

  // Load persistent report if it exists
  const STORE_KEY = 'algo_auto_test_report';
  let report = [];
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) report = JSON.parse(saved);
  } catch (e) {}

  if (!onlyFailing) {
    // If running full suite, clear previous report
    report = [];
    localStorage.removeItem(STORE_KEY);
  }

  const okIds = report.filter(r => r.status === '🟢 OK').map(r => r.id);

  // Filter and limit
  const problems = catalog
    .filter(p => !CFG.SKIP_SLUGS.includes(p.id))
    .filter(p => !onlyFailing || !okIds.includes(p.id))
    .slice(0, CFG.MAX_PROBLEMS);

  if (onlyFailing) {
    console.log(`⏭️ Skipping ${okIds.length} already OK problems.`);
  }
  console.log(`📋 Found ${catalog.length} problems, testing ${problems.length}…\n`);

  let idx = 0;

  for (const problem of problems) {
    idx++;
    const { id, title, topic, difficulty } = problem;
    process: {
      console.log(`[${idx}/${problems.length}] ⏳ ${id} (${topic})`);

      // ── 1. Navigate ──────────────────────────────────────
      api.navigate(id);
      await sleep(CFG.WAIT_NAV + CFG.WAIT_MONACO);

      const submitExists = !!document.getElementById('submit-btn');
      if (!submitExists) {
        console.warn(`  ⚠️ Submit button not found for "${id}" — skipping`);
        report.push({ id, title, topic, difficulty, blankPassed: '?', blankTotal: '?', solPassed: '?', solTotal: '?', status: '⚫ NO_PAGE' });
        break process;
      }

      // ── 2. Blank submission ──────────────────────────────
      clickBtn('reset-btn');
      await sleep(400);
      clickBtn('submit-btn');
      await waitForResult();
      switchToResultTab();
      await sleep(200);

      const blankScore = readScore();

      // ── 3. Load solution ─────────────────────────────────
      let solution = null;
      try {
        solution = await api.getSolution(id);
      } catch (e) {
        console.warn(`  ⚠️ Could not load solution for "${id}":`, e);
      }

      let solScore = null;
      if (solution) {
        api.setCode(solution);
        await sleep(300);
        clickBtn('submit-btn');
        await waitForResult();
        switchToResultTab();
        await sleep(200);
        solScore = readScore();
      }

      // ── 4. Classify ──────────────────────────────────────
      const blankN   = blankScore?.passed  ?? -1;
      const blankTot = blankScore?.total   ?? 20;
      const solN     = solScore?.passed    ?? -1;
      const solTot   = solScore?.total     ?? 20;

      let status;
      if (!solution)             status = '🔵 NO_SOLUTION';
      else if (solN < solTot)   status = '🔴 SOL_FAILS';
      else if (blankN > CFG.WEAK_THRESHOLD) status = '🟡 WEAK_TESTS';
      else                       status = '🟢 OK';

      const blankStr = blankScore ? `${blankN}/${blankTot}` : '?/?';
      const solStr   = solScore   ? `${solN}/${solTot}` : (solution ? '?/?' : 'N/A');
      console.log(`  ${status}  blank=${blankStr}  solution=${solStr}`);

      const resultObj = { id, title, topic, difficulty, blankPassed: blankN, blankTotal: blankTot, solPassed: solN, solTotal: solTot, status };
      
      // Update report incrementally & save to localStorage
      const existingIdx = report.findIndex(r => r.id === id);
      if (existingIdx >= 0) report[existingIdx] = resultObj;
      else report.push(resultObj);
      
      localStorage.setItem(STORE_KEY, JSON.stringify(report));
    }

    // Small breather between problems
    await sleep(300);
  }

  // Navigate back to catalog when done
  api.navigate();

  // ── Final Report ───────────────────────────────────────────────
  console.log('\n' + '═'.repeat(72));
  console.log('%c📊  AUTO_RUN_TEST FINAL REPORT', 'color:#f59e0b;font-size:13px;font-weight:bold');
  console.log('═'.repeat(72));

  // Group by status
  const ok         = report.filter(r => r.status === '🟢 OK');
  const weak       = report.filter(r => r.status === '🟡 WEAK_TESTS');
  const broken     = report.filter(r => r.status === '🔴 SOL_FAILS');
  const noSolution = report.filter(r => r.status === '🔵 NO_SOLUTION');
  const noPage     = report.filter(r => r.status === '⚫ NO_PAGE');

  // Print table
  const pad = (s, n) => String(s).padEnd(n);
  console.log(
    pad('Problem', 32) + pad('Topic', 12) + pad('Blank', 8) + pad('Solution', 10) + 'Status'
  );
  console.log('─'.repeat(72));

  for (const r of report) {
    const blankStr = (r.blankPassed !== '?') ? `${r.blankPassed}/${r.blankTotal}` : '?/?';
    const solStr   = (r.solPassed !== '?') ? `${r.solPassed}/${r.solTotal}` : (r.status === '🔵 NO_SOLUTION' ? 'N/A' : '?/?');
    console.log(
      pad(r.id, 32) + pad(r.topic, 12) + pad(blankStr, 8) + pad(solStr, 10) + r.status
    );
  }

  console.log('\n' + '─'.repeat(72));
  console.log(`  🟢 OK            : ${ok.length}  —  ${ok.map(r=>r.id).join(', ') || 'none'}`);
  console.log(`  🟡 Weak tests    : ${weak.length}  —  ${weak.map(r=>r.id).join(', ') || 'none'}`);
  console.log(`  🔴 Solution fails: ${broken.length}  —  ${broken.map(r=>r.id).join(', ') || 'none'}`);
  console.log(`  🔵 No solution   : ${noSolution.length}  —  ${noSolution.map(r=>r.id).join(', ') || 'none'}`);
  console.log(`  ⚫ Page error    : ${noPage.length}  —  ${noPage.map(r=>r.id).join(', ') || 'none'}`);
  console.log('═'.repeat(72));
  console.log('%c💾 Full data: window.__autoTestReport', 'color:#94a3b8;font-size:11px');

  window.__autoTestReport = report;

  // Pretty table in DevTools (if supported)
  try { console.table(report.map(r => ({
    id: r.id, topic: r.topic, blank: `${r.blankPassed}/${r.blankTotal}`,
    solution: `${r.solPassed}/${r.solTotal}`, status: r.status,
  }))); } catch (_) {}

  return report;
};
