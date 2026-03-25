import { api } from './api';

export interface Mosque {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  address?: string;
  phone?: string;
  imams: { id: string; name: string }[];
  _count: { events: number; khutbahs: number };
}

export const mosqueService = {
  list: (params?: { city?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return api.get<Mosque[]>(`/mosques${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => api.get<Mosque>(`/mosques/${id}`),
};
