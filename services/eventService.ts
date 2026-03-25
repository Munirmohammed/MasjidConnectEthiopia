import { api } from './api';

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location?: string;
  imageUrl?: string;
  mosque: { id: string; name: string; city: string };
}

export interface PaginatedEvents {
  items: Event[];
  total: number;
  page: number;
  pages: number;
}

export const eventService = {
  list: (params?: { mosqueId?: string; upcoming?: boolean; page?: number }) => {
    const query = new URLSearchParams(
      Object.entries(params || {}).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {})
    ).toString();
    return api.get<PaginatedEvents>(`/events${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => api.get<Event>(`/events/${id}`),
};
