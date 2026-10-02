import { create } from "zustand";
import type { AuthTokens, LoginCredentials, Profile } from "../types/auth";
import { createJSONStorage, persist } from "zustand/middleware";

const BASE_URL = "https://api.escuelajs.co/api/v1"; 

interface AuthStateStore {
  accessToken: string | null;
  refreshToken: string | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  
  login: (credentials: LoginCredentials) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStateStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      profile: null,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            const data = await response.json().catch(() => null);

            throw new Error(
              data?.message || "Email yoki parol noto'g'ri"
            );
          }

          const tokens: AuthTokens = await response.json();

          set({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            isLoading: false,
            error: null,
          });

          const profileResponse = await fetch(
            `${BASE_URL}/auth/profile`,
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            }
          );

          if (profileResponse.ok) {
            const profile: Profile = await profileResponse.json();

            set({
              profile,
            });
          }
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Noma'lum xatolik";

          set({
            error: message,
            isLoading: false,
          });
        }
      },

      fetchProfile: async () => {
        const { accessToken } = get();

        if (!accessToken) return;

        try {
          const response = await fetch(`${BASE_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Profilni olishda xatolik");
          }

          const profile: Profile = await response.json();

          set({
            profile,
            error: null,
          });
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Noma'lum xatolik";

          set({
            error: message,
          });
        }
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          profile: null,
          error: null,
          isLoading: false,
        });
      },
    }),
    {
      name: "auth-storage",

      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);