import prisma from '../../config/database';
import { cacheGet, cacheSet } from '../../utils/cache';

export const getImams = async (mosqueId?: string) => {
  const cacheKey = `imams:${mosqueId || 'all'}`;
  const cached = await cacheGet<any[]>(cacheKey);
  if (cached) return cached;

  const imams = await prisma.imam.findMany({
    where: { ...(mosqueId && { mosqueId }) },
    include: {
      mosque: { select: { id: true, name: true, city: true } },
      _count: { select: { khutbahs: true } },
    },
    orderBy: { name: 'asc' },
  });

  await cacheSet(cacheKey, imams, 3600);
  return imams;
};

export const getImamById = async (id: string) => {
  const cacheKey = `imam:${id}`;
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

  const imam = await prisma.imam.findUnique({
    where: { id },
    include: {
      mosque: true,
      khutbahs: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });

  if (imam) await cacheSet(cacheKey, imam, 1800);
  return imam;
};
