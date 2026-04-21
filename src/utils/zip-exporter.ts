/* ═══════════════════════════════════════════════════════════
   ZIP Exporter — Export all submissions as .java files in a
   structured ZIP archive for offline review / grading
   ═══════════════════════════════════════════════════════════ */

import JSZip from 'jszip';
import type { CatalogEntry, ProblemProgress, Submission } from '../shared/types';

export interface ZipExportInput {
  catalog: CatalogEntry[];
  allProgress: ProblemProgress[];
  allSubmissions: Submission[];
  drafts: Map<string, string>; // problemId → current draft code
}

/** Format ISO timestamp into a safe filename component: 2026-04-21T10-05-30 */
function tsToFilename(iso: string): string {
  return iso.slice(0, 19).replace(/:/g, '-');
}

/** Map RunStatus to short label for filename */
function statusLabel(status: string): string {
  switch (status) {
    case 'accepted':            return 'AC';
    case 'wrong_answer':        return 'WA';
    case 'compile_error':       return 'CE';
    case 'runtime_error':       return 'RE';
    case 'time_limit_exceeded': return 'TLE';
    default:                    return 'ERR';
  }
}

/** Build a human-readable summary markdown */
function buildSummary(
  catalog: CatalogEntry[],
  allProgress: ProblemProgress[],
  allSubmissions: Submission[],
): string {
  const progressMap = new Map(allProgress.map(p => [p.problemId, p]));
  const solved   = allProgress.filter(p => p.status === 'accepted').length;
  const attempted = allProgress.filter(p => p.status === 'attempted').length;

  const lines: string[] = [];
  lines.push('# Algo Journey — Submission Export');
  lines.push('');
  lines.push(`**Export date:** ${new Date().toLocaleString()}`);
  lines.push('');
  lines.push('## Overall Summary');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total problems | ${catalog.length} |`);
  lines.push(`| Solved (Accepted) | ${solved} |`);
  lines.push(`| Attempted (not solved) | ${attempted} |`);
  lines.push(`| Not started | ${catalog.length - solved - attempted} |`);
  lines.push(`| Total submissions | ${allSubmissions.length} |`);
  lines.push('');

  lines.push('## Progress by Topic');
  const topicStats = new Map<string, { total: number; solved: number; attempted: number }>();
  for (const e of catalog) {
    const t = topicStats.get(e.topic) ?? { total: 0, solved: 0, attempted: 0 };
    t.total++;
    const p = progressMap.get(e.id);
    if (p?.status === 'accepted') t.solved++;
    else if (p?.status === 'attempted') t.attempted++;
    topicStats.set(e.topic, t);
  }
  lines.push('| Topic | Solved / Total | Attempted |');
  lines.push('|-------|----------------|-----------|');
  for (const [topic, s] of topicStats.entries()) {
    lines.push(`| ${topic} | ${s.solved}/${s.total} | ${s.attempted} |`);
  }
  lines.push('');

  lines.push('## Problem Detail');
  lines.push('| Problem | Topic | Difficulty | Status | Attempts | Best Score |');
  lines.push('|---------|-------|------------|--------|----------|------------|');
  for (const e of catalog) {
    const p = progressMap.get(e.id);
    if (!p) continue;
    const best = p.bestResult ? `${p.bestResult.passed}/${p.bestResult.total}` : '—';
    lines.push(`| ${e.title} | ${e.topic} | ${e.difficulty} | ${p.status} | ${p.attemptCount} | ${best} |`);
  }

  return lines.join('\n');
}

export async function exportAsZip(input: ZipExportInput): Promise<void> {
  const { catalog, allProgress, allSubmissions, drafts } = input;

  const zip = new JSZip();

  // Group submissions by problemId
  const subsByProblem = new Map<string, Submission[]>();
  for (const sub of allSubmissions) {
    const list = subsByProblem.get(sub.problemId) ?? [];
    list.push(sub);
    subsByProblem.set(sub.problemId, list);
  }

  const catalogMap = new Map(catalog.map(e => [e.id, e]));

  // ── Add files per problem ────────────────────────────────
  for (const [problemId, subs] of subsByProblem.entries()) {
    const entry = catalogMap.get(problemId);
    if (!entry) continue;

    // Folder: {topic}/{problem-slug}/
    const folder = zip.folder(`${entry.topic}/${problemId}`)!;

    // Sort submissions oldest → newest
    const sorted = [...subs].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    for (const sub of sorted) {
      const code = Object.values(sub.code)[0] ?? '';
      const label = statusLabel(sub.result.status);
      const tsStr = tsToFilename(sub.timestamp);
      const kind  = sub.isSubmit ? 'submit' : 'run';
      // Filename: 2026-04-21T10-05-30_run_WA.java
      const filename = `${tsStr}_${kind}_${label}.java`;
      folder.file(filename, code);
    }

    // Current draft (if different from last submission)
    const draft = drafts.get(problemId);
    if (draft) {
      folder.file('draft.java', draft);
    }
  }

  // ── Summary markdown ────────────────────────────────────
  const summaryMd = buildSummary(catalog, allProgress, allSubmissions);
  zip.file('summary.md', summaryMd);

  // ── Generate and download ───────────────────────────────
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `algo-journey-${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
