/* ═══════════════════════════════════════════════════════════
   Catalog Page — Problem listing with filters
   Filters are synced to URL hash params for sharing.
   ═══════════════════════════════════════════════════════════ */

import { el, svgIcon, icons, render } from '../../shared/dom-utils';
import { exerciseLoader } from '../../exercise-engine/exercise-loader';
import { progressStore } from '../../progress/progress-store';
import { router } from '../../app/router';
import { exportAsZip } from '../../utils/zip-exporter';
import { generateProgressPrompt } from '../../utils/ai-progress';
import type { CatalogEntry, Topic, Difficulty, ProgressStatus } from '../../shared/types';

// Active tag filter state (module-level so it persists across re-renders)
// Now supports multiple tags (AND logic)
let activeTagFilters: Set<string> = new Set();

export async function renderCatalogPage(container: HTMLElement): Promise<void> {
  container.className = 'app-main';

  // Restore filters from URL hash params
  const route = router.getCurrentRoute();
  activeTagFilters = new Set(route.tags ?? []);

  const pageHeader = createPageHeader();
  const statsBar = await createStatsBar();
  const filterBar = createFilterBar(route);
  const grid = el('div', { className: 'problem-grid', id: 'problem-grid' });

  render(container, pageHeader, statsBar, filterBar, grid);

  await renderProblemList(grid);
}

function createPageHeader(): HTMLElement {
  const title = el('h1', { className: 'page-title', text: 'Problems' });
  const subtitle = el('p', {
    className: 'page-subtitle',
    text: 'Practice Java exercises and track your progress',
  });
  return el('div', {
    className: 'page-header animate-fade-in',
    children: [title, subtitle],
  });
}

async function createStatsBar(): Promise<HTMLElement> {
  const catalog = exerciseLoader.getCatalog();
  const allProgress = await progressStore.getAllProgress();

  const solved = allProgress.filter(p => p.status === 'accepted').length;
  const attempted = allProgress.filter(p => p.status === 'attempted').length;

  const bar = el('div', { className: 'stats-bar animate-fade-in' });

  const stats = [
    { value: String(catalog.length), label: 'Total' },
    { value: String(solved), label: 'Solved', cls: 'status-accepted' },
    { value: String(attempted), label: 'Attempted', cls: 'status-runtime-error' },
    { value: String(catalog.length - solved - attempted), label: 'Remaining' },
  ];

  for (const stat of stats) {
    const valueEl = el('span', {
      className: `stat-item__value ${stat.cls ?? ''}`,
      text: stat.value,
    });
    const labelEl = el('span', { className: 'stat-item__label', text: stat.label });
    bar.appendChild(el('div', { className: 'stat-item', children: [valueEl, labelEl] }));
  }

  // Feature 9: Export ZIP button
  const exportBtn = el('button', {
    className: 'export-btn',
    id: 'export-submissions-btn',
    attrs: { title: 'Download all submissions as .java files in a ZIP' },
    children: [
      el('span', { text: '📥' }),
      el('span', { text: 'Export' }),
    ],
    on: {
      click: () => exportAllSubmissions(),
    },
  });
  bar.appendChild(exportBtn);

  // Feature 9B: AI Progress Analysis button
  const aiProgressBtn = el('button', {
    className: 'ai-progress-btn',
    id: 'ai-progress-btn',
    attrs: { title: 'Generate an AI prompt to analyze your learning progress' },
    children: [
      el('span', { text: '🧠' }),
      el('span', { text: 'AI Progress' }),
    ],
    on: {
      click: () => handleAIProgress(),
    },
  });
  bar.appendChild(aiProgressBtn);

  return bar;
}

async function exportAllSubmissions(): Promise<void> {
  const btn = document.getElementById('export-submissions-btn') as HTMLButtonElement | null;
  if (btn) { btn.textContent = 'Exporting…'; btn.disabled = true; }

  try {
    const catalog = exerciseLoader.getCatalog();
    const allProgress = await progressStore.getAllProgress();
    const allSubmissions = await progressStore.getAllSubmissions();

    // Collect current drafts for all problems with submissions
    const drafts = new Map<string, string>();
    const problemsWithActivity = new Set(
      [...allSubmissions.map(s => s.problemId), ...allProgress.map(p => p.problemId)]
    );
    for (const id of problemsWithActivity) {
      const draft = await progressStore.getDraft(id);
      const code = draft ? Object.values(draft.files)[0] : undefined;
      if (code) drafts.set(id, code);
    }

    await exportAsZip({ catalog, allProgress, allSubmissions, drafts });
  } catch (err) {
    console.error('[export] Failed to export ZIP:', err);
    showCatalogToast('Export failed. See console for details.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>📥</span><span>Export</span>';
    }
  }
}

