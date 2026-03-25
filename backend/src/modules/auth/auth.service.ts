import prisma from '../../config/database';
import { cacheGet, cacheSet } from '../../utils/cache';

export const findOrCreateUser = async (uid: string, email: string) => {
  const cacheKey = `user:${uid}`;
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

  let user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { email, profile: { create: {} } },
      include: { profile: true },
    });
  }

  await cacheSet(cacheKey, user, 3600);
  return user;
};
