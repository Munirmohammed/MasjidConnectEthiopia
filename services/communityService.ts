import { api } from './api';

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  likeCount: number;
  user: { id: string; name: string; profile: { avatar?: string } };
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  user: { id: string; name: string };
  createdAt: string;
}

export interface PaginatedPosts {
  items: Post[];
  total: number;
  page: number;
  pages: number;
}

export const communityService = {
  list: (page = 1) => api.get<PaginatedPosts>(`/community?page=${page}`),
  create: (content: string, imageUrl?: string) =>
    api.post<Post>('/community', { content, imageUrl }),
  like: (postId: string) =>
    api.post<{ liked: boolean; likeCount: number }>(`/community/${postId}/like`, {}),
  delete: (postId: string) => api.delete<{ message: string }>(`/community/${postId}`),
  getComments: (postId: string) => api.get<Comment[]>(`/community/${postId}/comments`),
  addComment: (postId: string, content: string) => api.post<Comment>(`/community/${postId}/comments`, { content }),
};
