#!/usr/bin/env tsx
/**
 * ════════════════════════════════════════════════════════════════
 * PC Judge Coverage — coverage-refs.ts
 *
 * Đo JaCoCo code coverage của đáp án mẫu (_solution_ref.java) trên
 * toàn bộ bộ testcases của Runner, sau đó xuất báo cáo.
 *
 * Yêu cầu: chỉ cần JDK. Script tự tải JaCoCo JARs về out/lib/jacoco/
 * nếu chưa có (dùng curl.exe — có sẵn trên Windows 10+).
 *
 * Usage:
 *   npm run pc-judge:coverage                  # tất cả bài
 *   npm run pc-judge:coverage coffee-decorator  # một bài
 *   npm run pc-judge:coverage slug1;slug2       # nhiều bài
 *   npm run pc-judge:coverage --tags=cse202     # lọc bài theo module tag
 *
 * Output:
 *   out/pc-judge/4_report_coverage.json  — tổng hợp tất cả bài
 *   out/pc-judge/<slug>/results.json     — cập nhật: thêm field "coverage"
 * ════════════════════════════════════════════════════════════════
 */

import * as fs   from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as os   from 'os';
import { execSync, execFileSync } from 'child_process';
import { fileURLToPath }          from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─── Paths ────────────────────────────────────────────────────────
const ROOT        = path.resolve(__dirname, '..');
const PC_JUDGE    = path.join(ROOT, 'out', 'pc-judge');
const LIB_DIR     = path.join(ROOT, 'out', 'lib', 'jacoco');

// JaCoCo 0.8.13 — supports Java 24 (class file major version 68)
const JACOCO_VERSION  = '0.8.13';
const JACOCO_ZIP_URL  = `https://github.com/jacoco/jacoco/releases/download/v${JACOCO_VERSION}/jacoco-${JACOCO_VERSION}.zip`;
const AGENT_JAR  = path.join(LIB_DIR, 'jacocoagent.jar');
const CLI_JAR    = path.join(LIB_DIR, 'jacococli.jar');

// ─── Step 1: Ensure JaCoCo JARs are present ──────────────────────

async function downloadFile(url: string, dest: string): Promise<void> {
  // Use curl.exe (available on Windows 10+)
  execFileSync('curl.exe', ['-L', '--silent', '--show-error', '-o', dest, url], {
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 120_000,
  });
}

async function ensureJacoco(): Promise<void> {
  fs.mkdirSync(LIB_DIR, { recursive: true });

  if (fs.existsSync(AGENT_JAR) && fs.existsSync(CLI_JAR)) return;

  console.log(`\nDownloading JaCoCo ${JACOCO_VERSION} (zip) into out/lib/jacoco/ ...`);
  const zipPath = path.join(os.tmpdir(), `jacoco-${JACOCO_VERSION}.zip`);

  process.stdout.write(`  Downloading jacoco-${JACOCO_VERSION}.zip ... `);
  try {
    await downloadFile(JACOCO_ZIP_URL, zipPath);
    console.log('✓');
  } catch (err) {
    console.log('✗');
    throw new Error(`Failed to download JaCoCo zip: ${(err as Error).message}`);
  }

  // Extract specific JARs using PowerShell (no unzip dependency)
  process.stdout.write(`  Extracting jacocoagent.jar ... `);
  try {
    execSync(
      `powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; ` +
      `$zip = [System.IO.Compression.ZipFile]::OpenRead('${zipPath.replace(/\\/g, '\\\\')}'); ` +
      `$zip.Entries | Where-Object { $_.Name -eq 'jacocoagent.jar' } | ForEach-Object { ` +
        `[System.IO.Compression.ZipFileExtensions]::ExtractToFile($_, '${AGENT_JAR.replace(/\\/g, '\\\\')}', $true) }; ` +
      `$zip.Entries | Where-Object { $_.Name -eq 'jacococli.jar' } | ForEach-Object { ` +
        `[System.IO.Compression.ZipFileExtensions]::ExtractToFile($_, '${CLI_JAR.replace(/\\/g, '\\\\')}', $true) }; ` +
      `$zip.Dispose()"`,
      { stdio: 'pipe', timeout: 30_000 }
    );
    console.log('✓');
  } catch (err) {
    console.log('✗');
    throw new Error(`Failed to extract JaCoCo JARs: ${(err as Error).message}`);
  }

  // Verify
  if (!fs.existsSync(AGENT_JAR) || !fs.existsSync(CLI_JAR)) {
    throw new Error('JACoCo JARs not found after extraction. Check zip structure.');
  }
  console.log('JaCoCo ready.\n');
}

