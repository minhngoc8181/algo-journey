/* ═══════════════════════════════════════════════════════════
   Problem Page — Problem detail, editor, and results
   ═══════════════════════════════════════════════════════════ */

import { el, svgIcon, icons, render } from '../../shared/dom-utils';
import { exerciseLoader } from '../../exercise-engine/exercise-loader';
import { progressStore } from '../../progress/progress-store';
import { router } from '../../app/router';
import { mockRun } from '../../runner/mock-runner';
import type { Exercise, RunResult, TestResult } from '../../shared/types';

// Monaco editor instance reference
let editorInstance: import('monaco-editor').editor.IStandaloneCodeEditor | null = null;

const SPLIT_RATIO_KEY = 'algopath:split-ratio';
const DEFAULT_SPLIT = 50; // percent for left panel

export async function renderProblemPage(container: HTMLElement, slug: string): Promise<void> {
  container.className = 'app-main app-main--full';

  const exercise = exerciseLoader.getExercise(slug);
  if (!exercise) {
    render(container, el('div', { className: 'empty-state', children: [
      el('h2', { text: 'Problem not found' }),
      el('p', { text: `No exercise with slug "${slug}" exists.` }),
      el('button', { className: 'btn btn-primary', text: '← Back to catalog', on: {
        click: () => router.navigate({ page: 'catalog' }),
      }}),
    ]}));
    return;
  }

  // Track as recent
  progressStore.addRecentProblem(slug);

  // Load draft if exists
  const draft = await progressStore.getDraft(exercise.id);
  const starterCode = draft?.files[exercise.editableFiles[0]?.path ?? ''] ?? exercise.editableFiles[0]?.starter ?? '';

  // Build layout
  const layout = el('div', { className: 'split-layout', id: 'split-layout' });

  // ── Left Panel: Problem Statement ──
  const leftPanel = createStatementPanel(exercise);
  leftPanel.id = 'split-left';

  // ── Draggable Resizer ──
  const resizer = el('div', { className: 'split-resizer', id: 'split-resizer', attrs: { 'aria-label': 'Drag to resize panels' } });
  resizer.appendChild(el('div', { className: 'split-resizer__handle' }));

  // ── Right Panel: Editor + Results ──
  const rightPanel = createEditorPanel(exercise, starterCode);
  rightPanel.id = 'split-right';

  layout.appendChild(leftPanel);
  layout.appendChild(resizer);
  layout.appendChild(rightPanel);

  render(container, layout);

  // Restore saved ratio
  const savedRatio = Number(localStorage.getItem(SPLIT_RATIO_KEY)) || DEFAULT_SPLIT;
  applySplitRatio(layout, savedRatio);

  // Wire up drag-to-resize
  initSplitResizer(layout, resizer);

  // Initialize Monaco editor after DOM is ready
  setTimeout(() => initMonacoEditor(exercise, starterCode), 50);
}

/** Apply a left-panel percentage to the split layout */
function applySplitRatio(layout: HTMLElement, leftPct: number): void {
  const clamped = Math.min(80, Math.max(20, leftPct));
  const rightPct = 100 - clamped;
  layout.style.gridTemplateColumns = `${clamped}fr 5px ${rightPct}fr`;
}

