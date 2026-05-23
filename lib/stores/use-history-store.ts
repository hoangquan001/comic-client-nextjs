import { create } from 'zustand';
import type { Comic } from '@/types';

const MAX_HISTORY = 48;
const STORAGE_KEY = 'history';

interface HistoryState {
  listHistory: Comic[];
  initialized: boolean;
  initialize: () => void;
  saveHistory: (comic: Comic) => void;
  removeHistory: (comicId: number) => void;
  clearHistory: () => void;
}

function loadHistory(): Comic[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function saveHistory(list: Comic[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)));
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  listHistory: [],
  initialized: false,

  initialize: () => {
    if (get().initialized) return;
    set({ listHistory: loadHistory(), initialized: true });
  },

  saveHistory: (comic) => {
    set((state) => {
      const current = state.initialized ? state.listHistory : loadHistory();
      const list = current.filter((c) => c.id !== comic.id);
      list.unshift(comic);
      const nextHistory = list.slice(0, MAX_HISTORY);
      saveHistory(nextHistory);
      return { listHistory: nextHistory, initialized: true };
    });
  },

  removeHistory: (comicId) => {
    set((state) => {
      const current = state.initialized ? state.listHistory : loadHistory();
      const list = current.filter((c) => c.id !== comicId);
      saveHistory(list);
      return { listHistory: list, initialized: true };
    });
  },

  clearHistory: () => {
    saveHistory([]);
    set({ listHistory: [], initialized: true });
  },
}));