// ─── Step 2: Discover problems ───────────────────────────────────

interface Problem { slug: string; dir: string }

function getProblems(targetSlugs: string[] = []): Problem[] {
  if (!fs.existsSync(PC_JUDGE)) return [];
  const entries = fs.readdirSync(PC_JUDGE, { withFileTypes: true });
  let problems: Problem[] = [];

  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const dir = path.join(PC_JUDGE, e.name);
    // Must have both Runner.java and _solution_ref.java
    if (fs.existsSync(path.join(dir, 'Runner.java')) &&
        fs.existsSync(path.join(dir, '_solution_ref.java'))) {
      problems.push({ slug: e.name, dir });
    }
  }

  if (targetSlugs && targetSlugs.length > 0) {
    if (targetSlugs[0].startsWith('--tags=')) {
      const tagStr = targetSlugs[0].split('=')[1];
      const tags = tagStr.split(',').map(t => t.trim());
      
      const probDirs = fs.readdirSync(path.join(__dirname, '../src/content/problems'), { withFileTypes: true });
      const activeSlugs = new Set();
      
      for (const dir of probDirs) {
          if (dir.isDirectory()) {
              const fullDir = path.join(__dirname, '../src/content/problems', dir.name);
              const files = fs.readdirSync(fullDir);
              for (const file of files) {
                  if (file.endsWith('.exercise.ts')) {
                      const content = fs.readFileSync(path.join(fullDir, file), 'utf8');
                      if (tags.some(t => content.includes(`'${t}'`) || content.includes(`"${t}"`))) {
                          activeSlugs.add(file.replace('.exercise.ts', ''));
                      }
                  }
              }
          }
      }
      problems = problems.filter(p => activeSlugs.has(p.slug));
      console.log(`Filtering by tags: ${tags.join(', ')} -> Found ${problems.length} problems`);
    } else {
      problems = problems.filter(p => targetSlugs.includes(p.slug));
    }
  }
  return problems.sort((a, b) => a.slug.localeCompare(b.slug));
}

// ─── Step 3: Detect the solution file name ───────────────────────
// grade-ref.bat always does: copy _solution_ref.java <SomeFile>.java
// We detect the target by reading grade-ref.bat, or fall back to scanning
// Java files for public classes.

