#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pcJudgeDir = path.resolve(__dirname, '../docs/pc-judge');

interface Problem {
  slug: string;
  path: string;
}

// Lấy danh sách các bài đã generate
function getProblems(): Problem[] {
  if (!fs.existsSync(pcJudgeDir)) return [];
  const entries = fs.readdirSync(pcJudgeDir, { withFileTypes: true });
  const problems: Problem[] = [];
  
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const probPath = path.join(pcJudgeDir, entry.name);
    if (fs.existsSync(path.join(probPath, 'Runner.java'))) {
      problems.push({ slug: entry.name, path: probPath });
    }
  }
  return problems;
}

// 1. Chạy tất cả test cho mã giả (starter code)
function runStarter() {
  const problems = getProblems();
  console.log(`Starting execution of ${problems.length} problems (Starter Code)...`);
  
  const report = { total: problems.length, success: 0, crashes: 0, compile_errors: 0, details: [] as any[] };
  
  for (const prob of problems) {
    console.log(`[${prob.slug}] Running grade.bat...`);
    let status = 'SUCCESS', logs = '';
    let stats = { passed: 0, failed: 0, errors: 0 };
    
    try {
      logs = execSync('cmd /c grade.bat', { cwd: prob.path, stdio: 'pipe', maxBuffer: 10 * 1024 * 1024 }).toString();
    } catch (err: any) {
      logs = (err.stdout?.toString() || '') + '\n' + (err.stderr?.toString() || '');
      status = logs.includes('COMPILE ERROR') ? 'COMPILE_ERROR' : 'EXECUTION_CRASHED';
    }
    
    // Thu dọn JSON nếu được sinh ra trước khi crash
    const jsonPath = path.join(prob.path, 'results.json');
    if (fs.existsSync(jsonPath)) {
      try {
        const resultJSON = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        for (const res of resultJSON.results || []) {
          if (res.status === 'PASS') stats.passed++;
          else if (res.status === 'FAIL') stats.failed++;
          else if (res.status === 'ERROR') stats.errors++;
        }
      } catch (e) {}
    } else {
      if (status === 'SUCCESS') status = 'NO_JSON_GENERATED';
    }
    
    if (status === 'SUCCESS') report.success++;
    else if (status === 'COMPILE_ERROR') report.compile_errors++;
    else report.crashes++;
    
    report.details.push({ slug: prob.slug, status, stats });
  }
  
  const reportPath = path.join(pcJudgeDir, '1_report_starter.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nComplete! 🎉`);
  console.log(`Report saved to docs/pc-judge/1_report_starter.json`);
  console.log(`Success: ${report.success}, Compile Errors: ${report.compile_errors}, Crashes: ${report.crashes}`);
}

// 2. Clear kết quả
function cleanResults() {
  const problems = getProblems();
  let count = 0;
  for (const prob of problems) {
    const files = fs.readdirSync(prob.path);
    for (const file of files) {
      if (file === 'results.json' || file.endsWith('.class')) {
        fs.unlinkSync(path.join(prob.path, file));
        count++;
      }
    }
  }
  console.log(`Cleaned ${count} files (.class & results.json) across ${problems.length} problems.`);
}

// 3. Chạy đè reference code và xác thực 100% Pass
function verifyRefs(targetSlugs: string[] = []) {
  let problems = getProblems();
  if (targetSlugs && targetSlugs.length > 0) {
    problems = problems.filter(p => targetSlugs.includes(p.slug));
    if (problems.length === 0) {
      console.log(`No problems matched the provided slugs: ${targetSlugs.join(', ')}`);
      return;
    }
  }
  console.log(`Verifying Reference Solutions for ${problems.length} problems...`);
  
  const report = { total: problems.length, perfect: 0, failedOrCrashed: 0, details: [] as any[] };
  
  for (const prob of problems) {
    console.log(`[${prob.slug}] Running grade-ref.bat...`);
    let status = 'SUCCESS', logs = '';
    let stats = { passed: 0, failed: 0, errors: 0 };
    
    try {
      logs = execSync('cmd /c grade-ref.bat', { cwd: prob.path, stdio: 'pipe', maxBuffer: 100 * 1024 * 1024 }).toString();
    } catch (err: any) {
      logs = (err.stdout?.toString() || '') + '\n' + (err.stderr?.toString() || '');
      status = 'COMPILE_OR_CRASH_ERROR';
    }
    
    let suspiciousTestWarning = '';
    let samples: any[] = [];
      
    const jsonPath = path.join(prob.path, 'results.json');
    if (fs.existsSync(jsonPath)) {
      try {
        const resultJSON = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        
        if (resultJSON.results && resultJSON.results.length > 0) {
            const results = resultJSON.results;
            const indices = new Set<number>();
            indices.add(0);
            if (results.length > 1) {
                indices.add(Math.floor(results.length / 2));
                indices.add(results.length - 1);
            }
            
            for (const idx of Array.from(indices).sort((a, b) => a - b)) {
                const res = results[idx] as any;
                let exp = res.expected ? res.expected.toString().trim() : '';
                let act = res.actual ? res.actual.toString().trim() : '';
                if (exp.length > 200) exp = exp.substring(0, 200) + '...';
                if (act.length > 200) act = act.substring(0, 200) + '...';
                samples.push({ index: idx, actual: act, expected: exp });
            }
        }

        const expectedCounts = new Map<string, number>();
        let isAllBoolean = true;

        for (const res of resultJSON.results || []) {
          if (res.status === 'PASS') stats.passed++;
          else if (res.status === 'FAIL') stats.failed++;
          else if (res.status === 'ERROR') stats.errors++;
          
          const exp = res.expected ? res.expected.toString().trim() : '';
          expectedCounts.set(exp, (expectedCounts.get(exp) || 0) + 1);
          if (exp !== 'true' && exp !== 'false') {
            isAllBoolean = false;
          }
        }
        
        if (stats.failed === 0 && stats.errors === 0 && stats.passed > 0) {
          status = '100%_CORRECT';
        } else if (status === 'SUCCESS') {
          status = 'HAS_FAILED_TESTS';
        }

        // Kiểm tra chất lượng generator: Tần suất lặp lại expected
        if (!isAllBoolean) {
          const totalTests = stats.passed + stats.failed + stats.errors;
          const threshold = totalTests / 5;
          let maxCount = 0;
          let maxVal = '';
          for (const [val, count] of expectedCounts.entries()) {
             if (count > maxCount) {
                maxCount = count;
                maxVal = val;
             }
          }
          if (maxCount > threshold && totalTests > 0) {
             suspiciousTestWarning = `POOR_TESTS: Expected value "${maxVal.length > 50 ? maxVal.substring(0, 50) + '...' : maxVal}" repeatedly occurred ${maxCount}/${totalTests} times.`;
             // Cập nhật lại status để report gom nhóm rõ ràng hơn
             if (status === '100%_CORRECT') status = '100%_CORRECT_BUT_POOR_TESTS';
          }
        }

      } catch (e) {}
    } else {
      if (status === 'SUCCESS') status = 'NO_JSON_GENERATED';
    }
    
    if (status === '100%_CORRECT') report.perfect++;
    else report.failedOrCrashed++;
    
    if (status !== '100%_CORRECT' && status !== '100%_CORRECT_BUT_POOR_TESTS') {
       console.log(`  -> FAILED: ${status}. Passed: ${stats.passed}, Failed: ${stats.failed}, Errors: ${stats.errors}`);
    } else if (suspiciousTestWarning) {
       console.log(`  -> ⚠️ WARNING: ${suspiciousTestWarning}`);
    }
    
    report.details.push({ slug: prob.slug, status, stats, samples, suspiciousTestWarning });
  }
  
  const reportPath = path.join(pcJudgeDir, '3_report_ref.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nComplete! 🎉`);
  console.log(`Perfect: ${report.perfect}/${problems.length}. Failed: ${report.failedOrCrashed}`);
  console.log(`Report saved to docs/pc-judge/3_report_ref.json`);
}

const args = process.argv.slice(2);
if (args.includes('run-starter')) runStarter();
else if (args.includes('clean')) cleanResults();
else if (args.length > 0 && args[0] === 'verify-refs') {
  let targetSlugs: string[] = [];
  if (args[1]) targetSlugs = args[1].split(';').map(s => s.trim()).filter(Boolean);
  verifyRefs(targetSlugs);
}
else {
  console.log('Usage: npm run pc-judge:verify <command>');
  console.log('\nCommands:');
  console.log('  run-starter   Chạy grade.bat (chạy Starter Code sinh viên) và in ra JSON báo cáo 1_report_starter.json');
  console.log('  clean         Xóa file .class và results.json trên toàn bộ các thư mục bài.');
  console.log('  verify-refs [slugs]  Copy đè đáp án mẫu _solution_ref.java, chạy, và xác định PASS toàn bộ test case. Điền kèm danh sách (slug1;slug2) để test riêng.');
}
