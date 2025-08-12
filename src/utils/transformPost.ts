import { Post } from '@/lib/api';
import type { BlogPost } from '@/types/blog';

export function transformPostToBlogPost(post: Post): BlogPost {
  return {
    id: post._id,
    title: post.title,
    excerpt: post.excerpt || '',
    content: post.content || '',
    date: post.date || post.publishedAt,
    slug: post.slug,
    coverImage: post.coverImage || '',
    tags: post.tags || [],
    category: post.category || 'uncategorized',
    featured: post.featured || false,
    url: `/blog/${post.slug}`,
    readingTime: post.readingTime || 5,
    views: post.views || 0,
    likes: post.likes || 0,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    seoTitle: post.seoTitle || post.title,
    seoDescription: post.seoDescription || post.excerpt || '',
    openGraphImage: post.coverImage || '',
    author: post.author || {
      name: 'Harshal Poojari',
      role: 'Developer',
      image: '/images/avatar.jpg'
    }
  };
}

export function transformPostsToBlogPosts(posts: Post[]): BlogPost[] {
  return posts.map(transformPostToBlogPost);
}
