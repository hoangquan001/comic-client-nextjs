import { create } from 'zustand';
import { clientFetch } from '@/lib/api/client-fetch';
import type { Chapter, Comic, IServiceResponse } from '@/types';

const MAX_HISTORY = 48;
const STORAGE_KEY = 'history';
const REMOTE_HISTORY_PATH = '/user/history';

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface HistorySyncItem {
  comicId: number;
  chapterIds: number[];
}

interface HistoryState {
  listHistory: Comic[];
  initialized: boolean;
  authenticatedUserId: number | null;
  syncStatus: SyncStatus;
  initialize: () => void;
  syncForUser: (userId: number | null) => Promise<void>;
  saveHistory: (comic: Comic) => void;
  removeHistory: (comicId: number) => void;
  clearHistory: () => void;
}

let remoteWriteQueue = Promise.resolve();

function loadLocalHistory(): Comic[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function saveLocalHistory(list: Comic[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)));
}

function mergeChapters(preferred: Chapter[] = [], existing: Chapter[] = []) {
  const chapters = new Map<number, Chapter>();
  for (const chapter of [...preferred, ...existing]) {
    if (!chapters.has(chapter.id)) chapters.set(chapter.id, chapter);
  }
  return Array.from(chapters.values());
}

function mergeComic(preferred: Comic, existing?: Comic): Comic {
  if (!existing) return preferred;
  return {
    ...existing,
    ...preferred,
    chapters: mergeChapters(preferred.chapters, existing.chapters),
  };
}

function mergeHistories(preferred: Comic[], existing: Comic[]): Comic[] {
  const existingById = new Map(existing.map((comic) => [comic.id, comic]));
  const preferredIds = new Set(preferred.map((comic) => comic.id));
  const mergedPreferred = preferred.map((comic) => mergeComic(comic, existingById.get(comic.id)));
  const remaining = existing.filter((comic) => !preferredIds.has(comic.id));
  return [...mergedPreferred, ...remaining].slice(0, MAX_HISTORY);
}

function unwrapHistory(res: IServiceResponse<Comic[]>): Comic[] {
  if (res.status !== 1 && res.status !== 200) {
    throw new Error(res.message || 'Unable to sync reading history');
  }
  return Array.isArray(res.data) ? res.data.slice(0, MAX_HISTORY) : [];
}

async function getRemoteHistory(): Promise<Comic[]> {
  return clientFetch<IServiceResponse<Comic[]>>(REMOTE_HISTORY_PATH).then(unwrapHistory);
}

async function replaceRemoteHistory(history: Comic[]): Promise<Comic[]> {
  const payload = history.slice(0, MAX_HISTORY);
  const res = await clientFetch<IServiceResponse<Comic[]>>(REMOTE_HISTORY_PATH, {
    method: 'PUT',
    data: {
      history: payload.map<HistorySyncItem>((comic) => ({
        comicId: comic.id,
        chapterIds: comic.chapters?.map((chapter) => chapter.id) ?? [],
      })),
    },
  });

  if ((res.status === 1 || res.status === 200) && !res.data) return payload;
  return unwrapHistory(res);
}

export const useHistoryStore = create<HistoryState>((set, get) => {
  function queueRemoteWrite(history: Comic[], userId: number) {
    remoteWriteQueue = remoteWriteQueue
      .catch(() => undefined)
      .then(async () => {
        if (get().authenticatedUserId !== userId) return;
        try {
          await replaceRemoteHistory(history);
          if (get().authenticatedUserId === userId) set({ syncStatus: 'synced' });
        } catch {
          if (get().authenticatedUserId === userId) set({ syncStatus: 'error' });
        }
      });
  }

  function persist(history: Comic[]) {
    const userId = get().authenticatedUserId;
    saveLocalHistory(history);

    if (userId === null) {
      return;
    }
    set({ syncStatus: 'syncing' });
    queueRemoteWrite(history, userId);
  }

  return {
    listHistory: [],
    initialized: false,
    authenticatedUserId: null,
    syncStatus: 'idle',

    initialize: () => {
      if (get().initialized) return;
      set({ listHistory: loadLocalHistory(), initialized: true });
    },

    syncForUser: async (userId) => {
      if (userId === null) {
        set({
          authenticatedUserId: null,
          listHistory: loadLocalHistory(),
          initialized: true,
          syncStatus: 'idle',
        });
        return;
      }

      const localHistory = loadLocalHistory();
      set({ authenticatedUserId: userId, initialized: true, syncStatus: 'syncing' });

      const syncTask = remoteWriteQueue.catch(() => undefined).then(async () => {
        try {
          const remoteHistory = await getRemoteHistory();
          if (get().authenticatedUserId !== userId) return;

          const activeHistory = mergeHistories(get().listHistory, localHistory);
          const merged = mergeHistories(activeHistory, remoteHistory);
          console.log(merged);
          const syncedHistory = localHistory.length > 0
            ? await replaceRemoteHistory(merged)
            : merged;
          if (get().authenticatedUserId !== userId) return;

          if (localHistory.length > 0) saveLocalHistory(localHistory.slice(0, MAX_HISTORY));
          set({ listHistory: syncedHistory, syncStatus: 'synced' });
        } catch {
          if (get().authenticatedUserId === userId) {
            set({
              listHistory: mergeHistories(get().listHistory, localHistory),
              syncStatus: 'error',
            });
          }
        }
      });
      remoteWriteQueue = syncTask;
      await syncTask;
    },

    saveHistory: (comic) => {
      const current = get().initialized ? get().listHistory : loadLocalHistory();
      const nextHistory = mergeHistories([comic], current);
      persist(nextHistory);
      set({ listHistory: nextHistory, initialized: true });
    },

    removeHistory: (comicId) => {
      const current = get().initialized ? get().listHistory : loadLocalHistory();
      const nextHistory = current.filter((comic) => comic.id !== comicId);
      persist(nextHistory);
      set({ listHistory: nextHistory, initialized: true });
    },

    clearHistory: () => {
      persist([]);
      set({ listHistory: [], initialized: true });
    },
  };
});
