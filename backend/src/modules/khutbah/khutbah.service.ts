import prisma from '../../config/database';
import { cacheGet, cacheSet, cacheDel } from '../../utils/cache';

export const getKhutbahs = async (mosqueId?: string, imamId?: string, page = 1, limit = 20) => {
  const cacheKey = `khutbahs:${mosqueId || ''}:${imamId || ''}:${page}`;
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

  const [items, total] = await Promise.all([
    prisma.khutbah.findMany({
      where: {
        ...(mosqueId && { mosqueId }),
        ...(imamId && { imamId }),
      },
      include: {
        imam: { select: { id: true, name: true } },
        mosque: { select: { id: true, name: true, city: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.khutbah.count({
      where: {
        ...(mosqueId && { mosqueId }),
        ...(imamId && { imamId }),
      },
    }),
  ]);

  const result = { items, total, page, pages: Math.ceil(total / limit) };
  await cacheSet(cacheKey, result, 1800);
  return result;
};

export const getKhutbahById = async (id: string) => {
  const cacheKey = `khutbah:${id}`;
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

  const khutbah = await prisma.khutbah.findUnique({
    where: { id },
    include: {
      imam: true,
      mosque: { select: { id: true, name: true, city: true } },
    },
  });

  if (khutbah) await cacheSet(cacheKey, khutbah, 3600);
  return khutbah;
};

export const createKhutbah = async (data: {
  title: string;
  audioUrl: string;
  duration: number;
  imamId: string;
  mosqueId: string;
}) => {
  const khutbah = await prisma.khutbah.create({ data });
  await cacheDel(`khutbahs:${data.mosqueId}::1`);
  return khutbah;
};
