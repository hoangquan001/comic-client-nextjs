import { create } from 'zustand';
import { clientFetch } from '@/lib/api/client-fetch';
import type { Chapter, Comic, ComicList, IServiceResponse } from '@/types';

const MAX_LOCAL_HISTORY = 40;
const REMOTE_HISTORY_PAGE_SIZE = 14;
const STORAGE_KEY = 'history';
const REMOTE_HISTORY_PATH = '/user/history';

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface HistorySyncItem {
  comicId: number;
  chapterIds: number[];
}

interface HistoryState {
  listHistory: Comic[];
  remoteHistory: Comic[];
  initialized: boolean;
  authenticatedUserId: number | null;
  syncStatus: SyncStatus;
  remoteInitialized: boolean;
  remotePage: number;
  remoteTotalpage: number;
  initialize: () => void;
  syncForUser: (userId: number | null) => Promise<void>;
  loadRemoteHistory: (userId: number | null, page?: number) => Promise<void>;
  saveHistory: (comic: Comic) => void;
  removeHistory: (comicId: number, syncRemote?: boolean) => void;
  clearHistory: () => void;
}

let remoteSyncQueue = Promise.resolve();

function loadLocalHistory(): Comic[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_LOCAL_HISTORY) : [];
  } catch {
    return [];
  }
}

function saveLocalHistory(list: Comic[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_LOCAL_HISTORY)));
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

function mergeHistories(preferred: Comic[], existing: Comic[], limit?: number): Comic[] {
  const existingById = new Map(existing.map((comic) => [comic.id, comic]));
  const preferredIds = new Set(preferred.map((comic) => comic.id));
  const mergedPreferred = preferred.map((comic) => mergeComic(comic, existingById.get(comic.id)));
  const remaining = existing.filter((comic) => !preferredIds.has(comic.id));
  const merged = [...mergedPreferred, ...remaining];
  return typeof limit === 'number' ? merged.slice(0, limit) : merged;
}

function unwrapHistory(res: IServiceResponse<Comic[]>): Comic[] {
  if (res.status !== 1 && res.status !== 200) {
    throw new Error(res.message || 'Unable to sync reading history');
  }
  return Array.isArray(res.data) ? res.data : [];
}

function unwrapHistoryPage(res: IServiceResponse<ComicList>): ComicList {
  if (res.status !== 1 && res.status !== 200) {
    throw new Error(res.message || 'Unable to load reading history');
  }
  return res.data ?? { comics: [], totalpage: 0, page: 1, step: REMOTE_HISTORY_PAGE_SIZE };
}

async function getRemoteHistoryPage(page: number): Promise<ComicList> {
  const query = new URLSearchParams({
    page: String(Math.max(1, page)),
    size: String(REMOTE_HISTORY_PAGE_SIZE),
  });
  return clientFetch<IServiceResponse<ComicList>>(`${REMOTE_HISTORY_PATH}?${query}`).then(unwrapHistoryPage);
}

async function replaceRemoteHistory(history: Comic[]): Promise<Comic[]> {
  const res = await clientFetch<IServiceResponse<Comic[]>>(REMOTE_HISTORY_PATH, {
    method: 'PUT',
    data: {
      history: history.map<HistorySyncItem>((comic) => ({
        comicId: comic.id,
        chapterIds: comic.chapters?.map((chapter) => chapter.id) ?? [],
      })),
    },
  });

  if ((res.status === 1 || res.status === 200) && !res.data) return history;
  return unwrapHistory(res);
}

async function deleteRemoteHistory(comicId: number): Promise<void> {
  const res = await clientFetch<IServiceResponse<string>>(`${REMOTE_HISTORY_PATH}/${comicId}`, {
    method: 'DELETE',
  });

  if (res.status !== 1 && res.status !== 200) {
    throw new Error(res.message || 'Unable to delete reading history');
  }
}

