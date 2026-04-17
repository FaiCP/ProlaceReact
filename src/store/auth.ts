import { create } from "zustand";
import { api } from "../lib/api";
import type { AuthUser } from "../types";

export type { AuthUser };
export type { UserRole } from "../types";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  fetchMe: async () => {
    try {
      const { data } = await api.get<{ user: AuthUser | null }>("/auth/me");
      set({ user: data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null });
  }
}));