/** Wire up mouse drag resizing on the split resizer handle */
function initSplitResizer(layout: HTMLElement, resizer: HTMLElement): void {
  let dragging = false;

  resizer.addEventListener('mousedown', (e: MouseEvent) => {
    dragging = true;
    resizer.classList.add('split-resizer--dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!dragging) return;
    const rect = layout.getBoundingClientRect();
    const offset = e.clientX - rect.left;
    const pct = (offset / rect.width) * 100;
    applySplitRatio(layout, pct);
    // Also trigger Monaco layout update
    editorInstance?.layout();
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    resizer.classList.remove('split-resizer--dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    // Save ratio
    const cols = layout.style.gridTemplateColumns;
    const match = cols.match(/^([\d.]+)fr/);
    if (match) {
      localStorage.setItem(SPLIT_RATIO_KEY, match[1]!);
    }
  });

  // Touch support
  resizer.addEventListener('touchstart', (e: TouchEvent) => {
    dragging = true;
    resizer.classList.add('split-resizer--dragging');
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', (e: TouchEvent) => {
    if (!dragging) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = layout.getBoundingClientRect();
    const pct = ((touch.clientX - rect.left) / rect.width) * 100;
    applySplitRatio(layout, pct);
    editorInstance?.layout();
  }, { passive: false });

  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    resizer.classList.remove('split-resizer--dragging');
    const cols = layout.style.gridTemplateColumns;
    const match = cols.match(/^([\d.]+)fr/);
    if (match) localStorage.setItem(SPLIT_RATIO_KEY, match[1]!);
  });
}

function createStatementPanel(exercise: Exercise): HTMLElement {
  const panel = el('div', { className: 'split-layout__left' });

  // Header with back button
  const backBtn = el('button', {
    className: 'btn-icon',
    children: [svgIcon(icons.arrowLeft, 18) as unknown as Node],
    on: { click: () => router.navigate({ page: 'catalog' }) },
  });
  const titleEl = el('h1', {
    className: 'font-semibold',
    text: exercise.title,
    attrs: { style: 'font-size: var(--text-xl); margin: 0;' },
  });
  const diffBadge = el('span', {
    className: `difficulty-badge difficulty-${exercise.difficulty}`,
    text: exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1),
  });
  const headerRow = el('div', {
    attrs: { style: 'display: flex; align-items: center; gap: var(--space-3);' },
    children: [titleEl, diffBadge],
  });
  const header = el('div', {
    className: 'panel__header',
    children: [backBtn, headerRow],
  });

  // Tabs
  const tabs = el('div', { className: 'tabs' });
  const descTab = el('div', { className: 'tab tab--active', text: 'Description', data: { tab: 'description' } });
  tabs.appendChild(descTab);

  // Body
  const body = el('div', { className: 'panel__body' });

  // Statement
  const statement = el('div', { className: 'problem-statement' });
  statement.appendChild(el('p', { html: formatStatement(exercise.statement) }));

  // Examples
  if (exercise.examples.length > 0) {
    statement.appendChild(el('h3', { text: 'Examples' }));
    for (let i = 0; i < exercise.examples.length; i++) {
      const ex = exercise.examples[i]!;
      const block = el('div', { className: 'example-block' });
      block.appendChild(el('div', { className: 'example-block__header', text: `Example ${i + 1}` }));

      const content = el('div', { className: 'example-block__content' });
      content.appendChild(createExampleRow('Input:', ex.input));
      content.appendChild(createExampleRow('Output:', ex.output));

      if (ex.explanation) {
        block.appendChild(content);
        block.appendChild(el('div', { className: 'example-block__explanation', text: ex.explanation }));
      } else {
        block.appendChild(content);
      }

      statement.appendChild(block);
    }
  }

  // Constraints
  if (exercise.constraints.length > 0) {
    statement.appendChild(el('h3', { text: 'Constraints' }));
    const constraintsList = el('ul', { className: 'constraints-list' });
    for (const c of exercise.constraints) {
      constraintsList.appendChild(el('li', { html: formatStatement(c) }));
    }
    statement.appendChild(constraintsList);
  }

  // Learning goals
  if (exercise.learningGoals && exercise.learningGoals.length > 0) {
    statement.appendChild(el('h3', { text: 'Learning Goals' }));
    const goalsList = el('ul', { className: 'constraints-list' });
    for (const g of exercise.learningGoals) {
      goalsList.appendChild(el('li', { text: g }));
    }
    statement.appendChild(goalsList);
  }

  body.appendChild(statement);
  panel.appendChild(header);
  panel.appendChild(tabs);
  panel.appendChild(body);

  return panel;
}