export const useHistoryStore = create<HistoryState>((set, get) => {
  function persist(history: Comic[]) {
    saveLocalHistory(history);
  }

  async function syncLocalAndRemote(userId: number) {
    const localHistory = loadLocalHistory();
    set({ authenticatedUserId: userId, initialized: true, syncStatus: 'syncing' });

    const syncTask = remoteSyncQueue.catch(() => undefined).then(async () => {
      try {
        const activeLocal = mergeHistories(get().listHistory, localHistory, MAX_LOCAL_HISTORY);
        if (activeLocal.length > 0) await replaceRemoteHistory(activeLocal);
        if (get().authenticatedUserId !== userId) return;

        const firstPage = await getRemoteHistoryPage(1);
        if (get().authenticatedUserId !== userId) return;

        const remoteComics = [...(firstPage.comics ?? [])];
        for (let nextPage = 2; remoteComics.length < MAX_LOCAL_HISTORY && nextPage <= firstPage.totalpage; nextPage++) {
          const data = await getRemoteHistoryPage(nextPage);
          if (get().authenticatedUserId !== userId) return;
          remoteComics.push(...(data.comics ?? []));
        }

        const nextLocal = remoteComics.slice(0, MAX_LOCAL_HISTORY);
        saveLocalHistory(nextLocal);
        set({
          listHistory: nextLocal,
          remoteHistory: firstPage.comics ?? [],
          remotePage: firstPage.page,
          remoteTotalpage: firstPage.totalpage,
          remoteInitialized: true,
          syncStatus: 'synced',
        });
      } catch {
        if (get().authenticatedUserId === userId) {
          const nextLocal = mergeHistories(get().listHistory, localHistory, MAX_LOCAL_HISTORY);
          set({
            listHistory: nextLocal,
            remoteHistory: [],
            remoteInitialized: false,
            remotePage: 1,
            remoteTotalpage: 0,
            syncStatus: 'error',
          });
        }
      }
    });
    remoteSyncQueue = syncTask;
    await syncTask;
  }

  return {
    listHistory: [],
    remoteHistory: [],
    initialized: false,
    authenticatedUserId: null,
    syncStatus: 'idle',
    remoteInitialized: false,
    remotePage: 1,
    remoteTotalpage: 0,

    initialize: () => {
      if (get().initialized) return;
      set({ listHistory: loadLocalHistory(), initialized: true });
    },

    syncForUser: async (userId) => {
      if (userId === null) {
        set({
          authenticatedUserId: null,
          listHistory: loadLocalHistory(),
          remoteHistory: [],
          initialized: true,
          remoteInitialized: false,
          remotePage: 1,
          remoteTotalpage: 0,
          syncStatus: 'idle',
        });
        return;
      }

      await syncLocalAndRemote(userId);
    },

    loadRemoteHistory: async (userId, page = 1) => {
      if (userId === null) {
        set({ remoteHistory: [], remoteInitialized: false, remotePage: 1, remoteTotalpage: 0, syncStatus: 'idle' });
        return;
      }

      set({ authenticatedUserId: userId, syncStatus: 'syncing' });
      const loadTask = remoteSyncQueue.catch(() => undefined).then(async () => {
        try {
          const data = await getRemoteHistoryPage(page);
          if (get().authenticatedUserId !== userId) return;
          set({
            remoteHistory: data.comics ?? [],
            remoteInitialized: true,
            remotePage: data.page,
            remoteTotalpage: data.totalpage,
            syncStatus: 'synced',
          });
        } catch {
          if (get().authenticatedUserId === userId) {
            set({ remoteInitialized: false, syncStatus: 'error' });
          }
        }
      });
      remoteSyncQueue = loadTask;
      await loadTask;
    },

    saveHistory: (comic) => {
      const current = get().initialized ? get().listHistory : loadLocalHistory();
      const nextHistory = mergeHistories([comic], current, MAX_LOCAL_HISTORY);
      persist(nextHistory);
      set({ listHistory: nextHistory, initialized: true });
    },

    removeHistory: (comicId, syncRemote = false) => {
      const current = get().initialized ? get().listHistory : loadLocalHistory();
      const nextHistory = current.filter((comic) => comic.id !== comicId);
      const nextRemoteHistory = get().remoteHistory.filter((comic) => comic.id !== comicId);
      persist(nextHistory);
      set({
        listHistory: nextHistory,
        remoteHistory: nextRemoteHistory,
        initialized: true,
      });

      const userId = get().authenticatedUserId;
      if (!syncRemote || userId === null || !get().remoteInitialized) return;

      set({ syncStatus: 'syncing' });
      remoteSyncQueue = remoteSyncQueue.catch(() => undefined).then(async () => {
        try {
          await deleteRemoteHistory(comicId);
          if (get().authenticatedUserId !== userId) return;
          const currentPage = get().remotePage;
          const data = await getRemoteHistoryPage(currentPage);
          if (get().authenticatedUserId !== userId) return;
          set({
            remoteHistory: data.comics ?? [],
            remotePage: data.page,
            remoteTotalpage: data.totalpage,
            syncStatus: 'synced',
          });
        } catch {
          if (get().authenticatedUserId === userId) set({ syncStatus: 'error' });
        }
      });
    },

    clearHistory: () => {
      persist([]);
      set({ listHistory: [], initialized: true });
    },
  };
});
