import prisma from '../../config/database';
import redis from '../../config/redis';
import { cacheGet, cacheSet, cacheDel } from '../../utils/cache';

const LIKES_KEY = (postId: string) => `post:likes:${postId}`;

export const getPosts = async (page = 1, limit = 20) => {
  const cacheKey = `posts:${page}`;
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      include: {
        user: { select: { id: true, name: true, profile: { select: { avatar: true } } } },
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count(),
  ]);

  // Merge Redis like counts (real-time) over DB counts
  const itemsWithLikes = await Promise.all(
    items.map(async (post) => {
      const redisLikes = await redis.get(LIKES_KEY(post.id));
      return {
        ...post,
        likeCount: redisLikes !== null ? parseInt(redisLikes) : post._count.likes,
      };
    })
  );

  const result = { items: itemsWithLikes, total, page, pages: Math.ceil(total / limit) };
  await cacheSet(cacheKey, result, 60); // short TTL for feed
  return result;
};

export const createPost = async (userId: string, content: string, imageUrl?: string) => {
  const post = await prisma.post.create({
    data: { content, imageUrl, userId },
    include: { user: { select: { id: true, name: true } } },
  });
  await cacheDel('posts:1');
  return post;
};

export const toggleLike = async (postId: string, userId: string) => {
  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    const count = await redis.decr(LIKES_KEY(postId));
    return { liked: false, likeCount: Math.max(0, count) };
  } else {
    await prisma.like.create({ data: { postId, userId } });
    const count = await redis.incr(LIKES_KEY(postId));
    return { liked: true, likeCount: count };
  }
};

export const deletePost = async (postId: string, userId: string) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.userId !== userId) throw new Error('Unauthorized');
  await prisma.post.delete({ where: { id: postId } });
  await redis.del(LIKES_KEY(postId));
  await cacheDel('posts:1');
};
