import prisma from '../../config/database';
import { cacheGet, cacheSet } from '../../utils/cache';

export const initiateDonation = async (userId: string, amount: number, campaignId?: string) => {
  const donation = await prisma.donation.create({
    data: { amount, userId, campaignId, status: 'PENDING' },
  });
  return donation;
};

export const verifyDonation = async (donationId: string, transactionId: string) => {
  // In production: verify with Telebirr/Bank API here
  const donation = await prisma.donation.update({
    where: { id: donationId },
    data: { status: 'SUCCESS', transactionId },
  });
  return donation;
};

export const getDonationStats = async () => {
  const cacheKey = 'donation:stats';
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

  const [total, count] = await Promise.all([
    prisma.donation.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
    }),
    prisma.donation.count({ where: { status: 'SUCCESS' } }),
  ]);

  const stats = { totalAmount: total._sum.amount || 0, totalDonors: count };
  await cacheSet(cacheKey, stats, 300); // 5 min TTL
  return stats;
};

export const getUserDonations = async (userId: string) => {
  return prisma.donation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};
