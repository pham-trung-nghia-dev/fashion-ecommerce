import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import apiClient from "../lib/axios";

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
      },

      logout: async () => {
        try {
          if (get().token) {
            await apiClient.post("/logout").catch(() => {});
          }
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("fashion_auth");
          }
        }
      },

      checkAuth: async () => {
        const token = get().token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
        if (!token) {
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const res = await apiClient.get<{ user: User }>("/me");
          if (res.data?.user) {
            set({
              user: res.data.user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch {
          // Token không hợp lệ hoặc hết hạn
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
          }
        }
      },
    }),
    {
      name: "fashion_auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

