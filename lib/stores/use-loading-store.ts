import { create } from 'zustand';

interface LoadingState {
  tasks: string[];
  addTask: (url: string) => void;
  removeTask: (url: string) => void;
  clearAll: () => void;
  isLoading: () => boolean;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  tasks: [],

  addTask: (url) => {
    set((state) => ({ tasks: [...state.tasks, url] }));
  },

  removeTask: (url) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t !== url) }));
  },

  clearAll: () => set({ tasks: [] }),

  isLoading: () => get().tasks.length > 0,
}));
