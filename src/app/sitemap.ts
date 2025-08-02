import { MetadataRoute } from 'next';
import { loadBlogPosts } from '@/data/sanityPosts';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://letsmakeai.com';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Dynamic blog posts from Sanity
  try {
    console.log('🚀 Generating sitemap for letsmakeai.com...');
    const posts = await loadBlogPosts();
    console.log(`✅ Found ${posts.length} blog posts`);
    
    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || new Date()),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const allPages = [...staticPages, ...blogPages];
    console.log(`🎯 Generated sitemap with ${allPages.length} total pages`);
    
    return allPages;
  } catch (error) {
    console.error('❌ Error fetching blog posts for sitemap:', error);
    // Return static pages as fallback
    return staticPages;
  }
}
