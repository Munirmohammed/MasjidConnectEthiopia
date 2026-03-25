import prisma from '../../config/database';
import { cacheGet, cacheSet } from '../../utils/cache';

export const getMosques = async (city?: string, search?: string) => {
  const cacheKey = `mosques:${city || 'all'}:${search || ''}`;
  const cached = await cacheGet<any[]>(cacheKey);
  if (cached) return cached;

  const mosques = await prisma.mosque.findMany({
    where: {
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    },
    include: {
      imams: { select: { id: true, name: true } },
      _count: { select: { events: true, khutbahs: true } },
    },
    orderBy: { name: 'asc' },
  });

  await cacheSet(cacheKey, mosques, 3600);
  return mosques;
};

export const getMosqueById = async (id: string) => {
  const cacheKey = `mosque:${id}`;
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

  const mosque = await prisma.mosque.findUnique({
    where: { id },
    include: {
      imams: true,
      events: { where: { date: { gte: new Date() } }, orderBy: { date: 'asc' }, take: 5 },
      khutbahs: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  });

  if (mosque) await cacheSet(cacheKey, mosque, 1800);
  return mosque;
};

export const createMosque = async (data: {
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  address?: string;
  phone?: string;
}) => {
  return prisma.mosque.create({ data });
};
