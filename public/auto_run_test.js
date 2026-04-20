/**
 * auto_run_test.js — Algo Journey automated test runner
 * ═══════════════════════════════════════════════════════
 *
 * HOW TO RUN (from browser DevTools Console):
 *   1. Load the script (once):
 *      import('/auto_run_test.js')
 *   2. Run all tests:
 *      auto_run_test()         — run every problem
 *      auto_run_test(true)     — skip already-accepted problems (checks app progress)
 *   3. Test current problem with solution:
 *      auto_run_solution()     — loads solution for current page & submits
 *   4. await import('/auto_run_test.js?t=' + Date.now()).then(() => window.auto_run_test(true))
 *      await import('/auto_run_test.js?t=' + Date.now()).then(() => window.auto_run_solution())
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
  WAIT_NAV: 2500,   // ms after hash navigation before interacting
  WAIT_MONACO: 1500,   // extra ms for Monaco to initialize
  WAIT_SUBMIT: 4000,   // ms after clicking Submit for results
  WEAK_THRESHOLD: 4,   // blank passes > this → flag as WEAK_TESTS
  MAX_PROBLEMS: 9999,  // set lower to test a subset
  SKIP_SLUGS: ['hello-world'],      // e.g. ['hello-world'] to skip trivial problems
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
  const text = statsEl.textContent || '';
  const m = text.match(/(\d+)\s*\/\s*(\d+)/);
  if (m) return { passed: parseInt(m[1]), total: parseInt(m[2]) };
  if (text.toLowerCase().includes('error')) return { passed: 'err', total: 'err' };
  return null;
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

window.auto_run_test = async function (onlyFailing = false) {
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
  } catch (e) { }

  if (!onlyFailing) {
    // If running full suite, clear previous report
    report = [];
    localStorage.removeItem(STORE_KEY);
  }

  // When onlyFailing: skip problems that are 'accepted' in app progress
  // This catches ALL failures — manual submissions, auto-test runs, etc.
  let acceptedIds = new Set();
  if (onlyFailing) {
    try {
      const allProgress = await api.getAllProgress();
      acceptedIds = new Set(
        allProgress.filter(p => p.status === 'accepted').map(p => p.problemId)
      );
    } catch (e) {
      console.warn('⚠️ Could not read app progress, falling back to report-based skip');
      // Fallback: use report
      report.filter(r => r.status === '🟢 OK' || r.status === '🟡 WEAK_TESTS')
        .forEach(r => acceptedIds.add(r.id));
    }
  }

  // Filter and limit
  const problems = catalog
    .filter(p => !CFG.SKIP_SLUGS.includes(p.id))
    .filter(p => !onlyFailing || !acceptedIds.has(p.id))
    .slice(0, CFG.MAX_PROBLEMS);

  if (onlyFailing) {
    console.log(`⏭️ Skipping ${acceptedIds.size} accepted problems.`);
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
      const blankN = blankScore?.passed ?? -1;
      const blankTot = blankScore?.total ?? 20;
      const solN = solScore?.passed ?? -1;
      const solTot = solScore?.total ?? 20;

      // Extract trivial passes from window.__lastRunResult for solution run
      let trivialCount = 0;
      let suspiciousTestWarning = '';
      if (window.__lastRunResult && window.__lastRunResult.tests) {
        const tests = window.__lastRunResult.tests;
        const TRIVIAL_SENTINELS = new Set(['[]', '', 'null', '0', '-1', 'true', 'false']);
        
        const expectedCounts = new Map();
        let isAllBoolean = true;

        for (const t of tests) {
          if (t.status === 'passed' && t.actualPreview === t.expectedPreview && TRIVIAL_SENTINELS.has(t.actualPreview?.trim())) {
            trivialCount++;
          }
          const exp = t.expectedPreview ? t.expectedPreview.trim() : '';
          expectedCounts.set(exp, (expectedCounts.get(exp) || 0) + 1);
          if (exp !== 'true' && exp !== 'false') {
            isAllBoolean = false;
          }
        }

        if (!isAllBoolean) {
          const threshold = tests.length / 5;
          let maxCount = 0;
          let maxVal = '';
          for (const [val, count] of expectedCounts.entries()) {
             if (count > maxCount) {
                maxCount = count;
                maxVal = val;
             }
          }
          if (maxCount > threshold && tests.length > 0 && !maxVal.endsWith('...')) {
             suspiciousTestWarning = `Expected "${maxVal.length > 50 ? maxVal.substring(0, 50) + '...' : maxVal}" repeated ${maxCount}/${tests.length}`;
          }
        }
      }

      let status;
      if (!solution) status = '🔵 NO_SOLUTION';
      else if (solN < solTot) status = '🔴 SOL_FAILS';
      else if (trivialCount >= solTot && solTot > 0) status = '🟠 ALL_TRIVIAL';
      else if (blankN > 18) status = '🟠 ALL_TRIVIAL'; // Even if not matching sentinel exactly, blank passing 19-20 tests means useless tests.
      else if (suspiciousTestWarning) status = '🟣 POOR_TESTS';
      else if (blankN >= Math.max(CFG.WEAK_THRESHOLD, solTot * 0.25)) status = '🟡 WEAK_TESTS';
      else status = '🟢 OK';

      const blankStr = blankScore ? (blankScore.passed === 'err' ? 'Err/Err' : `${blankN}/${blankTot}`) : '?/?';
      const solStr = solScore ? (solScore.passed === 'err' ? 'Err/Err' : `${solN}/${solTot}`) : (solution ? '?/?' : 'N/A');
      let extraLabel = trivialCount > 0 ? ` (trivial: ${trivialCount})` : '';
      if (suspiciousTestWarning) extraLabel += ` [${suspiciousTestWarning}]`;
      
      console.log(`  ${status}  blank=${blankStr}  solution=${solStr}${extraLabel}`);

      const resultObj = { id, title, topic, difficulty, blankPassed: blankN, blankTotal: blankTot, solPassed: solN, solTotal: solTot, trivialCount, suspiciousTestWarning, status };

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
  const ok = report.filter(r => r.status === '🟢 OK');
  const weak = report.filter(r => r.status === '🟡 WEAK_TESTS');
  const trivial = report.filter(r => r.status === '🟠 ALL_TRIVIAL');
  const poor = report.filter(r => r.status === '🟣 POOR_TESTS');
  const broken = report.filter(r => r.status === '🔴 SOL_FAILS');
  const noSolution = report.filter(r => r.status === '🔵 NO_SOLUTION');
  const noPage = report.filter(r => r.status === '⚫ NO_PAGE');

  // Print table
  const pad = (s, n) => String(s).padEnd(n);
  console.log(
    pad('Problem', 32) + pad('Topic', 12) + pad('Blank', 8) + pad('Solution', 10) + 'Status'
  );
  console.log('─'.repeat(72));

  for (const r of report) {
    const blankStr = (r.blankPassed === 'err') ? 'Err' : ((r.blankPassed !== '?') ? `${r.blankPassed}/${r.blankTotal}` : '?/?');
    const solStr = (r.solPassed === 'err') ? 'Err' : ((r.solPassed !== '?') ? `${r.solPassed}/${r.solTotal}` : (r.status === '🔵 NO_SOLUTION' ? 'N/A' : '?/?'));
    const trivAdd = r.trivialCount ? ` (triv:${r.trivialCount})` : '';
    const poorAdd = r.suspiciousTestWarning ? ` [${r.suspiciousTestWarning}]` : '';
    console.log(
      pad(r.id, 32) + pad(r.topic, 12) + pad(blankStr, 8) + pad(solStr, 10) + r.status + trivAdd + poorAdd
    );
  }

  console.log('\n' + '─'.repeat(72));
  console.log(`  🟢 OK            : ${ok.length}  —  ${ok.map(r => r.id).join(', ') || 'none'}`);
  console.log(`  🟣 Poor tests    : ${poor.length}  —  ${poor.map(r => r.id).join(', ') || 'none'}`);
  console.log(`  🟠 All Trivial   : ${trivial.length}  —  ${trivial.map(r => r.id).join(', ') || 'none'}`);
  console.log(`  🟡 Weak tests    : ${weak.length}  —  ${weak.map(r => r.id).join(', ') || 'none'}`);
  console.log(`  🔴 Solution fails: ${broken.length}  —  ${broken.map(r => r.id).join(', ') || 'none'}`);
  console.log(`  🔵 No solution   : ${noSolution.length}  —  ${noSolution.map(r => r.id).join(', ') || 'none'}`);
  console.log(`  ⚫ Page error    : ${noPage.length}  —  ${noPage.map(r => r.id).join(', ') || 'none'}`);
  console.log('═'.repeat(72));
  console.log('%c💾 Full data: window.__autoTestReport', 'color:#94a3b8;font-size:11px');

  window.__autoTestReport = report;

  // Pretty table in DevTools (if supported)
  try {
    console.table(report.map(r => ({
      id: r.id, topic: r.topic, blank: `${r.blankPassed}/${r.blankTotal}`,
      solution: `${r.solPassed}/${r.solTotal}`, status: r.status,
    })));
  } catch (_) { }

  return report;
};

// ── Quick solution runner for current problem ─────────────────────────

window.auto_run_solution = async function () {
  const api = getApi();

  // Extract current problem slug from hash
  const hashMatch = window.location.hash.match(/#\/problem\/(.+)/);
  if (!hashMatch) {
    console.error('❌ Not on a problem page. Navigate to a problem first.');
    return;
  }
  const slug = hashMatch[1];
  console.log(`%c🔧 Loading solution for "${slug}"…`, 'color:#6ee7b7;font-size:13px;font-weight:bold');

  // Load solution
  let solution = null;
  try {
    solution = await api.getSolution(slug);
  } catch (e) {
    console.error(`❌ Could not load solution for "${slug}":`, e);
    return;
  }
  if (!solution) {
    console.error(`❌ No reference solution found for "${slug}"`);
    return;
  }

  // Set code and submit
  api.setCode(solution);
  await sleep(300);
  clickBtn('submit-btn');
  await waitForResult();
  switchToResultTab();
  await sleep(200);

  const score = readScore();
  if (score) {
    const icon = score.passed === score.total ? '✅' : '❌';
    console.log(`${icon} Solution result: ${score.passed}/${score.total}`);
    
    // Print detailed test info if available
    const runResult = window.__lastRunResult;
    if (runResult && runResult.tests) {
       console.log('%c--- Chi tiết từng test ---', 'color:#9ca3af;font-weight:bold');
       runResult.tests.forEach(t => {
           let passIcon = t.status === 'passed' ? '✅' : '❌';
           console.log(`%c${passIcon} ${t.name}`, 'font-weight:bold; color:' + (t.status === 'passed' ? '#34d399' : '#f87171'));
           console.log(`  Expected: ${t.expectedPreview || 'N/A'}`);
           console.log(`  Actual:   ${t.actualPreview || 'N/A'}`);
       });
       console.log('%c------------------------', 'color:#9ca3af;font-weight:bold');
    }
  } else {
    console.warn('⚠️ Could not read score. Check the Test Result tab manually.');
  }
};

// Initialize window.__autoTestReport from persistent storage immediately on script load
try {
  const saved = localStorage.getItem('algo_auto_test_report');
  if (saved) {
    window.__autoTestReport = JSON.parse(saved);
    console.log('%c💾 Loaded previous auto_run_test report into window.__autoTestReport', 'color:#6ee7b7;font-size:11px');
  }
} catch (err) { }
