import { api } from './api';

export interface Imam {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mosqueId: string;
  mosque: { id: string; name: string; city: string };
  _count: { khutbahs: number };
}

export const imamService = {
  list: (mosqueId?: string) => {
    const query = mosqueId ? `?mosqueId=${mosqueId}` : '';
    return api.get<Imam[]>(`/imams${query}`);
  },
  getById: (id: string) => api.get<Imam>(`/imams/${id}`),
};
