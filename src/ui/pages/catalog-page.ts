/* ═══════════════════════════════════════════════════════════
   Catalog Page — Problem listing with filters
   ═══════════════════════════════════════════════════════════ */

import { el, svgIcon, icons, render } from '../../shared/dom-utils';
import { exerciseLoader } from '../../exercise-engine/exercise-loader';
import { progressStore } from '../../progress/progress-store';
import { router } from '../../app/router';
import type { CatalogEntry, Topic, Difficulty, ProgressStatus } from '../../shared/types';

// Active tag filter state (module-level so it persists across re-renders)
let activeTagFilter: string | null = null;

export async function renderCatalogPage(container: HTMLElement): Promise<void> {
  container.className = 'app-main';
  // Reset tag filter when navigating to catalog
  activeTagFilter = null;

  const pageHeader = createPageHeader();
  const statsBar = await createStatsBar();
  const filterBar = createFilterBar();
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

  return bar;
}

function createFilterBar(): HTMLElement {
  // Search
  const searchIcon = svgIcon(icons.search, 16);
  searchIcon.classList.add('filter-bar__search-icon');
  const searchInput = el('input', {
    className: 'filter-bar__search',
    id: 'filter-search',
    attrs: { type: 'text', placeholder: 'Search problems...' },
  });
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
  const topics: Topic[] = ['arrays', 'strings', 'loops', 'conditionals', 'recursion', 'searching', 'sorting', 'math', 'classes', 'collections'];
  for (const topic of topics) {
    topicSelect.appendChild(el('option', { text: capitalize(topic), attrs: { value: topic } }));
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

  // Wire up events
  const handleFilter = () => {
    const grid = document.getElementById('problem-grid');
    if (grid) renderProblemList(grid);
  };

  searchInput.addEventListener('input', debounce(handleFilter, 200));
  topicSelect.addEventListener('change', handleFilter);
  diffSelect.addEventListener('change', handleFilter);

  // Active tag chip (hidden until a tag is clicked)
  const tagClearBtn = el('button', {
    className: 'tag-filter__clear',
    attrs: { 'aria-label': 'Clear tag filter', title: 'Remove tag filter' },
    text: '\u00d7',
    on: {
      click: () => {
        activeTagFilter = null;
        const grid = document.getElementById('problem-grid');
        if (grid) renderProblemList(grid);
      },
    },
  });
  const tagChip = el('div', {
    className: 'tag-filter__chip',
    id: 'active-tag-filter',
    children: [
      el('span', { className: 'tag-filter__label', text: '' }),
      tagClearBtn,
    ],
  });
  tagChip.style.display = 'none';

  return el('div', {
    className: 'filter-bar animate-fade-in',
    children: [searchWrapper, topicSelect, diffSelect, tagChip],
  });
}

async function renderProblemList(grid: HTMLElement): Promise<void> {
  const searchEl = document.getElementById('filter-search') as HTMLInputElement | null;
  const topicEl = document.getElementById('filter-topic') as HTMLSelectElement | null;
  const diffEl = document.getElementById('filter-difficulty') as HTMLSelectElement | null;
  const tagFilterEl = document.getElementById('active-tag-filter');

  // Show/hide active tag filter chip
  if (tagFilterEl) {
    if (activeTagFilter) {
      tagFilterEl.style.display = 'flex';
      const label = tagFilterEl.querySelector('.tag-filter__label');
      if (label) label.textContent = `Tag: ${activeTagFilter}`;
    } else {
      tagFilterEl.style.display = 'none';
    }
  }

  const entries = exerciseLoader.filterCatalog({
    search: searchEl?.value,
    topic: (topicEl?.value as Topic | 'all') ?? 'all',
    difficulty: (diffEl?.value as Difficulty | 'all') ?? 'all',
    tag: activeTagFilter ?? undefined,
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

  // Tags — clickable for filtering
  const tagsEl = el('div', { className: 'problem-card__tags' });
  for (const tag of entry.tags.slice(0, 4)) {
    const isActive = activeTagFilter === tag;
    const tagEl = el('span', {
      className: `tag tag--clickable${isActive ? ' tag--active' : ''}`,
      text: tag,
      attrs: { title: `Filter by tag: ${tag}` },
      on: {
        click: (e: Event) => {
          e.stopPropagation(); // prevent card navigation
          activeTagFilter = activeTagFilter === tag ? null : tag;
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
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function debounce(fn: () => void, ms: number): () => void {
  let timeout: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, ms);
  };
}