function createEditorPanel(exercise: Exercise, _starterCode: string): HTMLElement {
  const panel = el('div', { className: 'split-layout__right' });

  // Editor header
  const fileName = exercise.editableFiles[0]?.path ?? 'Solution.java';
  const editorHeader = el('div', { className: 'panel__header', children: [
    el('span', { className: 'panel__header-title font-mono', text: fileName }),
    el('span', {
      className: 'tag',
      text: exercise.mode.replace('_', ' '),
      attrs: { style: 'text-transform: capitalize;' },
    }),
  ]});

  // Editor container
  const editorContainer = el('div', {
    className: 'editor-container',
    id: 'monaco-editor-container',
  });

  // Run controls
  const runBtn = el('button', {
    className: 'run-btn',
    id: 'run-btn',
    children: [
      svgIcon(icons.play, 14) as unknown as Node,
      el('span', { text: 'Run' }),
    ],
    on: {
      click: () => handleRun(exercise),
    },
  });

  const resetBtn = el('button', {
    className: 'reset-btn',
    id: 'reset-btn',
    text: 'Reset Code',
    on: {
      click: () => handleReset(exercise),
    },
  });

  const spacer = el('div', { className: 'run-controls__spacer' });
  const controls = el('div', {
    className: 'run-controls',
    children: [resetBtn, spacer, runBtn],
  });

  // Result tabs
  const resultTabs = el('div', { className: 'tabs', id: 'result-tabs' });
  resultTabs.appendChild(el('div', {
    className: 'tab tab--active',
    text: 'Result',
    data: { resultTab: 'result' },
  }));
  resultTabs.appendChild(el('div', {
    className: 'tab',
    text: 'Console',
    data: { resultTab: 'console' },
  }));

  // Result body
  const resultBody = el('div', {
    className: 'panel__body',
    id: 'result-body',
    attrs: { style: 'max-height: 200px; min-height: 120px;' },
  });

  const placeholder = el('div', {
    className: 'empty-state',
    attrs: { style: 'padding: var(--space-8);' },
    children: [
      svgIcon(icons.code, 32) as unknown as Node,
      el('p', {
        className: 'text-sm text-tertiary',
        text: 'Run your code to see results here',
      }),
    ],
  });
  resultBody.appendChild(placeholder);

  panel.appendChild(editorHeader);
  panel.appendChild(editorContainer);
  panel.appendChild(controls);
  panel.appendChild(resultTabs);
  panel.appendChild(resultBody);

  return panel;
}

// ── Monaco Editor ──

async function initMonacoEditor(exercise: Exercise, initialCode: string): Promise<void> {
  const container = document.getElementById('monaco-editor-container');
  if (!container) return;

  try {
    const monaco = await import('monaco-editor');

    // Dispose previous editor if exists
    if (editorInstance) {
      editorInstance.dispose();
      editorInstance = null;
    }

    editorInstance = monaco.editor.create(container, {
      value: initialCode,
      language: 'java',
      theme: document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'vs-dark'
        : 'vs',
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      padding: { top: 12, bottom: 12 },
      renderLineHighlight: 'line',
      tabSize: 4,
      wordWrap: 'off',
      automaticLayout: true,
    });

    // Auto-save draft on change
    let saveTimeout: ReturnType<typeof setTimeout>;
    editorInstance.onDidChangeModelContent(() => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const code = editorInstance?.getValue() ?? '';
        const filePath = exercise.editableFiles[0]?.path ?? 'Solution.java';
        progressStore.saveDraft({
          problemId: exercise.id,
          exerciseVersion: exercise.version,
          updatedAt: new Date().toISOString(),
          files: { [filePath]: code },
        });
      }, 1000);
    });

    // Theme observer
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme');
      monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  } catch (e) {
    console.warn('Monaco Editor failed to load, using textarea fallback:', e);
    createTextareaFallback(container, exercise, initialCode);
  }
}

