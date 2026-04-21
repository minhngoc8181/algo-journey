/* ═══════════════════════════════════════════════════════════
   AI Progress Prompt — Generate a rich learning progress
   analysis prompt for AI tutoring (ChatGPT / Gemini)
   ═══════════════════════════════════════════════════════════ */

import type { CatalogEntry, ProblemProgress, Submission } from '../shared/types';

export interface ProgressAnalysisInput {
  catalog: CatalogEntry[];
  allProgress: ProblemProgress[];
  allSubmissions: Submission[];
}

// ── Internal helpers ─────────────────────────────────────

function difficultyRank(d: string): number {
  return d === 'easy' ? 1 : d === 'medium' ? 2 : 3;
}

// ── Main generator ────────────────────────────────────────

export function generateProgressPrompt(input: ProgressAnalysisInput): string {
  const { catalog, allProgress, allSubmissions } = input;

  const progressMap = new Map(allProgress.map(p => [p.problemId, p]));
  const subMap = new Map<string, Submission[]>();
  for (const sub of allSubmissions) {
    const list = subMap.get(sub.problemId) ?? [];
    list.push(sub);
    subMap.set(sub.problemId, list);
  }

  // ── Aggregate counts ─────────────────────────────────
  const solved    = allProgress.filter(p => p.status === 'accepted').length;
  const attempted = allProgress.filter(p => p.status === 'attempted').length;
  const notStarted = catalog.length - solved - attempted;
  const totalSubs  = allSubmissions.length;

  // ── Per-topic stats ───────────────────────────────────
  type TopicStats = {
    total: number;
    easy: number; easySolved: number;
    medium: number; mediumSolved: number;
    hard: number; hardSolved: number;
    solved: number; attempted: number;
    totalAttempts: number; acceptedAttempts: number;
    tags: Set<string>; solvedTags: Set<string>;
  };
  const topicMap = new Map<string, TopicStats>();

  for (const entry of catalog) {
    if (!topicMap.has(entry.topic)) {
      topicMap.set(entry.topic, {
        total: 0, easy: 0, easySolved: 0,
        medium: 0, mediumSolved: 0, hard: 0, hardSolved: 0,
        solved: 0, attempted: 0,
        totalAttempts: 0, acceptedAttempts: 0,
        tags: new Set(), solvedTags: new Set(),
      });
    }
    const t = topicMap.get(entry.topic)!;
    t.total++;

    // Tag coverage
    for (const tag of entry.tags) t.tags.add(tag);

    const p = progressMap.get(entry.id);
    if (entry.difficulty === 'easy') {
      t.easy++;
      if (p?.status === 'accepted') { t.easySolved++; }
    } else if (entry.difficulty === 'medium') {
      t.medium++;
      if (p?.status === 'accepted') { t.mediumSolved++; }
    } else {
      t.hard++;
      if (p?.status === 'accepted') { t.hardSolved++; }
    }

    if (p?.status === 'accepted') {
      t.solved++;
      t.acceptedAttempts += p.attemptCount;
      for (const tag of entry.tags) t.solvedTags.add(tag);
    } else if (p?.status === 'attempted') {
      t.attempted++;
      t.totalAttempts += (p.attemptCount ?? 0);
    }
  }

  // ── Struggling problems (attempted ≥ 3, not solved) ──
  const struggling: {
    title: string; topic: string; difficulty: string;
    attempts: number; bestPassed: number; total: number;
    tags: string[]; learningGoals: string[];
  }[] = [];

  for (const entry of catalog) {
    const p = progressMap.get(entry.id);
    if (p && p.status !== 'accepted' && p.attemptCount >= 3) {
      const subs = subMap.get(entry.id) ?? [];
      const bestPassed = subs.reduce((max, s) => Math.max(max, s.result.passed), 0);
      const total = subs[0]?.result.total ?? 0;
      struggling.push({
        title: entry.title,
        topic: entry.topic,
        difficulty: entry.difficulty,
        attempts: p.attemptCount,
        bestPassed,
        total,
        tags: entry.tags,
        learningGoals: entry.learningGoals ?? [],
      });
    }
  }
  struggling.sort((a, b) => b.attempts - a.attempts);

  // ── Solved problems detail ────────────────────────────
  const solvedProblems = allProgress
    .filter(p => p.status === 'accepted')
    .map(p => {
      const entry = catalog.find(e => e.id === p.problemId);
      return entry ? { entry, progress: p } : null;
    })
    .filter(Boolean) as { entry: CatalogEntry; progress: ProblemProgress }[];
  solvedProblems.sort((a, b) => b.progress.lastRunAt.localeCompare(a.progress.lastRunAt));

  // ── Not started problems (for AI to suggest next) ────
  const notStartedProblems = catalog
    .filter(e => !progressMap.has(e.id) || progressMap.get(e.id)!.status === 'not_started')
    .sort((a, b) => {
      const da = difficultyRank(a.difficulty), db = difficultyRank(b.difficulty);
      if (da !== db) return da - db;
      return (a.order ?? 9999) - (b.order ?? 9999);
    });

  // ── All concepts covered (solved tags) ───────────────
  const solvedTagSet = new Set<string>();
  const unsolvedTagSet = new Set<string>();
  for (const entry of catalog) {
    const p = progressMap.get(entry.id);
    if (p?.status === 'accepted') {
      for (const t of entry.tags) solvedTagSet.add(t);
    } else {
      for (const t of entry.tags) unsolvedTagSet.add(t);
    }
  }
  // Tags not yet covered at all
  const uncoveredTags = [...unsolvedTagSet].filter(t => !solvedTagSet.has(t));

  // ═════════════════════════════════════════════════════
  // BUILD PROMPT
  // ═════════════════════════════════════════════════════
  const L: string[] = [];

  L.push('You are an expert computer science tutor for a Java programming course.');
  L.push('Below is a detailed breakdown of a student\'s progress on an algorithmic practice platform.');
  L.push('');
  L.push('Please provide:');
  L.push('1. **Overall Assessment** — a concise summary of their current level');
  L.push('2. **Strength Analysis** — topics and skills they have mastered');
  L.push('3. **Weakness Analysis** — concepts they are struggling with or haven\'t covered');
  L.push('4. **Next Steps** — a prioritized list of 5-8 specific problems to tackle next (from the "Available Problems" list below), with a short reason for each');
  L.push('5. **Study Tips** — 2-3 actionable, personalized recommendations');
  L.push('');
  L.push('---');
  L.push('');

  // Section 1: Overview
  L.push('## 1. Overall Statistics');
  L.push(`| Metric | Value |`);
  L.push(`|--------|-------|`);
  L.push(`| Total problems on platform | ${catalog.length} |`);
  L.push(`| ✅ Solved (Accepted) | ${solved} (${Math.round(solved / catalog.length * 100)}%) |`);
  L.push(`| 🔄 Attempted (not solved) | ${attempted} |`);
  L.push(`| ⬜ Not started | ${notStarted} |`);
  L.push(`| Total run/submit attempts | ${totalSubs} |`);
  L.push(`| Unique concepts (tags) mastered | ${solvedTagSet.size} |`);
  L.push(`| Unique concepts (tags) not yet mastered | ${uncoveredTags.length} |`);
  L.push('');

  // Section 2: Topic breakdown
  L.push('## 2. Progress by Topic');
  L.push('| Topic | Easy | Medium | Hard | Total Solved | Avg attempts (ac.) | Concepts covered |');
  L.push('|-------|------|--------|------|-------------|-------------------|-----------------|');
  for (const [topic, s] of topicMap.entries()) {
    const avgAtt = s.solved > 0 ? (s.acceptedAttempts / s.solved).toFixed(1) : '—';
    const coveredTags = s.solved > 0 ? [...s.solvedTags].slice(0, 5).join(', ') : '—';
    L.push(`| **${topic}** | ${s.easySolved}/${s.easy} | ${s.mediumSolved}/${s.medium} | ${s.hardSolved}/${s.hard} | ${s.solved}/${s.total} | ${avgAtt} | ${coveredTags} |`);
  }
  L.push('');

  // Section 3: Solved problems with detail
  L.push('## 3. Solved Problems (Most Recent First)');
  if (solvedProblems.length === 0) {
    L.push('_No problems solved yet._');
  } else {
    L.push('| Problem | Topic | Difficulty | Attempts | Concepts (tags) | Learning Goals |');
    L.push('|---------|-------|------------|----------|-----------------|----------------|');
    for (const { entry, progress } of solvedProblems) {
      const goals = (entry.learningGoals ?? []).join('; ') || '—';
      L.push(`| ${entry.title} | ${entry.topic} | ${entry.difficulty} | ${progress.attemptCount} | ${entry.tags.join(', ')} | ${goals} |`);
    }
  }
  L.push('');

  // Section 4: Struggling problems
  if (struggling.length > 0) {
    L.push('## 4. Problems with Difficulties (Attempted ≥ 3 times, not solved)');
    L.push('| Problem | Topic | Difficulty | Attempts | Best Score | Tags | What to learn |');
    L.push('|---------|-------|------------|----------|------------|------|---------------|');
    for (const p of struggling.slice(0, 10)) {
      const goals = p.learningGoals.join('; ') || '—';
      L.push(`| ${p.title} | ${p.topic} | ${p.difficulty} | ${p.attempts} | ${p.bestPassed}/${p.total} tests | ${p.tags.join(', ')} | ${goals} |`);
    }
    L.push('');
  }

  // Section 5: Concepts not yet covered
  if (uncoveredTags.length > 0) {
    L.push('## 5. Concepts Not Yet Mastered');
    L.push(uncoveredTags.map(t => `\`${t}\``).join(', '));
    L.push('');
  }

  // Section 6: Full available problem list (not started, sorted easy→hard)
  L.push('## 6. Available Problems (Not Yet Started)');
  L.push('_Use this list to recommend specific next problems to the student._');
  L.push('');
  L.push('| Problem | Topic | Difficulty | Tags | Summary | Learning Goals |');
  L.push('|---------|-------|------------|------|---------|----------------|');
  for (const entry of notStartedProblems) {
    const goals = (entry.learningGoals ?? []).join('; ') || '—';
    const prereqs = (entry.prerequisites ?? []).length > 0
      ? ` *(prereqs: ${entry.prerequisites!.join(', ')})*`
      : '';
    L.push(`| ${entry.title}${prereqs} | ${entry.topic} | ${entry.difficulty} | ${entry.tags.join(', ')} | ${entry.summary} | ${goals} |`);
  }
  L.push('');

  // Section 7: Attempted but not solved (still in progress)
  const inProgress = catalog
    .filter(e => progressMap.get(e.id)?.status === 'attempted')
    .map(e => ({ entry: e, progress: progressMap.get(e.id)! }));

  if (inProgress.length > 0) {
    L.push('## 7. Currently Struggling (Attempted, Not Solved)');
    L.push('| Problem | Topic | Difficulty | Attempts | Tags |');
    L.push('|---------|-------|------------|----------|------|');
    for (const { entry, progress } of inProgress) {
      L.push(`| ${entry.title} | ${entry.topic} | ${entry.difficulty} | ${progress.attemptCount} | ${entry.tags.join(', ')} |`);
    }
    L.push('');
  }

  L.push('---');
  L.push('');
  L.push('## Your Task');
  L.push('Based on all the data above, please provide a thorough analysis following the 5-part structure requested at the top.');
  L.push('Be specific: reference actual problem names, topic names, and concept tags from the data.');
  L.push('For "Next Steps", pick problems from **Section 6** that best fill the student\'s skill gaps, considering their current level and prerequisites.');

  return L.join('\n');
}
