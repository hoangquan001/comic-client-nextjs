import { create } from 'zustand';
import Cookies from 'js-cookie';
import type { IUser } from '@/types';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  setUser: (user: IUser | null) => void;
  saveUser: (user: IUser) => void;
  logout: () => void;
  getToken: () => string | undefined;
}

function loadUser(): IUser | null {
  if (typeof window === 'undefined') return null;
  const raw = Cookies.get('auth');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    console.log(user);
    set({ user, isAuthenticated: !!user });
  },


  saveUser: (user) => {
        console.log(user);

    Cookies.set('auth', JSON.stringify(user), { expires: 365, path: '/' });
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    Cookies.remove('auth', { path: '/' });
    set({ user: null, isAuthenticated: false });
  },

  getToken: () => {
        console.log(get().user);

    return get().user?.token;
  },
}));

export function initializeAuth() {
  const user = loadUser();
  if (user) {
    useAuthStore.getState().setUser(user);
  }
}