function createTextareaFallback(container: HTMLElement, exercise: Exercise, code: string): void {
  const textarea = el('textarea', {
    className: 'font-mono',
    attrs: {
      style: 'width: 100%; height: 100%; background: var(--color-editor-bg); color: var(--color-text-primary); border: none; padding: 12px; resize: none; font-size: 14px; line-height: 1.6; tab-size: 4;',
      spellcheck: 'false',
    },
  });
  textarea.value = code;

  // Auto-save
  let saveTimeout: ReturnType<typeof setTimeout>;
  textarea.addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      const filePath = exercise.editableFiles[0]?.path ?? 'Solution.java';
      progressStore.saveDraft({
        problemId: exercise.id,
        exerciseVersion: exercise.version,
        updatedAt: new Date().toISOString(),
        files: { [filePath]: textarea.value },
      });
    }, 1000);
  });

  container.appendChild(textarea);
}

// ── Run / Reset Handlers ──

async function handleRun(exercise: Exercise): Promise<void> {
  const runBtn = document.getElementById('run-btn') as HTMLButtonElement | null;
  if (!runBtn) return;

  // Get code from Monaco or textarea
  let code = '';
  if (editorInstance) {
    code = editorInstance.getValue();
  } else {
    const textarea = document.querySelector('#monaco-editor-container textarea') as HTMLTextAreaElement | null;
    code = textarea?.value ?? '';
  }

  // Update button state
  runBtn.disabled = true;
  runBtn.classList.add('run-btn--running');
  runBtn.innerHTML = '';
  runBtn.appendChild(el('div', { className: 'spinner' }));
  runBtn.appendChild(el('span', { text: 'Running...' }));

  try {
    // Mock run (will be replaced with real compiler/runner later)
    const result = await mockRun(exercise, code);

    // Update progress
    const currentProgress = await progressStore.getProgress(exercise.id);
    await progressStore.saveProgress({
      problemId: exercise.id,
      exerciseVersion: exercise.version,
      status: result.status === 'accepted' ? 'accepted' : 'attempted',
      attemptCount: (currentProgress?.attemptCount ?? 0) + 1,
      lastRunAt: new Date().toISOString(),
      bestResult: result.status === 'accepted'
        ? { passed: result.tests.length, total: result.tests.length }
        : currentProgress?.bestResult ?? { passed: result.tests.filter(t => t.status === 'passed').length, total: result.tests.length },
    });

    // Render results
    renderResults(result);

  } catch (err) {
    renderResults({
      problemId: exercise.id,
      exerciseVersion: exercise.version,
      status: 'platform_error',
      elapsedMs: 0,
      tests: [],
      runtimeError: String(err),
    });
  } finally {
    runBtn.disabled = false;
    runBtn.classList.remove('run-btn--running');
    runBtn.innerHTML = '';
    runBtn.appendChild(svgIcon(icons.play, 14) as unknown as Node);
    runBtn.appendChild(el('span', { text: 'Run' }));
  }
}

function handleReset(exercise: Exercise): void {
  const starterCode = exercise.editableFiles[0]?.starter ?? '';
  if (editorInstance) {
    editorInstance.setValue(starterCode);
  } else {
    const textarea = document.querySelector('#monaco-editor-container textarea') as HTMLTextAreaElement | null;
    if (textarea) textarea.value = starterCode;
  }
}

// ── Result Renderer ──

