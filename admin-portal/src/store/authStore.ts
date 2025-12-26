import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user: User, token: string) => {
    authService.setToken(token);
    authService.setStoredUser(user);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  initAuth: () => {
    const token = authService.getToken();
    const user = authService.getStoredUser();
    if (token && user) {
      set({ user, token, isAuthenticated: true });
    }
  },
}));
