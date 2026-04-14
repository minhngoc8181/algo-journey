/* ═══════════════════════════════════════════════════════════
   Main Entry — Application bootstrap
   ═══════════════════════════════════════════════════════════ */

import { createAppShell } from './ui/app-shell';
import { renderCatalogPage } from './ui/pages/catalog-page';
import { renderProblemPage, disposeProblemPage, setEditorValue } from './ui/pages/problem-page';
import { exerciseLoader } from './exercise-engine/exercise-loader';
import { progressStore } from './progress/progress-store';
import { router } from './app/router';
import type { Route } from './app/router';

async function main(): Promise<void> {
  // Initialize data layers
  exerciseLoader.init();
  await progressStore.init();

  // Build app shell
  const { container, contentArea } = createAppShell();
  const app = document.getElementById('app');
  if (!app) return;
  app.appendChild(container);

  // Route handler
  const handleRoute = async (route: Route) => {
    // Clean up previous page
    disposeProblemPage();

    if (route.page === 'problem' && route.slug) {
      await renderProblemPage(contentArea, route.slug);
    } else {
      await renderCatalogPage(contentArea);
    }
  };

  // Initialize router
  router.onChange(handleRoute);
  router.init();

  // ── Dev-only automation API ────────────────────────────────
  // Exposes window.__algoDev for use by /auto_run_test.js
  if (import.meta.env.DEV) {
    const { getSolution, getAllCatalogEntries } = await import('./content/_loader');
    (window as any).__algoDev = {
      /** All registered problems with topic/difficulty info */
      getCatalog: () => getAllCatalogEntries(),
      /** Load reference solution Java source for a problem id */
      getSolution: (id: string) => getSolution(id),
      /** Set the current Monaco editor code */
      setCode: (code: string) => setEditorValue(code),
      /** Navigate to a problem or catalog */
      navigate: (slug?: string) => {
        window.location.hash = slug ? `#/problem/${slug}` : '#/';
      },
    };
    console.log('%c⚡ AlgoDev API ready → window.__algoDev', 'color:#6ee7b7;font-weight:bold;font-size:12px');
    console.log('%c  Run tests: import("/auto_run_test.js")', 'color:#94a3b8;font-size:11px');
  }
}

// Boot
main().catch(console.error);