async function handleAIProgress(): Promise<void> {
  const btn = document.getElementById('ai-progress-btn') as HTMLButtonElement | null;
  if (btn) { btn.textContent = 'Generating…'; btn.disabled = true; }

  try {
    const catalog = exerciseLoader.getCatalog();
    const allProgress = await progressStore.getAllProgress();
    const allSubmissions = await progressStore.getAllSubmissions();

    if (allProgress.length === 0 && allSubmissions.length === 0) {
      showCatalogToast('No progress data yet — solve some problems first!', 'info');
      return;
    }

    const prompt = generateProgressPrompt({ catalog, allProgress, allSubmissions });

    await navigator.clipboard.writeText(prompt);
    showCatalogToast('🧠 AI Progress prompt copied! Paste in ChatGPT or Gemini for a personalized study plan.', 'success');
  } catch (err) {
    console.error('[ai-progress] Failed:', err);
    showCatalogToast('Failed to generate prompt. See console for details.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>🧠</span><span>AI Progress</span>';
    }
  }
}

function showCatalogToast(message: string, type: 'success' | 'info' | 'error' = 'info'): void {
  document.getElementById('aj-catalog-toast')?.remove();
  const toast = document.createElement('div');
  toast.id = 'aj-catalog-toast';
  toast.className = `aj-toast aj-toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('aj-toast--visible'));
  setTimeout(() => {
    toast.classList.remove('aj-toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}


function createFilterBar(route: ReturnType<typeof router.getCurrentRoute>): HTMLElement {
  // Search
  const searchIcon = svgIcon(icons.search, 16);
  searchIcon.classList.add('filter-bar__search-icon');
  const searchInput = el('input', {
    className: 'filter-bar__search',
    id: 'filter-search',
    attrs: { type: 'text', placeholder: 'Search problems...' },
  });
  // Restore search from URL
  if (route.search) {
    (searchInput as HTMLInputElement).value = route.search;
  }
  const searchWrapper = el('div', {
    className: 'filter-bar__search-wrapper',
    children: [searchIcon as unknown as Node, searchInput],
  });

  // Topic filter
  const topicSelect = el('select', {
    className: 'filter-select',
    id: 'filter-topic',
  });
  topicSelect.appendChild(el('option', { text: 'All Topics', attrs: { value: 'all' } }));
  const topics: Topic[] = ['arrays', 'strings', 'loops', 'conditionals', 'recursion', 'searching', 'sorting', 'math', 'design', 'collections', 'linked-list', 'mono-stack'];
  for (const topic of topics) {
    topicSelect.appendChild(el('option', { text: capitalize(topic), attrs: { value: topic } }));
  }
  // Restore topic from URL
  if (route.topic) {
    (topicSelect as HTMLSelectElement).value = route.topic;
  }

  // Difficulty filter
  const diffSelect = el('select', {
    className: 'filter-select',
    id: 'filter-difficulty',
  });
  diffSelect.appendChild(el('option', { text: 'All Difficulties', attrs: { value: 'all' } }));
  const diffs: Difficulty[] = ['easy', 'medium', 'hard'];
  for (const diff of diffs) {
    diffSelect.appendChild(el('option', { text: capitalize(diff), attrs: { value: diff } }));
  }
  // Restore difficulty from URL
  if (route.difficulty) {
    (diffSelect as HTMLSelectElement).value = route.difficulty;
  }

  // Wire up events
  const handleFilter = () => {
    syncFiltersToUrl();
    const grid = document.getElementById('problem-grid');
    if (grid) renderProblemList(grid);
  };

  searchInput.addEventListener('input', debounce(handleFilter, 200));
  topicSelect.addEventListener('change', handleFilter);
  diffSelect.addEventListener('change', handleFilter);

  // Active tags container (shows chips for each selected tag)
  const tagsContainer = el('div', {
    className: 'tag-filter__container',
    id: 'active-tags-container',
  });

  return el('div', {
    className: 'filter-bar animate-fade-in',
    children: [searchWrapper, topicSelect, diffSelect, tagsContainer],
  });
}

/** Sync current filter state from DOM + activeTagFilters to URL */
function syncFiltersToUrl(): void {
  const topicEl = document.getElementById('filter-topic') as HTMLSelectElement | null;
  const diffEl = document.getElementById('filter-difficulty') as HTMLSelectElement | null;
  const searchEl = document.getElementById('filter-search') as HTMLInputElement | null;

  router.updateCatalogParams({
    topic: topicEl?.value || undefined,
    difficulty: diffEl?.value || undefined,
    tags: activeTagFilters.size > 0 ? [...activeTagFilters] : undefined,
    search: searchEl?.value || undefined,
  });
}

/** Render the active tag chips */
function renderTagChips(): void {
  const container = document.getElementById('active-tags-container');
  if (!container) return;
  container.innerHTML = '';

  if (activeTagFilters.size === 0) return;

  for (const tag of activeTagFilters) {
    const chip = el('div', {
      className: 'tag-filter__chip',
      children: [
        el('span', { className: 'tag-filter__label', text: tag }),
        el('button', {
          className: 'tag-filter__clear',
          text: '\u00d7',
          attrs: { 'aria-label': `Remove tag filter: ${tag}`, title: `Remove tag: ${tag}` },
          on: {
            click: () => {
              activeTagFilters.delete(tag);
              syncFiltersToUrl();
              renderTagChips();
              const grid = document.getElementById('problem-grid');
              if (grid) renderProblemList(grid);
            },
          },
        }),
      ],
    });
    container.appendChild(chip);
  }

  // "Clear all" button when multiple tags
  if (activeTagFilters.size > 1) {
    const clearAll = el('button', {
      className: 'tag-filter__clear-all',
      text: 'Clear all',
      on: {
        click: () => {
          activeTagFilters.clear();
          syncFiltersToUrl();
          renderTagChips();
          const grid = document.getElementById('problem-grid');
          if (grid) renderProblemList(grid);
        },
      },
    });
    container.appendChild(clearAll);
  }
}

async function renderProblemList(grid: HTMLElement): Promise<void> {
  const searchEl = document.getElementById('filter-search') as HTMLInputElement | null;
  const topicEl = document.getElementById('filter-topic') as HTMLSelectElement | null;
  const diffEl = document.getElementById('filter-difficulty') as HTMLSelectElement | null;

  // Render tag filter chips
  renderTagChips();

  const entries = exerciseLoader.filterCatalog({
    search: searchEl?.value,
    topic: (topicEl?.value as Topic | 'all') ?? 'all',
    difficulty: (diffEl?.value as Difficulty | 'all') ?? 'all',
    tags: activeTagFilters.size > 0 ? [...activeTagFilters] : undefined,
  });

  grid.innerHTML = '';

  if (entries.length === 0) {
    const empty = el('div', { className: 'empty-state', children: [
      svgIcon(icons.search, 48) as unknown as Node,
      el('p', { text: 'No problems found matching your filters.' }),
    ]});
    grid.appendChild(empty);
    return;
  }

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    const status = await progressStore.getProgressStatus(entry.id);
    const card = createProblemCard(entry, status, i);
    grid.appendChild(card);
  }
}

function createProblemCard(entry: CatalogEntry, status: ProgressStatus, index: number): HTMLElement {
  // Status icon
  const statusEl = el('div', { className: `problem-card__status problem-card__status--${status}` });
  if (status === 'accepted') {
    statusEl.appendChild(svgIcon(icons.check, 14));
  } else if (status === 'attempted') {
    statusEl.textContent = '\u2026';
  }

  // Info
  const title = el('span', { className: 'problem-card__title', text: entry.title });
  const meta = el('div', { className: 'problem-card__meta', children: [
    el('span', { className: 'problem-card__topic', text: capitalize(entry.topic) }),
    el('span', { text: '\u2022' }),
    el('span', { text: `~${entry.estimatedMinutes} min` }),
  ]});
  const info = el('div', { className: 'problem-card__info', children: [title, meta] });

  // Difficulty badge
  const diffBadge = el('span', {
    className: `difficulty-badge difficulty-${entry.difficulty}`,
    text: capitalize(entry.difficulty),
  });

  // Tags — clickable for multi-tag filtering
  const tagsEl = el('div', { className: 'problem-card__tags' });
  for (const tag of entry.tags.slice(0, 4)) {
    const isActive = activeTagFilters.has(tag);
    const tagEl = el('span', {
      className: `tag tag--clickable${isActive ? ' tag--active' : ''}`,
      text: tag,
      attrs: { title: isActive ? `Remove tag filter: ${tag}` : `Add tag filter: ${tag}` },
      on: {
        click: (e: Event) => {
          e.stopPropagation(); // prevent card navigation
          if (activeTagFilters.has(tag)) {
            activeTagFilters.delete(tag);
          } else {
            activeTagFilters.add(tag);
          }
          syncFiltersToUrl();
          const grid = document.getElementById('problem-grid');
          if (grid) renderProblemList(grid);
        },
      },
    });
    tagsEl.appendChild(tagEl);
  }

  const card = el('div', {
    className: 'problem-card',
    id: `problem-card-${entry.slug}`,
    data: { slug: entry.slug },
    children: [statusEl, info, diffBadge, tagsEl],
    on: {
      click: () => {
        router.navigate({ page: 'problem', slug: entry.slug });
      },
    },
  });

  // Staggered animation
  card.style.animationDelay = `${index * 30}ms`;
  card.classList.add('animate-fade-in');

  return card;
}

// ── Helpers ──

function capitalize(s: string): string {
  return s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function debounce(fn: () => void, ms: number): () => void {
  let timeout: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, ms);
  };
}
