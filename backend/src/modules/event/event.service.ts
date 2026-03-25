import prisma from '../../config/database';
import { cacheGet, cacheSet, cacheDel } from '../../utils/cache';

export const getEvents = async (mosqueId?: string, upcoming = true, page = 1, limit = 20) => {
  const cacheKey = `events:${mosqueId || 'all'}:${upcoming}:${page}`;
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

  const where = {
    ...(mosqueId && { mosqueId }),
    ...(upcoming && { date: { gte: new Date() } }),
  };

  const [items, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: { mosque: { select: { id: true, name: true, city: true } } },
      orderBy: { date: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.event.count({ where }),
  ]);

  const result = { items, total, page, pages: Math.ceil(total / limit) };
  await cacheSet(cacheKey, result, 900); // 15 min TTL for events
  return result;
};

export const getEventById = async (id: string) => {
  const cacheKey = `event:${id}`;
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

  const event = await prisma.event.findUnique({
    where: { id },
    include: { mosque: true },
  });

  if (event) await cacheSet(cacheKey, event, 900);
  return event;
};

export const createEvent = async (data: {
  title: string;
  description?: string;
  date: Date;
  time: string;
  location?: string;
  mosqueId: string;
  imageUrl?: string;
}) => {
  const event = await prisma.event.create({ data });
  await cacheDel(`events:${data.mosqueId}:true:1`);
  await cacheDel('events:all:true:1');
  return event;
};
