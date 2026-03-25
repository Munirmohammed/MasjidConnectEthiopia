import { api } from './api';

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  campaignId?: string;
  transactionId?: string;
  createdAt: string;
}

export const donationService = {
  stats: () => api.get<{ totalAmount: number; totalDonors: number }>('/donations/stats'),
  mine: () => api.get<Donation[]>('/donations/mine'),
  initiate: (amount: number, campaignId?: string) =>
    api.post<Donation>('/donations/initiate', { amount, campaignId }),
  verify: (donationId: string, transactionId: string) =>
    api.post<Donation>('/donations/verify', { donationId, transactionId }),
};
