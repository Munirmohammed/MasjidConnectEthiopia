import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middlewares/auth';
import { getPosts, createPost, toggleLike, deletePost } from './community.service';
import prisma from '../../config/database';

const postSchema = z.object({
  content: z.string().min(1).max(1000),
  imageUrl: z.string().url().optional(),
});

export const listPosts = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query as Record<string, string>;
    const result = await getPosts(Number(page) || 1, Number(limit) || 20);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const addPost = async (req: AuthRequest, res: Response) => {
  try {
    const { content, imageUrl } = postSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: req.user!.email! } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const post = await createPost(user.id, content, imageUrl);
    res.status(201).json(post);
  } catch (error) {
    throw error;
  }
};

export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.user!.email! } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const result = await toggleLike(req.params.id, user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

export const removePost = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.user!.email! } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    await deletePost(req.params.id, user.id);
    res.json({ message: 'Post deleted' });
  } catch (error: any) {
    if (error.message === 'Unauthorized') return res.status(403).json({ error: 'Forbidden' });
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
