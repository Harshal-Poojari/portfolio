import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/']
      },
      {
        userAgent: 'GPTBot',
        disallow: '/'
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/'
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/'
      },
      {
        userAgent: 'CCBot',
        disallow: '/'
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/'
      },
      {
        userAgent: 'Omgilibot',
        disallow: '/'
      },
      {
        userAgent: 'Omgilibot',
        disallow: '/'
      },
      {
        userAgent: 'FacebookBot',
        allow: '/'
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 2
      }
    ],
    sitemap: 'https://letsmakeai.com/sitemap.xml',
    host: 'https://letsmakeai.com'
  };
}
