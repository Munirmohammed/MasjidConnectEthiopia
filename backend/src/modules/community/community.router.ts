import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth';
import { listPosts, addPost, likePost, removePost } from './community.controller';

const router = Router();

router.get('/', listPosts);
router.post('/', verifyToken, addPost);
router.post('/:id/like', verifyToken, likePost);
router.delete('/:id', verifyToken, removePost);

export default router;
