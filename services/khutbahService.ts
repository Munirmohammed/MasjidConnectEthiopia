import { api } from './api';

export interface Khutbah {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
  imam: { id: string; name: string };
  mosque: { id: string; name: string; city: string };
  createdAt: string;
}

export interface PaginatedKhutbahs {
  items: Khutbah[];
  total: number;
  page: number;
  pages: number;
}

export const khutbahService = {
  list: (params?: { mosqueId?: string; imamId?: string; page?: number }) => {
    const query = new URLSearchParams(
      Object.entries(params || {}).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {})
    ).toString();
    return api.get<PaginatedKhutbahs>(`/khutbahs${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => api.get<Khutbah>(`/khutbahs/${id}`),
};
