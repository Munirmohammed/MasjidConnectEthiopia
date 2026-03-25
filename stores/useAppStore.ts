import { create } from 'zustand';
import type { Mosque } from '../services/mosqueService';
import type { Post } from '../services/communityService';
import type { Event } from '../services/eventService';
import type { PrayerTimings } from '../services/prayerService';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN' | 'IMAM';
  profile?: { avatar?: string; bio?: string; city?: string };
}

interface AppState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;

  // Location
  location: { latitude: number; longitude: number } | null;
  setLocation: (location: { latitude: number; longitude: number } | null) => void;

  // Prayer times
  prayerTimes: PrayerTimings | null;
  setPrayerTimes: (times: PrayerTimings | null) => void;

  // Mosques
  mosques: Mosque[];
  setMosques: (mosques: Mosque[]) => void;

  // Events
  events: Event[];
  setEvents: (events: Event[]) => void;

  // Community
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  updatePostLike: (postId: string, liked: boolean, likeCount: number) => void;

  // UI
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  location: null,
  setLocation: (location) => set({ location }),

  prayerTimes: null,
  setPrayerTimes: (prayerTimes) => set({ prayerTimes }),

  mosques: [],
  setMosques: (mosques) => set({ mosques }),

  events: [],
  setEvents: (events) => set({ events }),

  posts: [],
  setPosts: (posts) => set({ posts }),
  updatePostLike: (postId, liked, likeCount) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, likeCount } : p
      ),
    })),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
