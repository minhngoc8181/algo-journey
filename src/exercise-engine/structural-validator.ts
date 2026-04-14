/* ═══════════════════════════════════════════════════════════
   Structural Validator — Pre-compile checks on learner code
   Uses regex-based heuristics (future: Tree-sitter AST)
   ═══════════════════════════════════════════════════════════ */

import type { Exercise, CompileDiagnostic } from '../shared/types';

export interface ValidationResult {
  valid: boolean;
  diagnostics: CompileDiagnostic[];
}

/**
 * Validate learner code against exercise structural requirements.
 * Runs before compilation to give fast feedback.
 */
export function validateStructure(
  code: string,
  exercise: Exercise,
): ValidationResult {
  const diagnostics: CompileDiagnostic[] = [];
  const file = exercise.editableFiles[0]?.path ?? 'Solution.java';
  const lines = code.split('\n');

  // ── Required class check ──
  if (exercise.requiredStructure?.className) {
    const className = exercise.requiredStructure.className;
    const classPattern = new RegExp(`\\bclass\\s+${escapeRegex(className)}\\b`);

    if (!classPattern.test(code)) {
      diagnostics.push({
        file,
        line: 1,
        column: 1,
        message: `Required class '${className}' not found. Your code must define a class named '${className}'.`,
        severity: 'error',
      });
    }
  }

  // ── Required method check ──
  if (exercise.requiredStructure?.methodName) {
    const methodName = exercise.requiredStructure.methodName;
    const methodPattern = new RegExp(`\\b${escapeRegex(methodName)}\\s*\\(`);

    if (!methodPattern.test(code)) {
      diagnostics.push({
        file,
        line: findBestLine(lines, 'class'),
        column: 1,
        message: `Required method '${methodName}' not found. Check the method name and spelling.`,
        severity: 'error',
      });
    }
  }

  // ── Required methods check (class_implementation mode) ──
  if (exercise.requiredStructure?.requiredMethods) {
    for (const methodSig of exercise.requiredStructure.requiredMethods) {
      // Extract just the method name from the signature
      const match = methodSig.match(/(\w+)\s*\(/);
      if (match) {
        const methodName = match[1]!;
        const methodPattern = new RegExp(`\\b${escapeRegex(methodName)}\\s*\\(`);
        if (!methodPattern.test(code)) {
          diagnostics.push({
            file,
            line: findBestLine(lines, 'class'),
            column: 1,
            message: `Required method '${methodName}' not found. Expected signature: ${methodSig}`,
            severity: 'error',
          });
        }
      }
    }
  }

  // ── Balanced braces ──
  const braceBalance = checkBraceBalance(code);
  if (braceBalance !== 0) {
    const lastLine = lines.length;
    diagnostics.push({
      file,
      line: lastLine,
      column: 1,
      message: braceBalance > 0
        ? `Missing ${braceBalance} closing brace(s) '}'`
        : `Extra ${Math.abs(braceBalance)} closing brace(s) '}'`,
      severity: 'error',
    });
  }

  // ── Balanced parentheses ──
  const parenBalance = checkBalance(code, '(', ')');
  if (parenBalance !== 0) {
    diagnostics.push({
      file,
      line: lines.length,
      column: 1,
      message: parenBalance > 0
        ? `Missing ${parenBalance} closing parenthesis ')'`
        : `Extra ${Math.abs(parenBalance)} closing parenthesis ')'`,
      severity: 'error',
    });
  }

  // ── Unclosed string literal ──
  const unclosedString = findUnclosedString(lines);
  if (unclosedString > 0) {
    diagnostics.push({
      file,
      line: unclosedString,
      column: 1,
      message: 'Unclosed string literal',
      severity: 'error',
    });
  }

  // ── Empty method body warning ──
  if (exercise.requiredStructure?.methodName) {
    const methodName = exercise.requiredStructure.methodName;
    const hasOnlyReturn = checkOnlyDefaultReturn(code, methodName);
    if (hasOnlyReturn) {
      diagnostics.push({
        file,
        line: findBestLine(lines, methodName),
        column: 1,
        message: `Method '${methodName}' appears to only contain the default return. Did you implement the solution?`,
        severity: 'warning',
      });
    }
  }

  return {
    valid: diagnostics.filter(d => d.severity === 'error').length === 0,
    diagnostics,
  };
}

// ── Helpers ──

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function checkBraceBalance(code: string): number {
  let balance = 0;
  let inString = false;
  let inLineComment = false;
  let inBlockComment = false;
  let stringChar = '';

  for (let i = 0; i < code.length; i++) {
    const ch = code[i]!;
    const next = code[i + 1] ?? '';

    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      if (ch === '\\') { i++; continue; }
      if (ch === stringChar) inString = false;
      continue;
    }

    if (ch === '/' && next === '/') { inLineComment = true; i++; continue; }
    if (ch === '/' && next === '*') { inBlockComment = true; i++; continue; }
    if (ch === '"' || ch === "'") { inString = true; stringChar = ch; continue; }

    if (ch === '{') balance++;
    if (ch === '}') balance--;
  }

  return balance;
}

function checkBalance(code: string, open: string, close: string): number {
  let balance = 0;
  for (const ch of code) {
    if (ch === open) balance++;
    if (ch === close) balance--;
  }
  return balance;
}

function findUnclosedString(lines: string[]): number {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    let inString = false;
    let escaped = false;

    for (const ch of line) {
      if (escaped) { escaped = false; continue; }
      if (ch === '\\') { escaped = true; continue; }
      if (ch === '"') inString = !inString;
    }

    if (inString) return i + 1;
  }
  return 0;
}

function findBestLine(lines: string[], keyword: string): number {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]!.includes(keyword)) return i + 1;
  }
  return 1;
}

function checkOnlyDefaultReturn(code: string, methodName: string): boolean {
  // Check if the method body only contains a simple default return
  const methodRegex = new RegExp(
    `${escapeRegex(methodName)}\\s*\\([^)]*\\)\\s*\\{([^}]*)\\}`,
    's'
  );
  const match = code.match(methodRegex);
  if (!match) return false;

  const body = match[1]!.trim();
  // Common default returns
  const defaultReturns = [
    'return -1;',
    'return 0;',
    'return false;',
    'return null;',
    'return "";',
    'return new int[]{-1, -1};',
    'return new String[0];',
    'return new int[0];',
    '// Write your code here\n        return -1;',
    '// Write your code here\n        return 0;',
    '// Write your code here\n        return false;',
  ];

  const normalizedBody = body.replace(/\s+/g, ' ').trim();
  return defaultReturns.some(dr =>
    normalizedBody === dr.replace(/\s+/g, ' ').trim() ||
    normalizedBody === `// Write your code here ${dr}`
  );
}
