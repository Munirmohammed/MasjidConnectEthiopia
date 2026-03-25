import prisma from '../../config/database';
import { cacheGet, cacheSet, cacheDel } from '../../utils/cache';

export const getProfile = async (email: string) => {
  const cacheKey = `profile:${email}`;
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true, mosque: { select: { id: true, name: true, city: true } } },
  });

  if (user) await cacheSet(cacheKey, user, 1800);
  return user;
};

export const updateProfile = async (email: string, data: { name?: string; bio?: string; avatar?: string; city?: string }) => {
  const { name, ...profileData } = data;

  const user = await prisma.user.update({
    where: { email },
    data: {
      ...(name && { name }),
      profile: { update: profileData },
    },
    include: { profile: true },
  });

  await cacheDel(`profile:${email}`);
  return user;
};
