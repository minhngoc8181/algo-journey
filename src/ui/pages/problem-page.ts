/* ═══════════════════════════════════════════════════════════
   Problem Page — Problem detail, editor, and results
   ═══════════════════════════════════════════════════════════ */

import { el, svgIcon, icons, render } from '../../shared/dom-utils';
import { exerciseLoader } from '../../exercise-engine/exercise-loader';
import { progressStore } from '../../progress/progress-store';
import { router } from '../../app/router';
import { config } from '../../app/config';
import { javaRun, warmupWorker } from '../../runner/java-runner';
import { getSolution } from '../../content/_loader';
import { generateAIPrompt, AI_LEVELS } from '../../utils/ai-prompt';
import type { AILevel } from '../../utils/ai-prompt';
import type { Exercise, RunResult, TestResult, Submission, ProblemProgress } from '../../shared/types';
import { marked } from 'marked';

// Monaco editor instance reference
let editorInstance: import('monaco-editor').editor.IStandaloneCodeEditor | null = null;

// Track the last run result for AI prompt context
let lastRunResult: RunResult | null = null;

const SPLIT_RATIO_KEY = 'algopath:split-ratio';
const DEFAULT_SPLIT = 50; // percent for left panel

const SPLIT_V_RATIO_KEY = 'algopath:split-v-ratio';
const DEFAULT_V_SPLIT = 50; // percent for editor section

export async function renderProblemPage(container: HTMLElement, slug: string): Promise<void> {
  container.className = 'app-main app-main--full';

  const exercise = await exerciseLoader.getExerciseAsync(slug);
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

  // Eagerly warm up the compile worker in the background so the first
  // Run click doesn't pay the cold-start cost of fetching compiler.wasm (~4 MB).
  // Use a short delay so this doesn't compete with the first paint / Monaco init.
  setTimeout(() => warmupWorker(), 500);

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

  // Dynamically align the floating notch with the resizer
  const appHeader = document.querySelector('.app-header') as HTMLElement;
  const isProblemMode = document.querySelector('.app-layout--problem');
  // Only adjust if the notch is active (problem mode on desktop)
  if (appHeader && isProblemMode && window.innerWidth >= 769) {
    appHeader.style.left = `calc(${clamped}vw + 2.5px)`;
  } else if (appHeader) {
    appHeader.style.left = '';
  }
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
    attrs: { style: 'font-size: var(--text-base); margin: 0;' },
  });
  const diffBadge = el('span', {
    className: `difficulty-badge difficulty-${exercise.difficulty}`,
    text: exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1),
  });
  const headerRow = el('div', {
    attrs: { style: 'display: flex; align-items: center; justify-content: center; gap: var(--space-3);' },
    children: [titleEl, diffBadge],
  });
  const header = el('div', {
    className: 'panel__header',
    // Center the title, and absolutely position the back button on the left
    attrs: { style: 'position: relative; justify-content: center;' },
    children: [
      el('div', { attrs: { style: 'position: absolute; left: var(--space-4); display: flex; align-items: center;' }, children: [backBtn] }), 
      headerRow
    ],
  });

  // Tabs
  const tabs = el('div', { className: 'tabs', id: 'left-tabs' });
  const descTab = el('div', { className: 'tab tab--active', text: 'Description', data: { leftTab: 'description' } });
  const hintTab = el('div', { className: 'tab', text: 'Hints', data: { leftTab: 'hints' } });
  tabs.append(descTab, hintTab);

  // Body
  const body = el('div', { className: 'panel__body', id: 'left-body' });

  // Statement Panel
  const statement = el('div', { className: 'problem-statement tab-panel', id: 'panel-description', attrs: { style: 'display: block;' } });
  const mdContent = el('div', { className: 'markdown-content', html: formatStatement(exercise.statement) });
  statement.appendChild(mdContent);

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
      constraintsList.appendChild(el('li', { html: formatStatement(c, true) }));
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

  const hintsPanel = el('div', { className: 'problem-hints tab-panel', id: 'panel-hints', attrs: { style: 'display: none; padding: var(--space-4) 0;' } });
  if (exercise.hints && exercise.hints.length > 0) {
    const hintsList = el('ol', { className: 'hints-list', attrs: { style: 'padding-left: var(--space-4); margin: 0; color: var(--color-text-secondary);' } });
    for (let i = 0; i < exercise.hints.length; i++) {
        hintsList.appendChild(el('li', {
            className: 'hint-item',
            attrs: { style: 'margin-bottom: var(--space-3); line-height: 1.6;' },
            html: formatStatement(exercise.hints[i]!, false)
        }));
    }
    hintsPanel.appendChild(hintsList);
  } else {
    hintsPanel.appendChild(el('div', { className: 'empty-state', text: 'No hints available for this problem.' }));
  }

  body.append(statement, hintsPanel);

  // Tab switching logic for left panel
  const leftMatchTabs = [descTab, hintTab];
  const leftMatchPanels = [statement, hintsPanel];

  leftMatchTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      leftMatchTabs.forEach(t => t.classList.remove('tab--active'));
      tab.classList.add('tab--active');
      leftMatchPanels.forEach(p => p.style.display = 'none');
      leftMatchPanels[index]!.style.display = 'block';
    });
  });

  panel.appendChild(header);
  panel.appendChild(tabs);
  panel.appendChild(body);

  return panel;
}