function detectSolutionFileName(dir: string): string | null {
  // Strategy A: parse grade-ref.bat
  const batPath = path.join(dir, 'grade-ref.bat');
  if (fs.existsSync(batPath)) {
    const bat = fs.readFileSync(batPath, 'utf8');
    // Matches: copy _solution_ref.java SomeFile.java
    const m = bat.match(/copy\s+_solution_ref\.java\s+([\w.]+\.java)/i);
    if (m) return m[1];
  }

  // Strategy B: scan Runner.java for "new SomeClass()" instantiation
  const runnerPath = path.join(dir, 'Runner.java');
  if (fs.existsSync(runnerPath)) {
    const runner = fs.readFileSync(runnerPath, 'utf8');
    // Look for patterns like: new CoffeeShop(, new Solution(, etc. (not new Runner, Random, etc.)
    const matches = [...runner.matchAll(/new\s+([A-Z][A-Za-z0-9]+)\s*\(/g)]
      .map(m => m[1])
      .filter(n => n !== 'Runner' && n !== 'Random' && n !== 'ArrayList'
                && n !== 'LinkedHashMap' && n !== 'StringBuilder' && !n.startsWith('java'));
    const unique = [...new Set(matches)];
    if (unique.length === 1) return unique[0] + '.java';
    if (unique.length > 1) {
      // Prefer one that matches a known .java file in the dir
      for (const name of unique) {
        if (fs.existsSync(path.join(dir, name + '.java'))) return name + '.java';
      }
      return unique[0] + '.java';
    }
  }

  return null;
}

// ─── Step 4: Parse JaCoCo XML coverage report ────────────────────

interface CoverageMetric { covered: number; missed: number; total: number; pct: number }
interface CoverageResult {
  lines:    CoverageMetric;
  branches: CoverageMetric;
  methods:  CoverageMetric;
}

function parseJacocoXml(xmlPath: string, targetClass: string): CoverageResult | null {
  if (!fs.existsSync(xmlPath)) return null;
  const xml = fs.readFileSync(xmlPath, 'utf8');

  // Find the <class name="TargetClass" ...> or package/class block
  // JaCoCo XML uses internal class names (e.g. "CoffeeShop")
  const className = targetClass.replace('.java', '');

  // We look for <sourcefile name="TargetClass.java"> block
  const sfRegex = new RegExp(
    `<sourcefile name="${className}\\.java"[^>]*>([\\s\\S]*?)</sourcefile>`,
    'i'
  );
  const sfMatch = xml.match(sfRegex);
  const searchIn = sfMatch ? sfMatch[0] : xml; // fall back to whole file

  function extractCounter(type: string): CoverageMetric {
    const re = new RegExp(`<counter type="${type}"\\s+missed="(\\d+)"\\s+covered="(\\d+)"`, 'i');
    const m = searchIn.match(re);
    if (!m) return { covered: 0, missed: 0, total: 0, pct: 100 };
    const missed  = parseInt(m[1]);
    const covered = parseInt(m[2]);
    const total   = missed + covered;
    const pct     = total === 0 ? 100 : Math.round((covered / total) * 10000) / 100;
    return { covered, missed, total, pct };
  }

  return {
    lines:    extractCounter('LINE'),
    branches: extractCounter('BRANCH'),
    methods:  extractCounter('METHOD'),
  };
}

// ─── Step 5: Run coverage for a single problem ───────────────────

interface ProblemCoverageResult {
  slug:         string;
  status:       string;
  stats:        { passed: number; failed: number; errors: number };
  samples:      any[];
  suspiciousTestWarning: string;
  coverage:     CoverageResult | null;
}

function runCoverage(prob: Problem): ProblemCoverageResult {
  const { slug, dir } = prob;
  const result: ProblemCoverageResult = {
    slug,
    status:   'UNKNOWN',
    stats:    { passed: 0, failed: 0, errors: 0 },
    samples:  [],
    suspiciousTestWarning: '',
    coverage: null,
  };

  // ── 5a. Detect solution file ──
  const solutionFile = detectSolutionFileName(dir);
  if (!solutionFile) {
    result.status = 'ERROR_CANNOT_DETECT_SOLUTION_FILE';
    console.log(`  [${slug}] ✗ Cannot detect solution file name`);
    return result;
  }

  // ── 5b. Copy reference solution ──
  const refPath = path.join(dir, '_solution_ref.java');
  const solPath = path.join(dir, solutionFile);
  try {
    fs.copyFileSync(refPath, solPath);
  } catch (err) {
    result.status = 'ERROR_COPY_FAILED';
    return result;
  }

  // ── 5c. Compile with debug symbols (-g for accurate line coverage) ──
  const javaFiles = fs.readdirSync(dir)
    .filter(f => f.endsWith('.java') && f !== '_solution_ref.java')
    .join(' ');

  try {
    execSync(`javac -g ${javaFiles}`, {
      cwd: dir,
      stdio: 'pipe',
      timeout: 30_000,
    });
  } catch (err: any) {
    result.status = 'COMPILE_ERROR';
    console.log(`  [${slug}] ✗ Compile error`);
    return result;
  }

  // ── 5d. Run with JaCoCo agent ──
  const execFile = path.join(dir, 'jacoco.exec');
  const agentOpt = `-javaagent:${AGENT_JAR}=destfile=${execFile},includes=*`;

  let runOutput = '';
  try {
    // Note: JaCoCo agent writes to stderr — we capture both but only flag crash on non-zero exit
    const proc = execSync(`java ${agentOpt} Runner`, {
      cwd: dir,
      stdio: 'pipe',
      timeout: 120_000,
      maxBuffer: 50 * 1024 * 1024,
    });
    runOutput = proc.toString();
  } catch (err: any) {
    const stdout = err.stdout?.toString() ?? '';
    const stderr = err.stderr?.toString() ?? '';
    runOutput = stdout;
    // JaCoCo agent sometimes prints to stderr; only crash if stdout lacks DONE marker
    if (!stdout.includes('=== DONE ===')) {
      result.status = 'EXECUTION_CRASHED';
      console.log(`  [${slug}] ✗ Execution crashed`);
      console.log(`    stderr: ${stderr.substring(0, 200)}`);
    }
  }

  // ── 5e. Parse results.json ──
  const jsonPath = path.join(dir, 'results.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const rj = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const results = rj.results ?? [];

      for (const r of results) {
        if (r.status === 'PASS')  result.stats.passed++;
        else if (r.status === 'FAIL')  result.stats.failed++;
        else if (r.status === 'ERROR') result.stats.errors++;
      }

      // Sample: first, middle, last
      if (results.length > 0) {
        const indices = new Set<number>();
        indices.add(0);
        if (results.length > 1) indices.add(Math.floor(results.length / 2));
        if (results.length > 2) indices.add(results.length - 1);
        for (const idx of Array.from(indices).sort((a, b) => a - b)) {
          const r = results[idx] as any;
          let act = (r.actual   ?? '').toString().trim();
          let exp = (r.expected ?? '').toString().trim();
          if (act.length > 200) act = act.substring(0, 200) + '...';
          if (exp.length > 200) exp = exp.substring(0, 200) + '...';
          result.samples.push({ index: idx, actual: act, expected: exp });
        }
      }

      // Suspicious test detection (same as verify-pc-judge)
      const expectedCounts = new Map<string, number>();
      let isAllBoolean = true;
      for (const r of results) {
        const exp = (r.expected ?? '').toString().trim();
        expectedCounts.set(exp, (expectedCounts.get(exp) ?? 0) + 1);
        if (exp !== 'true' && exp !== 'false') isAllBoolean = false;
      }
      if (!isAllBoolean) {
        const total = result.stats.passed + result.stats.failed + result.stats.errors;
        const threshold = total / 5;
        let maxCount = 0, maxVal = '';
        for (const [val, count] of expectedCounts) {
          if (count > maxCount) { maxCount = count; maxVal = val; }
        }
        if (maxCount > threshold && total > 0) {
          const label = maxVal.length > 50 ? maxVal.substring(0, 50) + '...' : maxVal;
          result.suspiciousTestWarning =
            `POOR_TESTS: Expected value "${label}" occurred ${maxCount}/${total} times.`;
        }
      }

      if (result.status !== 'EXECUTION_CRASHED') {
        if (result.stats.failed === 0 && result.stats.errors === 0 && result.stats.passed > 0) {
          result.status = '100%_CORRECT';
        } else {
          result.status = 'HAS_FAILED_TESTS';
        }
      }
    } catch (e) {
      if (result.status === 'UNKNOWN') result.status = 'JSON_PARSE_ERROR';
    }
  } else {
    if (result.status === 'UNKNOWN') result.status = 'NO_JSON_GENERATED';
  }

  // ── 5f. Generate JaCoCo XML report ──
  const xmlPath = path.join(dir, 'coverage.xml');
  try {
    execSync(
      `java -jar "${CLI_JAR}" report "${execFile}" --classfiles "${dir}" --sourcefiles "${dir}" --xml "${xmlPath}"`,
      { cwd: dir, stdio: 'pipe', timeout: 30_000 }
    );

    // Parse coverage only for the solution class (not Runner)
    result.coverage = parseJacocoXml(xmlPath, solutionFile);

    // Patch results.json to include coverage block
    if (fs.existsSync(jsonPath) && result.coverage) {
      try {
        const rj = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        rj.coverage = result.coverage;
        fs.writeFileSync(jsonPath, JSON.stringify(rj, null, 2));
      } catch { /* non-critical */ }
    }
  } catch (err: any) {
    console.log(`  [${slug}] ⚠ JaCoCo report generation failed: ${(err as Error).message}`);
  }

  // ── 5g. Log summary ──
  const cov = result.coverage;
  const covStr = cov
    ? `lines=${cov.lines.pct}%  branches=${cov.branches.pct}%  methods=${cov.methods.pct}%`
    : 'coverage N/A';
  const passStr = `${result.stats.passed}/${result.stats.passed + result.stats.failed + result.stats.errors} pass`;
  const icon = result.status === '100%_CORRECT' ? '✓' : '✗';
  console.log(`  [${slug}] ${icon}  ${passStr}  |  ${covStr}`);
  if (result.suspiciousTestWarning) {
    console.log(`    ⚠ ${result.suspiciousTestWarning}`);
  }

  return result;
}

