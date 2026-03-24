import { create } from 'zustand';

interface AppState {
  location: { latitude: number; longitude: number } | null;
  setLocation: (location: { latitude: number; longitude: number } | null) => void;
  
  prayerTimes: any | null;
  setPrayerTimes: (times: any | null) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  location: null,
  setLocation: (location) => set({ location }),
  
  prayerTimes: null,
  setPrayerTimes: (prayerTimes) => set({ prayerTimes }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
