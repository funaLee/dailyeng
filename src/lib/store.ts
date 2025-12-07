import { create } from "zustand";
import type { ProfileStats } from "@/types";
import { persistUser, clearUser } from "@/lib/auth";
import type { SRSCard } from "@/lib/srs";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AppStore {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;

  // Profile
  stats: ProfileStats | null;
  setStats: (stats: ProfileStats) => void;
  addXP: (amount: number) => void;
  updateStreak: (streak: number) => void;

  // UI
  kittyOpen: boolean;
  setKittyOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  flashcards: SRSCard[];
  addFlashcard: (card: SRSCard) => void;
  updateFlashcard: (card: SRSCard) => void;
  removeFlashcard: (id: string) => void;
  setFlashcards: (cards: SRSCard[]) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: (user) => {
    persistUser(user);
    set({ user, isAuthenticated: true, error: null });
  },

  logout: () => {
    clearUser();
    set({ user: null, isAuthenticated: false, stats: null });
  },

  setError: (error) => set({ error }),
  setLoading: (loading) => set({ isLoading: loading }),

  stats: null,
  setStats: (stats) => set({ stats }),
  addXP: (amount) =>
    set((state) => ({
      stats: state.stats
        ? { ...state.stats, xp: state.stats.xp + amount }
        : null,
    })),

  updateStreak: (streak) =>
    set((state) => ({
      stats: state.stats ? { ...state.stats, streak } : null,
    })),

  kittyOpen: false,
  setKittyOpen: (open) => set({ kittyOpen: open }),
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),

  flashcards: [],
  addFlashcard: (card) =>
    set((state) => ({
      flashcards: [...state.flashcards, card],
    })),
  updateFlashcard: (card) =>
    set((state) => ({
      flashcards: state.flashcards.map((c) => (c.id === card.id ? card : c)),
    })),
  removeFlashcard: (id) =>
    set((state) => ({
      flashcards: state.flashcards.filter((c) => c.id !== id),
    })),
  setFlashcards: (cards) => set({ flashcards: cards }),
}));
