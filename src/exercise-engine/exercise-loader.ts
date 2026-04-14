/* ═══════════════════════════════════════════════════════════
   Exercise Loader — Load and manage exercise content
   ═══════════════════════════════════════════════════════════ */

import type { CatalogEntry, Exercise, Topic, Difficulty } from '../shared/types';

// ── Embedded catalog data (inline for V1 simplicity) ──
import { catalogData } from '../content/catalog-data';
import { exerciseRegistry } from '../content/exercise-registry';

class ExerciseLoader {
  private catalog: CatalogEntry[] = [];
  private exerciseCache: Map<string, Exercise> = new Map();

  init(): void {
    this.catalog = catalogData;
  }

  getCatalog(): CatalogEntry[] {
    return this.catalog;
  }

  filterCatalog(options?: {
    topic?: Topic | 'all';
    difficulty?: Difficulty | 'all';
    search?: string;
    tag?: string;
  }): CatalogEntry[] {
    let results = [...this.catalog];

    if (options?.topic && options.topic !== 'all') {
      results = results.filter(e => e.topic === options.topic);
    }

    if (options?.difficulty && options.difficulty !== 'all') {
      results = results.filter(e => e.difficulty === options.difficulty);
    }

    if (options?.tag) {
      const tag = options.tag.toLowerCase();
      results = results.filter(e => e.tags.some(t => t.toLowerCase() === tag));
    }

    if (options?.search) {
      const query = options.search.toLowerCase();
      results = results.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.summary.toLowerCase().includes(query) ||
        e.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return results;
  }

  getExercise(slug: string): Exercise | null {
    if (this.exerciseCache.has(slug)) {
      return this.exerciseCache.get(slug)!;
    }

    const exercise = exerciseRegistry[slug] ?? null;
    if (exercise) {
      this.exerciseCache.set(slug, exercise);
    }

    return exercise;
  }

  getTopics(): Topic[] {
    const topics = new Set(this.catalog.map(e => e.topic));
    return Array.from(topics);
  }

  getDifficulties(): Difficulty[] {
    return ['easy', 'medium', 'hard'];
  }
}

export const exerciseLoader = new ExerciseLoader();
