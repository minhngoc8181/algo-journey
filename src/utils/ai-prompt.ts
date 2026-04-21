/* ═══════════════════════════════════════════════════════════
   AI Prompt Generator — Contextual prompt for AI tutoring
   ═══════════════════════════════════════════════════════════ */

import type { Exercise, RunResult } from '../shared/types';

export type AILevel = 'hint' | 'explain' | 'debug' | 'review';

export interface AILevelOption {
  value: AILevel;
  label: string;
  icon: string;
  description: string;
}

export const AI_LEVELS: AILevelOption[] = [
  { value: 'hint',    icon: '💡', label: 'Hint',    description: 'Conceptual hint without code' },
  { value: 'explain', icon: '📖', label: 'Explain', description: 'Explain the approach' },
  { value: 'debug',   icon: '🐛', label: 'Debug',   description: 'Help find the bug' },
  { value: 'review',  icon: '🔍', label: 'Review',  description: 'Review and improve' },
];

const LEVEL_INSTRUCTIONS: Record<AILevel, string> = {
  hint:    'Give me a conceptual hint to help me think in the right direction. Do NOT show any solution code.',
  explain: 'Explain the algorithmic approach and key data structures needed. You may use pseudocode but avoid a full Java solution.',
  debug:   'Help me identify the bug in my code. Point to the problematic area and explain why it fails, but let me write the fix.',
  review:  'Review my solution for correctness, efficiency, and code quality. Suggest concrete improvements.',
};

export function generateAIPrompt(options: {
  exercise: Exercise;
  code: string;
  lastResult?: RunResult | null;
  level: AILevel;
}): string {
  const { exercise, code, lastResult, level } = options;

  const lines: string[] = [];

  lines.push('I\'m working on a Java programming exercise. Please help me at the level indicated below.');
  lines.push('');

  // ── Problem context ──
  lines.push(`## Problem: ${exercise.title}`);
  lines.push('');
  lines.push(exercise.statement);
  lines.push('');

  // Constraints
  if (exercise.constraints.length > 0) {
    lines.push('### Constraints');
    for (const c of exercise.constraints) {
      lines.push(`- ${c}`);
    }
    lines.push('');
  }

  // Examples
  if (exercise.examples.length > 0) {
    lines.push('### Examples');
    for (let i = 0; i < exercise.examples.length; i++) {
      const ex = exercise.examples[i]!;
      lines.push(`**Example ${i + 1}:**`);
      lines.push(`- Input: \`${ex.input}\``);
      lines.push(`- Output: \`${ex.output}\``);
      if (ex.explanation) lines.push(`- Explanation: ${ex.explanation}`);
    }
    lines.push('');
  }

  // ── Student code ──
  lines.push('## My Current Code');
  lines.push('```java');
  lines.push(code.trim());
  lines.push('```');
  lines.push('');

  // ── Last run result (if any) ──
  if (lastResult && lastResult.status !== 'accepted') {
    lines.push('## Last Run Result');
    const statusLabels: Record<string, string> = {
      wrong_answer: 'Wrong Answer',
      runtime_error: 'Runtime Error',
      compile_error: 'Compilation Error',
      time_limit_exceeded: 'Time Limit Exceeded',
      platform_error: 'Platform Error',
    };
    lines.push(`**Status:** ${statusLabels[lastResult.status] ?? lastResult.status}`);

    const passed = lastResult.tests.filter(t => t.status === 'passed').length;
    lines.push(`**Tests passed:** ${passed}/${lastResult.tests.length}`);

    if (lastResult.status === 'compile_error' && lastResult.compileDiagnostics) {
      lines.push('');
      lines.push('**Compile errors:**');
      for (const d of lastResult.compileDiagnostics.slice(0, 5)) {
        lines.push(`- Line ${d.line}: ${d.message}`);
      }
    }

    if (lastResult.runtimeError) {
      lines.push('');
      lines.push(`**Runtime error:** ${lastResult.runtimeError}`);
    }

    // Show visible failed test details
    const failedVisible = lastResult.tests.filter(
      t => t.visibility === 'visible' && t.status !== 'passed'
    );
    if (failedVisible.length > 0) {
      lines.push('');
      lines.push('**Failed test details (visible):**');
      for (const t of failedVisible.slice(0, 3)) {
        lines.push(`- **${t.name}:**`);
        if (t.inputPreview)    lines.push(`  - Input: \`${t.inputPreview}\``);
        if (t.expectedPreview) lines.push(`  - Expected: \`${t.expectedPreview}\``);
        if (t.actualPreview)   lines.push(`  - Actual: \`${t.actualPreview}\``);
        if (t.message)         lines.push(`  - Message: ${t.message}`);
      }
    }
    lines.push('');
  }

  // ── Support level ──
  lines.push(`## Support Level: ${level.charAt(0).toUpperCase() + level.slice(1)}`);
  lines.push('');
  lines.push(LEVEL_INSTRUCTIONS[level]);

  return lines.join('\n');
}