function createEditorPanel(exercise: Exercise, _starterCode: string): HTMLElement {
  const panel = el('div', { className: 'split-layout__right' });

  // Editor header
  const fileName = exercise.editableFiles[0]?.path ?? 'Solution.java';
  const editorHeader = el('div', { 
    className: 'panel__header', 
    // Center the filename and tag to stay balanced
    attrs: { style: 'justify-content: center; gap: var(--space-4);' },
    children: [
      el('span', { className: 'panel__header-title font-mono', text: fileName }),
      el('span', {
        className: 'tag',
        text: exercise.mode.replace('_implementation', '').replace('_', ' '),
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

  const submitBtn = el('button', {
    className: 'run-btn',
    id: 'submit-btn',
    attrs: { style: 'background: var(--color-success); margin-left: var(--space-2);' },
    children: [
      svgIcon(icons.check, 14) as unknown as Node,
      el('span', { text: 'Submit' }),
    ],
    on: {
      click: () => handleRun(exercise, true),
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

  // Feature 8: Solution button
  const solutionBtn = el('button', {
    className: 'solution-btn solution-btn--locked',
    id: 'solution-btn',
    children: [
      el('span', { className: 'solution-btn__icon', text: '🔒' }),
      el('span', { className: 'solution-btn__label', text: 'Solution' }),
    ],
    on: {
      click: () => handleShowSolution(exercise),
    },
  });
  // Initialize solution button state asynchronously
  initSolutionButton(exercise);

  // Feature 10: Ask AI button
  const aiBtn = el('button', {
    className: 'ai-btn',
    id: 'ai-btn',
    children: [
      el('span', { text: '🤖' }),
      el('span', { text: 'Ask AI' }),
    ],
    on: {
      click: () => handleAskAI(exercise),
    },
  });

  const spacer = el('div', { className: 'run-controls__spacer' });
  const controls = el('div', {
    className: 'run-controls',
    children: [resetBtn, solutionBtn, aiBtn, spacer, runBtn, submitBtn],
  });

  // Result tabs
  const resultTabs = el('div', { className: 'tabs', id: 'result-tabs' });
  const tabTestcase = el('div', { className: 'tab tab--active', text: 'Testcase', data: { resultTab: 'testcase' } });
  const tabResult = el('div', { className: 'tab', text: 'Test Result', data: { resultTab: 'result' } });
  const tabConsole = el('div', { className: 'tab', text: 'Console', data: { resultTab: 'console' } });
  resultTabs.append(tabTestcase, tabResult, tabConsole);

  // Result body
  const resultBody = el('div', {
    className: 'panel__body panel__body--no-pad',
    id: 'result-body',
  });

  const panelTestcase = el('div', { id: 'panel-testcase', className: 'tab-panel', attrs: { style: 'display: block; padding: var(--space-4); height: 100%; box-sizing: border-box;' } });
  const panelResult = el('div', { id: 'panel-result', className: 'tab-panel', attrs: { style: 'display: none; height: 100%; box-sizing: border-box;' } });
  const panelConsole = el('div', { id: 'panel-console', className: 'tab-panel', attrs: { style: 'display: none; padding: 0; height: 100%; box-sizing: border-box;' } });

  // Setup Testcase Panel
  const customInputArea = el('textarea', {
    id: 'custom-testcase-input',
    className: 'font-mono',
    attrs: {
      style: 'width: 100%; height: 100%; min-height: 100px; resize: none; padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg-tertiary); color: var(--color-text-primary); outline: none;',
      placeholder: 'Enter custom testcase input here (e.g. valid JSON args)'
    }
  });
  if (exercise.examples.length > 0) {
    customInputArea.value = exercise.examples[0]!.input;
  }
  panelTestcase.appendChild(customInputArea);

  // Setup Console Panel
  const consoleOutput = el('div', {
    id: 'console-output',
    className: 'console-output',
    text: 'No standard output.',
    attrs: { style: 'width: 100%; height: 100%; box-sizing: border-box;' }
  });
  panelConsole.appendChild(consoleOutput);

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
  panelResult.appendChild(placeholder);

  resultBody.append(panelTestcase, panelResult, panelConsole);

  // Tab switching logic
  const matchTabs = [tabTestcase, tabResult, tabConsole];
  const matchPanels = [panelTestcase, panelResult, panelConsole];
  
  matchTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      matchTabs.forEach(t => t.classList.remove('tab--active'));
      tab.classList.add('tab--active');
      matchPanels.forEach(p => p.style.display = 'none');
      matchPanels[index]!.style.display = 'block';
    });
  });

  // Editor Section (Flexible)
  const savedVPct = Number(localStorage.getItem(SPLIT_V_RATIO_KEY)) || DEFAULT_V_SPLIT;
  const editorSection = el('div', {
    className: 'editor-section',
    attrs: { style: `display: flex; flex-direction: column; flex: 0 0 ${savedVPct}%; min-height: 0; overflow: hidden;` }
  });
  editorSection.appendChild(editorHeader);
  editorContainer.style.minHeight = '0';
  editorSection.appendChild(editorContainer);
  
  // Vertical Resizer between Editor and Results
  const resizerV = el('div', { className: 'split-resizer-v', id: 'split-resizer-v', attrs: { 'aria-label': 'Drag to resize editor and results' } });
  resizerV.appendChild(el('div', { className: 'split-resizer-v__handle' }));

  // Bottom Section (Results)
  const resultSection = el('div', {
    className: 'result-section',
    attrs: { style: 'display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; overflow: hidden;' }
  });
  resultSection.appendChild(controls);
  resultSection.appendChild(resultTabs);
  // Guarantee result body expands and scrolls correctly
  resultBody.style.flex = '1';
  resultBody.style.overflowY = 'auto';
  resultBody.style.minHeight = '0'; // Prevent flex-basis auto trap causing scroll cutoff
  resultSection.appendChild(resultBody);

  panel.appendChild(editorSection);
  panel.appendChild(resizerV);
  panel.appendChild(resultSection);

  // Wire up drag-to-resize vertically
  setTimeout(() => initVerticalSplitResizer(panel, editorSection, resizerV, resultSection), 100);

  return panel;
}

function initVerticalSplitResizer(container: HTMLElement, topPanel: HTMLElement, resizer: HTMLElement, bottomPanel: HTMLElement): void {
  let dragging = false;

  resizer.addEventListener('mousedown', (e: MouseEvent) => {
    dragging = true;
    resizer.classList.add('split-resizer-v--dragging');
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!dragging) return;
    const rect = container.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    const pct = Math.min(85, Math.max(15, (offset / rect.height) * 100));
    topPanel.style.flex = `0 0 ${pct}%`;
    bottomPanel.style.flex = `1 1 auto`;
    editorInstance?.layout();
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    resizer.classList.remove('split-resizer-v--dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // Save ratio
    const match = topPanel.style.flex.match(/0 0 ([\d.]+)%/);
    if (match) localStorage.setItem(SPLIT_V_RATIO_KEY, match[1]!);
  });

  // Touch support
  resizer.addEventListener('touchstart', (e: TouchEvent) => {
    dragging = true;
    resizer.classList.add('split-resizer-v--dragging');
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', (e: TouchEvent) => {
    if (!dragging) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = container.getBoundingClientRect();
    const offset = touch.clientY - rect.top;
    const pct = Math.min(85, Math.max(15, (offset / rect.height) * 100));
    topPanel.style.flex = `0 0 ${pct}%`;
    bottomPanel.style.flex = `1 1 auto`;
    editorInstance?.layout();
  }, { passive: false });

  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    resizer.classList.remove('split-resizer-v--dragging');
    
    // Save ratio
    const match = topPanel.style.flex.match(/0 0 ([\d.]+)%/);
    if (match) localStorage.setItem(SPLIT_V_RATIO_KEY, match[1]!);
  });
}

// ── Monaco Editor ──

async function initMonacoEditor(exercise: Exercise, initialCode: string): Promise<void> {
  const container = document.getElementById('monaco-editor-container');
  if (!container) return;

  try {
    const monaco = await import('monaco-editor');

    if (!window.MonacoEnvironment) {
      window.MonacoEnvironment = {
        getWorker: function (_moduleId: any, _label: string) {
          // Fallback generic editor worker
          return new Worker(
            new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
            { type: 'module' }
          );
        }
      };
    }

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

    // Register robust Prettier formatting provider for Java
    monaco.languages.registerDocumentFormattingEditProvider('java', {
      async provideDocumentFormattingEdits(model) {
        const text = model.getValue();
        try {
          const prettier = await import('prettier/standalone');
          const prettierJava = await import('prettier-plugin-java');
          
          const formatted = await prettier.format(text, {
            parser: 'java',
            plugins: [prettierJava.default || prettierJava],
            tabWidth: 4,
            printWidth: 100,
          });

          return [{
            range: model.getFullModelRange(),
            text: formatted
          }];
        } catch (err) {
          console.error("Format error:", err);
          return [];
        }
      }
    });

    // Explicitly add Ctrl+Shift+F to trigger formatting
    editorInstance.addAction({
      id: 'format-code',
      label: 'Format Document',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
        monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
      ],
      run: (ed) => {
        ed.getAction('editor.action.formatDocument')?.run();
      }
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

async function handleRun(exercise: Exercise, isSubmit = false): Promise<void> {
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
  const btnToUpdate = isSubmit ? (document.getElementById('submit-btn') as HTMLButtonElement) : runBtn;
  if (!btnToUpdate) return;
  const originalHtml = btnToUpdate.innerHTML;
  
  btnToUpdate.disabled = true;
  btnToUpdate.classList.add('run-btn--running');
  btnToUpdate.innerHTML = '';
  btnToUpdate.appendChild(el('div', { className: 'spinner' }));
  btnToUpdate.appendChild(el('span', { text: isSubmit ? 'Submitting...' : 'Running...' }));


  try {
    // Mock run (will be replaced with real compiler/runner later)
    const result = await javaRun(exercise, code, isSubmit, exercise.limits.timeLimitMs || 1000);
    (window as any).__lastRunResult = result;
    lastRunResult = result;

    const filePath = exercise.editableFiles[0]?.path ?? 'Solution.java';
    const now = new Date().toISOString();

    // Update progress (with firstAttemptAt for Feature 8)
    const currentProgress = await progressStore.getProgress(exercise.id);
    await progressStore.saveProgress({
      problemId: exercise.id,
      exerciseVersion: exercise.version,
      status: result.status === 'accepted' ? 'accepted' : 'attempted',
      attemptCount: (currentProgress?.attemptCount ?? 0) + 1,
      firstAttemptAt: currentProgress?.firstAttemptAt ?? now,
      lastRunAt: now,
      bestResult: result.status === 'accepted'
        ? { passed: result.tests.length, total: result.tests.length }
        : currentProgress?.bestResult ?? { passed: result.tests.filter(t => t.status === 'passed').length, total: result.tests.length },
      solutionUnlocked: currentProgress?.solutionUnlocked,
    });

    // Feature 9: Save submission snapshot
    const submission: Submission = {
      id: `${exercise.id}::${now}`,
      problemId: exercise.id,
      exerciseVersion: exercise.version,
      timestamp: now,
      code: { [filePath]: code },
      isSubmit,
      result: {
        status: result.status,
        passed: result.tests.filter(t => t.status === 'passed').length,
        total: result.tests.length,
        elapsedMs: result.elapsedMs,
      },
    };
    await progressStore.saveSubmission(submission);
    await progressStore.pruneSubmissions(exercise.id, config.submissions.maxPerProblem);

    // Render results
    renderResults(result);

    // Update solution button state after run
    updateSolutionButton(exercise);

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
    btnToUpdate.disabled = false;
    btnToUpdate.classList.remove('run-btn--running');
    btnToUpdate.innerHTML = originalHtml;
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
  const panelResult = document.getElementById('panel-result');
  if (!panelResult) return;
  panelResult.innerHTML = '';

  // Switch tab automatically
  const tabResult = document.querySelector('.tabs .tab[data-result-tab="result"]') as HTMLElement;
  if(tabResult) tabResult.click();

  // Update Console
  const consoleOutput = document.getElementById('console-output');
  if (consoleOutput) {
    if (result.stdout) {
      consoleOutput.textContent = result.stdout;
    } else {
      consoleOutput.textContent = 'No standard output.';
    }
  }

  if (result.status === 'compile_error') {
    renderCompileErrors(panelResult, result);
    return;
  }

  if (result.status === 'platform_error') {
    panelResult.appendChild(el('div', {
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
  const passed   = result.tests.filter(t => t.status === 'passed').length;
  const warnings  = result.tests.filter(t => t.status === 'warning').length;
  const total = result.tests.length;
  const statusText =
    result.status === 'accepted'            ? 'Accepted' :
    result.status === 'wrong_answer'        ? 'Wrong Answer' :
    result.status === 'runtime_error'       ? 'Runtime Error' :
    result.status === 'time_limit_exceeded' ? 'Time Limit Exceeded' :
    result.status === 'compile_error'       ? 'Compilation Error' : result.status;
  const statusClass =
    result.status === 'accepted'            ? 'status-accepted' :
    result.status === 'wrong_answer'        ? 'status-wrong-answer' :
    result.status === 'runtime_error'       ? 'status-runtime-error' :
    result.status === 'time_limit_exceeded' ? 'status-tle' :
    result.status === 'compile_error'       ? 'status-compile-error' : 'status-wrong-answer';

  const summary = el('div', { className: 'result-summary', children: [
    el('span', { className: `result-summary__status ${statusClass}`, text: statusText }),
    el('span', { className: 'result-summary__stats', text:
      `${passed}/${total} tests passed · ${result.elapsedMs}ms` +
      (warnings > 0 ? ` · ⚠ ${warnings} trivial` : ''),
    }),
  ]});
  panelResult.appendChild(summary);

  // Test list
  const testList = el('div', { className: 'test-list' });
  for (const test of result.tests) {
    testList.appendChild(createTestCaseElement(test));
  }
  panelResult.appendChild(testList);
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

// ── Verdict helpers ──────────────────────────────────────

interface Verdict { label: string; cssClass: string; }

function getTestVerdict(test: TestResult): Verdict {
  switch (test.status) {
    case 'passed':  return { label: '✓ AC',  cssClass: 'test-case__status--passed'  };
    case 'failed':  return { label: '✗ WA',  cssClass: 'test-case__status--wa'      };
    case 'error':   return { label: '✗ RE',  cssClass: 'test-case__status--re'      };
    case 'tle':     return { label: '⏱ TLE', cssClass: 'test-case__status--tle'     };
    case 'warning': return { label: '⚠ TRV', cssClass: 'test-case__status--warning' };
    default:        return { label: '?',     cssClass: 'test-case__status--failed'  };
  }
}

function createTestCaseElement(test: TestResult): HTMLElement {
  const verdict = getTestVerdict(test);

  const header = el('div', { className: 'test-case__header', children: [
    el('span', { className: 'test-case__name', text: test.name }),
    el('span', { className: `test-case__status ${verdict.cssClass}`, text: verdict.label }),
  ]});

  const testCase = el('div', { className: 'test-case' });
  testCase.appendChild(header);

  // Show details: always show warning message; show full details for visible tests
  const showDetails = test.status === 'warning'
    || (test.visibility === 'visible' && (test.inputPreview || test.expectedPreview || test.actualPreview || test.message));

  if (showDetails) {
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
      body.appendChild(createTestRow(
        test.status === 'warning' ? '⚠ Warning' : 'Message',
        test.message,
      ));
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

function formatStatement(text: string, inline: boolean = false): string {
  try {
    if (inline) {
      return marked.parseInline(text) as string;
    }
    return marked.parse(text) as string;
  } catch (e) {
    // Graceful fallback
    return text.replace(/`([^`]+)`/g, '<code>$1</code>');
  }
}

// ── Feature 8: Solution unlock logic ─────────────────────

function isSolutionUnlockable(progress: ProblemProgress | null): boolean {
  if (!progress) return false;
  if (progress.solutionUnlocked) return true;
  if (progress.status === 'accepted') return true;

  const { minAttempts, minTimeMinutes } = config.solutionAccess;
  const hasEnoughAttempts = progress.attemptCount >= minAttempts;

  if (!progress.firstAttemptAt) return false;
  const firstAt = new Date(progress.firstAttemptAt).getTime();
  const elapsedMin = (Date.now() - firstAt) / 60000;
  const hasEnoughTime = elapsedMin >= minTimeMinutes;

  return hasEnoughAttempts && hasEnoughTime;
}

function getSolutionTooltip(progress: ProblemProgress | null): string {
  if (!progress) return `Attempt ≥${config.solutionAccess.minAttempts} times and wait ≥${config.solutionAccess.minTimeMinutes} min`;

  const { minAttempts, minTimeMinutes } = config.solutionAccess;
  const attempts = progress.attemptCount;
  const elapsedMin = progress.firstAttemptAt
    ? Math.floor((Date.now() - new Date(progress.firstAttemptAt).getTime()) / 60000)
    : 0;

  const parts: string[] = [];
  if (attempts < minAttempts) parts.push(`Attempts: ${attempts}/${minAttempts}`);
  if (elapsedMin < minTimeMinutes) parts.push(`Time: ${elapsedMin}/${minTimeMinutes} min`);

  return parts.length > 0 ? parts.join(' · ') : 'Click to view solution';
}

async function initSolutionButton(exercise: Exercise): Promise<void> {
  const progress = await progressStore.getProgress(exercise.id);
  applySolutionButtonState(progress);
}

async function updateSolutionButton(exercise: Exercise): Promise<void> {
  const progress = await progressStore.getProgress(exercise.id);
  applySolutionButtonState(progress);
}

function applySolutionButtonState(progress: ProblemProgress | null): void {
  const btn = document.getElementById('solution-btn') as HTMLButtonElement | null;
  if (!btn) return;

  const unlockable = isSolutionUnlockable(progress);
  const iconEl = btn.querySelector('.solution-btn__icon');

  btn.classList.toggle('solution-btn--locked', !unlockable);
  btn.classList.toggle('solution-btn--unlocked', unlockable);

  if (iconEl) {
    iconEl.textContent = progress?.solutionUnlocked ? '👁' : unlockable ? '🔓' : '🔒';
  }

  btn.title = unlockable ? 'Click to view solution' : getSolutionTooltip(progress);
}

async function handleShowSolution(exercise: Exercise): Promise<void> {
  const progress = await progressStore.getProgress(exercise.id);

  if (!isSolutionUnlockable(progress)) {
    showToast(getSolutionTooltip(progress), 'info');
    return;
  }

  // Mark as unlocked (sticky)
  if (progress && !progress.solutionUnlocked) {
    progress.solutionUnlocked = true;
    await progressStore.saveProgress(progress);
    applySolutionButtonState(progress);
  }

  // Load solution
  const solutionCode = await getSolution(exercise.id);
  if (!solutionCode) {
    showToast('No reference solution available for this problem.', 'info');
    return;
  }

  showSolutionModal(exercise.title, solutionCode);
}

function showSolutionModal(title: string, code: string): void {
  // Remove existing
  document.getElementById('solution-overlay')?.remove();

  const overlay = el('div', {
    className: 'solution-overlay',
    id: 'solution-overlay',
    on: {
      click: (e: Event) => {
        if (e.target === overlay) overlay.remove();
      },
    },
  });

  const modal = el('div', { className: 'solution-overlay__content' });

  const header = el('div', { className: 'solution-overlay__header', children: [
    el('h3', { text: `Reference Solution — ${title}`, attrs: { style: 'margin: 0; font-size: var(--text-base);' } }),
    el('button', {
      className: 'btn-icon solution-overlay__close',
      text: '✕',
      on: { click: () => overlay.remove() },
    }),
  ]});

  const codeBlock = el('pre', {
    className: 'solution-overlay__code font-mono',
    children: [el('code', { text: code })],
  });

  modal.append(header, codeBlock);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // ESC to close
  const escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

// ── Feature 10: AI Prompt ────────────────────────────────

function handleAskAI(exercise: Exercise): void {
  // Remove existing popup if any
  document.getElementById('ai-popup')?.remove();

  const code = editorInstance?.getValue() ??
    (document.querySelector('#monaco-editor-container textarea') as HTMLTextAreaElement | null)?.value ?? '';

  const popup = el('div', { className: 'ai-popup', id: 'ai-popup' });

  const popupHeader = el('div', { className: 'ai-popup__header', text: 'Choose support level:' });
  popup.appendChild(popupHeader);

  for (const level of AI_LEVELS) {
    const item = el('button', {
      className: 'ai-popup__item',
      children: [
        el('span', { className: 'ai-popup__icon', text: level.icon }),
        el('div', { className: 'ai-popup__text', children: [
          el('span', { className: 'ai-popup__label', text: level.label }),
          el('span', { className: 'ai-popup__desc', text: level.description }),
        ]}),
      ],
      on: {
        click: () => {
          const prompt = generateAIPrompt({
            exercise,
            code,
            lastResult: lastRunResult,
            level: level.value as AILevel,
          });
          navigator.clipboard.writeText(prompt).then(() => {
            showToast('✓ Prompt copied! Paste in ChatGPT, Gemini, or your preferred AI.', 'success');
          }).catch(() => {
            // Fallback: show in a modal
            showSolutionModal('AI Prompt', prompt);
          });
          popup.remove();
        },
      },
    });
    popup.appendChild(item);
  }

  // Position near the AI button
  const aiBtn = document.getElementById('ai-btn');
  if (aiBtn) {
    const rect = aiBtn.getBoundingClientRect();
    popup.style.position = 'fixed';
    popup.style.bottom = `${window.innerHeight - rect.top + 4}px`;
    popup.style.left = `${rect.left}px`;
  }

  document.body.appendChild(popup);

  // Close on click outside
  const closeHandler = (e: MouseEvent) => {
    if (!popup.contains(e.target as Node) && e.target !== document.getElementById('ai-btn')) {
      popup.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  setTimeout(() => document.addEventListener('click', closeHandler), 0);
}

// ── Toast notification ───────────────────────────────────

function showToast(message: string, type: 'success' | 'info' | 'error' = 'info'): void {
  // Remove existing toast
  document.getElementById('aj-toast')?.remove();

  const toast = el('div', {
    className: `aj-toast aj-toast--${type}`,
    id: 'aj-toast',
    text: message,
  });

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add('aj-toast--visible'));

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.remove('aj-toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

export function setEditorValue(code: string): void {
  if (editorInstance) {
    editorInstance.setValue(code);
  } else {
    const ta = document.querySelector('#monaco-editor-container textarea') as HTMLTextAreaElement | null;
    if (ta) ta.value = code;
  }
}

export function disposeProblemPage(): void {
  if (editorInstance) {
    editorInstance.dispose();
    editorInstance = null;
  }
  lastRunResult = null;

  // Clean up dynamic header positioning
  const appHeader = document.querySelector('.app-header') as HTMLElement;
  if (appHeader) {
    appHeader.style.left = '';
  }

  // Clean up popups
  document.getElementById('solution-overlay')?.remove();
  document.getElementById('ai-popup')?.remove();
  document.getElementById('aj-toast')?.remove();
}
