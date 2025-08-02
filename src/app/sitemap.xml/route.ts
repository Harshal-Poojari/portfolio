import { MetadataRoute } from 'next';
import { loadBlogPosts } from '@/data/sanityPosts';

interface SitemapItem {
  url: string;
  lastModified: Date | string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export async function GET() {
  const baseUrl = 'https://letsmakeai.com';
  
  // Static pages
  const staticPages: SitemapItem[] = [
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
    const blogPages: SitemapItem[] = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const sitemap = [...staticPages, ...blogPages];
    
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemap
          .map(
            (item) => `
            <url>
              <loc>${item.url}</loc>
              <lastmod>${new Date(item.lastModified).toISOString()}</lastmod>
              <changefreq>${item.changeFrequency}</changefreq>
              <priority>${item.priority}</priority>
            </url>
          `
          )
          .join('')}
      </urlset>`,
      {
        headers: {
          'Content-Type': 'application/xml',
        },
      }
    );
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return just the static pages if there's an error
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticPages
          .map(
            (item) => `
            <url>
              <loc>${item.url}</loc>
              <lastmod>${new Date(item.lastModified).toISOString()}</lastmod>
              <changefreq>${item.changeFrequency}</changefreq>
              <priority>${item.priority}</priority>
            </url>
          `
          )
          .join('')}
      </urlset>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
        },
      }
    );
  }
}
