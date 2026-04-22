/* ═══════════════════════════════════════════════════════════
   Router — Simple hash-based routing
   ═══════════════════════════════════════════════════════════ */

export interface Route {
  page: 'catalog' | 'problem';
  slug?: string;
  /** Catalog filter params (persisted in URL for sharing) */
  topic?: string;
  difficulty?: string;
  tags?: string[];   // multi-tag filter
  search?: string;
}

export type RouteChangeHandler = (route: Route) => void;

class Router {
  private handlers: RouteChangeHandler[] = [];
  /** Last known catalog filter state — restored when navigating back from a problem */
  private savedCatalogRoute: Route = { page: 'catalog' };

  init(): void {
    window.addEventListener('hashchange', () => this.handleChange());
    // Handle initial route
    this.handleChange();
  }

  onChange(handler: RouteChangeHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler);
    };
  }

  navigate(route: Route): void {
    if (route.page === 'problem' && route.slug) {
      // Save current catalog state before entering a problem
      const current = this.getCurrentRoute();
      if (current.page === 'catalog') {
        this.savedCatalogRoute = current;
      }
      window.location.hash = `#/problem/${route.slug}`;
    } else {
      // If no explicit filter params provided, restore the last saved catalog state
      const hasExplicitParams = route.topic || route.difficulty || route.tags?.length || route.search;
      const effectiveRoute = hasExplicitParams ? route : this.savedCatalogRoute;

      const params = new URLSearchParams();
      if (effectiveRoute.topic && effectiveRoute.topic !== 'all') params.set('topic', effectiveRoute.topic);
      if (effectiveRoute.difficulty && effectiveRoute.difficulty !== 'all') params.set('difficulty', effectiveRoute.difficulty);
      if (effectiveRoute.tags && effectiveRoute.tags.length > 0) params.set('tags', effectiveRoute.tags.join(','));
      if (effectiveRoute.search) params.set('search', effectiveRoute.search);
      const qs = params.toString();
      window.location.hash = qs ? `#/?${qs}` : '#/';
    }
  }

  /** Navigate to catalog and explicitly clear all filters */
  navigateToHome(): void {
    this.savedCatalogRoute = { page: 'catalog' };
    window.location.hash = '#/';
  }

  /** Update only the query params without triggering a full page re-render */
  updateCatalogParams(params: { topic?: string; difficulty?: string; tags?: string[]; search?: string }): void {
    const current = this.getCurrentRoute();
    if (current.page !== 'catalog') return;
    const merged: Route = {
      page: 'catalog',
      topic: params.topic ?? current.topic,
      difficulty: params.difficulty ?? current.difficulty,
      tags: params.tags ?? current.tags,
      search: params.search ?? current.search,
    };
    // Replace without triggering hashchange — just update the URL bar
    const urlParams = new URLSearchParams();
    if (merged.topic && merged.topic !== 'all') urlParams.set('topic', merged.topic);
    if (merged.difficulty && merged.difficulty !== 'all') urlParams.set('difficulty', merged.difficulty);
    if (merged.tags && merged.tags.length > 0) urlParams.set('tags', merged.tags.join(','));
    if (merged.search) urlParams.set('search', merged.search);
    const qs = urlParams.toString();
    const newHash = qs ? `#/?${qs}` : '#/';
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }
  }

  getCurrentRoute(): Route {
    return this.parseHash(window.location.hash);
  }

  private parseHash(hash: string): Route {
    const path = hash.replace('#', '').replace(/^\//, '');

    if (path.startsWith('problem/')) {
      const slug = path.replace('problem/', '');
      return { page: 'problem', slug };
    }

    // Parse query params for catalog filters
    const qsIndex = path.indexOf('?');
    if (qsIndex >= 0) {
      const params = new URLSearchParams(path.slice(qsIndex + 1));
      return {
        page: 'catalog',
        topic: params.get('topic') || undefined,
        difficulty: params.get('difficulty') || undefined,
        tags: params.get('tags')?.split(',').filter(Boolean) || undefined,
        search: params.get('search') || undefined,
      };
    }

    return { page: 'catalog' };
  }

  private handleChange(): void {
    const route = this.getCurrentRoute();
    for (const handler of this.handlers) {
      handler(route);
    }
  }
}

export const router = new Router();