function renderResults(result: RunResult): void {
  const body = document.getElementById('result-body');
  if (!body) return;
  body.innerHTML = '';

  if (result.status === 'compile_error') {
    renderCompileErrors(body, result);
    return;
  }

  if (result.status === 'platform_error') {
    body.appendChild(el('div', {
      className: 'compile-errors',
      children: [el('div', {
        className: 'compile-error-item',
        children: [
          el('span', { className: 'compile-error-item__location', text: 'Platform Error' }),
          el('span', { className: 'compile-error-item__message', text: result.runtimeError ?? 'Unknown error' }),
        ],
      })],
    }));
    return;
  }

  // Summary
  const passed = result.tests.filter(t => t.status === 'passed').length;
  const total = result.tests.length;
  const statusText = result.status === 'accepted' ? 'Accepted' :
    result.status === 'wrong_answer' ? 'Wrong Answer' :
    result.status === 'runtime_error' ? 'Runtime Error' :
    result.status === 'time_limit_exceeded' ? 'Time Limit Exceeded' : result.status;
  const statusClass = result.status === 'accepted' ? 'status-accepted' : 'status-wrong-answer';

  const summary = el('div', { className: 'result-summary', children: [
    el('span', { className: `result-summary__status ${statusClass}`, text: statusText }),
    el('span', { className: 'result-summary__stats', text: `${passed}/${total} tests passed · ${result.elapsedMs}ms` }),
  ]});

  body.appendChild(summary);

  // Test list
  const testList = el('div', { className: 'test-list' });
  for (const test of result.tests) {
    testList.appendChild(createTestCaseElement(test));
  }
  body.appendChild(testList);
}

function renderCompileErrors(body: HTMLElement, result: RunResult): void {
  const errorsDiv = el('div', { className: 'compile-errors' });

  const header = el('div', { className: 'result-summary', children: [
    el('span', { className: 'result-summary__status status-compile-error', text: 'Compilation Error' }),
  ]});
  body.appendChild(header);

  for (const diag of result.compileDiagnostics ?? []) {
    errorsDiv.appendChild(el('div', {
      className: 'compile-error-item',
      children: [
        el('span', { className: 'compile-error-item__location', text: `Line ${diag.line}:${diag.column}` }),
        el('span', { className: 'compile-error-item__message', text: diag.message }),
      ],
    }));
  }
  body.appendChild(errorsDiv);
}

function createTestCaseElement(test: TestResult): HTMLElement {
  const statusClass = test.status === 'passed' ? 'test-case__status--passed' : 'test-case__status--failed';
  const statusText = test.status === 'passed' ? '✓ Passed' : '✗ Failed';

  const header = el('div', { className: 'test-case__header', children: [
    el('span', { className: 'test-case__name', text: test.name }),
    el('span', { className: `test-case__status ${statusClass}`, text: statusText }),
  ]});

  const testCase = el('div', { className: 'test-case' });
  testCase.appendChild(header);

  // Show details for visible tests
  if (test.visibility === 'visible' && (test.inputPreview || test.expectedPreview || test.actualPreview)) {
    const body = el('div', { className: 'test-case__body' });

    if (test.inputPreview) {
      body.appendChild(createTestRow('Input', test.inputPreview));
    }
    if (test.expectedPreview) {
      body.appendChild(createTestRow('Expected', test.expectedPreview));
    }
    if (test.actualPreview) {
      body.appendChild(createTestRow('Actual', test.actualPreview));
    }
    if (test.message) {
      body.appendChild(createTestRow('Message', test.message));
    }

    testCase.appendChild(body);
  }

  return testCase;
}

function createTestRow(label: string, value: string): HTMLElement {
  return el('div', { className: 'test-case__row', children: [
    el('span', { className: 'test-case__label', text: label }),
    el('div', { className: 'test-case__value', text: value }),
  ]});
}

// ── Helpers ──

function createExampleRow(label: string, value: string): HTMLElement {
  return el('div', { className: 'example-block__row', children: [
    el('span', { className: 'example-block__label', text: label }),
    el('span', { className: 'example-block__value font-mono', text: value }),
  ]});
}

function formatStatement(text: string): string {
  // Simple markdown-like: backtick to <code>
  return text.replace(/`([^`]+)`/g, '<code>$1</code>');
}

export function disposeProblemPage(): void {
  if (editorInstance) {
    editorInstance.dispose();
    editorInstance = null;
  }
}
