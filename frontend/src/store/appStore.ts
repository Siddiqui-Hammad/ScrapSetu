import { create } from 'zustand';

interface AppState {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  isScrapVisionOpen: boolean;
  openScrapVision: () => void;
  closeScrapVision: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
  isScrapVisionOpen: false,
  openScrapVision: () => set({ isScrapVisionOpen: true }),
  closeScrapVision: () => set({ isScrapVisionOpen: false }),
}));
