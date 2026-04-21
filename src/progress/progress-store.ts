/* ═══════════════════════════════════════════════════════════
   Progress Store — IndexedDB persistence for problem progress
   ═══════════════════════════════════════════════════════════ */

import { config } from '../app/config';
import type { ProblemProgress, Draft, ProgressStatus, Submission } from '../shared/types';

class ProgressStore {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(config.db.name, config.db.version);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        const oldVersion = (event as IDBVersionChangeEvent).oldVersion;

        // v1 stores
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains(config.db.stores.progress)) {
            db.createObjectStore(config.db.stores.progress, { keyPath: 'problemId' });
          }
          if (!db.objectStoreNames.contains(config.db.stores.drafts)) {
            db.createObjectStore(config.db.stores.drafts, { keyPath: 'problemId' });
          }
        }

        // v2: submissions store with index on problemId
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains(config.db.stores.submissions)) {
            const subStore = db.createObjectStore(config.db.stores.submissions, { keyPath: 'id' });
            subStore.createIndex('by_problem', 'problemId', { unique: false });
          }
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  // ── Progress ──

  async getProgress(problemId: string): Promise<ProblemProgress | null> {
    return this.get<ProblemProgress>(config.db.stores.progress, problemId);
  }

  async getAllProgress(): Promise<ProblemProgress[]> {
    return this.getAll<ProblemProgress>(config.db.stores.progress);
  }

  async saveProgress(progress: ProblemProgress): Promise<void> {
    return this.put(config.db.stores.progress, progress);
  }

  async getProgressStatus(problemId: string): Promise<ProgressStatus> {
    const progress = await this.getProgress(problemId);
    return progress?.status ?? 'not_started';
  }

  // ── Drafts ──

  async getDraft(problemId: string): Promise<Draft | null> {
    return this.get<Draft>(config.db.stores.drafts, problemId);
  }

  async saveDraft(draft: Draft): Promise<void> {
    return this.put(config.db.stores.drafts, draft);
  }

  // ── Submissions ──

  async saveSubmission(submission: Submission): Promise<void> {
    return this.put(config.db.stores.submissions, submission);
  }

  async getSubmissions(problemId: string): Promise<Submission[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve([]); return; }
      const tx = this.db.transaction(config.db.stores.submissions, 'readonly');
      const store = tx.objectStore(config.db.stores.submissions);
      const index = store.index('by_problem');
      const request = index.getAll(problemId);
      request.onsuccess = () => resolve(request.result ?? []);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllSubmissions(): Promise<Submission[]> {
    return this.getAll<Submission>(config.db.stores.submissions);
  }

  /** Keep only the most recent `maxCount` submissions per problem */
  async pruneSubmissions(problemId: string, maxCount: number): Promise<void> {
    const all = await this.getSubmissions(problemId);
    if (all.length <= maxCount) return;

    // Sort by timestamp descending, delete the oldest beyond maxCount
    all.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    const toDelete = all.slice(maxCount);

    return new Promise((resolve, reject) => {
      if (!this.db || toDelete.length === 0) { resolve(); return; }
      const tx = this.db.transaction(config.db.stores.submissions, 'readwrite');
      const store = tx.objectStore(config.db.stores.submissions);
      for (const sub of toDelete) {
        store.delete(sub.id);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // ── Recent Problems ──

  getRecentProblems(): string[] {
    const raw = localStorage.getItem(config.storageKeys.recentProblems);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  }

  addRecentProblem(slug: string): void {
    const recent = this.getRecentProblems().filter(s => s !== slug);
    recent.unshift(slug);
    const trimmed = recent.slice(0, 20); // Keep last 20
    localStorage.setItem(config.storageKeys.recentProblems, JSON.stringify(trimmed));
  }

  // ── Generic DB helpers ──

  private get<T>(storeName: string, key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve(null); return; }
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  }

  private getAll<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve([]); return; }
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private put(storeName: string, value: unknown): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve(); return; }
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(value);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const progressStore = new ProgressStore();
