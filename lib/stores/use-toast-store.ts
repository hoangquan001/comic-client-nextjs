import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  show: (toast: Omit<Toast, 'id'>) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

let toastCounter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  show: (toast) => {
    const id = `toast-${++toastCounter}`;
    const duration = toast.duration ?? 5000;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  success: (message) => {
    useToastStore.getState().show({ message, type: 'success' });
  },
  error: (message) => {
    useToastStore.getState().show({ message, type: 'error', duration: 7000 });
  },
  info: (message) => {
    useToastStore.getState().show({ message, type: 'info' });
  },
  warning: (message) => {
    useToastStore.getState().show({ message, type: 'warning' });
  },

  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clear: () => set({ toasts: [] }),
}));
