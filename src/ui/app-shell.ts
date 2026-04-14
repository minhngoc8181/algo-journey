/* ═══════════════════════════════════════════════════════════
   App Shell — Top-level layout, header, theme toggle
   ═══════════════════════════════════════════════════════════ */

import { el, svgIcon, icons } from '../shared/dom-utils';
import { config } from '../app/config';
import { router } from '../app/router';

export function createAppShell(): {
  container: HTMLElement;
  contentArea: HTMLElement;
} {
  const contentArea = el('main', { className: 'app-main', id: 'content-area' });

  const header = createHeader();
  const container = el('div', {
    className: 'app-layout',
    children: [header, contentArea],
  });

  return { container, contentArea };
}

function createHeader(): HTMLElement {
  const logoIcon = el('div', { className: 'app-logo-icon', text: 'A' });
  const logoText = el('span', { text: 'AlgoPath' });
  const logo = el('a', {
    className: 'app-logo',
    attrs: { href: '#/' },
    children: [logoIcon, logoText],
    on: {
      click: (e: Event) => {
        e.preventDefault();
        router.navigate({ page: 'catalog' });
      },
    },
  });

  const themeBtn = createThemeToggle();

  const actions = el('div', {
    className: 'app-header-actions',
    children: [themeBtn],
  });

  return el('header', {
    className: 'app-header',
    children: [logo, actions],
  });
}

function createThemeToggle(): HTMLElement {
  const currentTheme = localStorage.getItem(config.storageKeys.theme) || config.defaultTheme;
  document.documentElement.setAttribute('data-theme', currentTheme);

  const btn = el('button', {
    className: 'btn-icon',
    id: 'theme-toggle',
    attrs: { 'aria-label': 'Toggle theme' },
    on: {
      click: () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(config.storageKeys.theme, next);
        updateThemeIcon(btn, next);
      },
    },
  });

  updateThemeIcon(btn, currentTheme);
  return btn;
}

function updateThemeIcon(btn: HTMLElement, theme: string): void {
  btn.innerHTML = '';
  const iconPath = theme === 'dark' ? icons.sun : icons.moon;
  btn.appendChild(svgIcon(iconPath, 18));
}
