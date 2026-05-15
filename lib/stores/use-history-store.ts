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
    return stored ? JSON.parse(stored) : [];
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
    const list = get().listHistory.filter((c) => c.id !== comic.id);
    list.unshift(comic);
    saveHistory(list);
    set({ listHistory: list.slice(0, MAX_HISTORY) });
  },

  removeHistory: (comicId) => {
    const list = get().listHistory.filter((c) => c.id !== comicId);
    saveHistory(list);
    set({ listHistory: list });
  },

  clearHistory: () => {
    saveHistory([]);
    set({ listHistory: [] });
  },
}));
