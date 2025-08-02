import { MetadataRoute } from 'next';
import { loadBlogPosts } from '@/data/sanityPosts';

export default async function sitemap() {
  const baseUrl = 'https://letsmakeai.com';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }
  ];

  // Dynamic blog posts
  try {
    const posts = await loadBlogPosts();
    const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...blogPages];
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
    return staticPages;
  }
}