// ─── Step 6: Main entry point ────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  let targetSlugs: string[] = [];
  if (args[0]) {
    targetSlugs = args[0].split(';').map(s => s.trim()).filter(Boolean);
  }

  // 1. Ensure JaCoCo
  await ensureJacoco();

  // 2. Discover problems
  const problems = getProblems(targetSlugs);
  if (problems.length === 0) {
    console.log(targetSlugs.length
      ? `No problems matched: ${targetSlugs.join(', ')}`
      : 'No problems found in out/pc-judge/');
    process.exit(1);
  }

  console.log(`Running JaCoCo coverage for ${problems.length} problem(s)...\n`);

  // 3. Run each
  const details: ProblemCoverageResult[] = [];
  let perfect = 0, failedOrCrashed = 0;

  for (const prob of problems) {
    const r = runCoverage(prob);
    details.push(r);
    if (r.status === '100%_CORRECT') perfect++;
    else failedOrCrashed++;
  }

  // 4. Build aggregated report (mirrors 3_report_ref.json format)
  const report = {
    generatedAt: new Date().toISOString(),
    jacocoVersion: JACOCO_VERSION,
    total: problems.length,
    perfect,
    failedOrCrashed,
    // Aggregate coverage across all problems
    aggregateCoverage: (() => {
      const withCoverage = details.filter(d => d.coverage);
      if (withCoverage.length === 0) return null;
      const sum = (key: keyof CoverageResult, sub: 'covered' | 'missed' | 'total') =>
        withCoverage.reduce((acc, d) => acc + (d.coverage![key] as CoverageMetric)[sub], 0);
      const lineCov  = sum('lines',    'covered');
      const lineTot  = sum('lines',    'total');
      const brCov    = sum('branches', 'covered');
      const brTot    = sum('branches', 'total');
      const methCov  = sum('methods',  'covered');
      const methTot  = sum('methods',  'total');
      return {
        lines:    { covered: lineCov,  total: lineTot,  pct: lineTot  === 0 ? 100 : Math.round(lineCov  / lineTot  * 10000) / 100 },
        branches: { covered: brCov,    total: brTot,    pct: brTot    === 0 ? 100 : Math.round(brCov    / brTot    * 10000) / 100 },
        methods:  { covered: methCov,  total: methTot,  pct: methTot  === 0 ? 100 : Math.round(methCov  / methTot  * 10000) / 100 },
      };
    })(),
    details,
  };

  const outPath = path.join(PC_JUDGE, '4_report_coverage.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log('\n════════════════════════════════');
  console.log(`Complete! ✓  ${perfect}/${problems.length} perfect`);
  if (report.aggregateCoverage) {
    const ac = report.aggregateCoverage;
    console.log(`Aggregate coverage:`);
    console.log(`  Lines    : ${ac.lines.covered}/${ac.lines.total} (${ac.lines.pct}%)`);
    console.log(`  Branches : ${ac.branches.covered}/${ac.branches.total} (${ac.branches.pct}%)`);
    console.log(`  Methods  : ${ac.methods.covered}/${ac.methods.total} (${ac.methods.pct}%)`);
  }
  console.log(`Report → out/pc-judge/4_report_coverage.json`);
}

main().catch(err => {
  console.error('Fatal error:', err.message ?? err);
  process.exit(1);
});
