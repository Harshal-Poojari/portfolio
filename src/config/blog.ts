/**
 * Blog configuration
 * This file contains all the site-wide settings and metadata for the blog
 */

export const blogConfig = {
  // Blog metadata
  title: 'My Blog',
  description: 'Thoughts, stories and ideas about web development and more.',
  author: 'Your Name',
  siteUrl: 'https://yourdomain.com', // Update with your domain
  
  // Social media links
  social: {
    twitter: 'your-twitter-handle',
    github: 'your-github-username',
    linkedin: 'your-linkedin-username',
  },
  
  // Blog settings
  postsPerPage: 6,
  recentPostsCount: 5,
  relatedPostsCount: 3,
  
  // Default values for new posts
  defaults: {
    excerptLength: 160, // characters
    readTimeWordsPerMinute: 200,
    defaultCoverImage: '/images/blog/default-cover.jpg',
  },
  
  // Categories and tags
  categories: [
    'Development',
    'Design',
    'Productivity',
    'Tutorials',
    'Opinion',
  ],
  
  // Navigation
  navItems: [
    { title: 'Home', href: '/' },
    { title: 'Blog', href: '/blog' },
    { title: 'Tags', href: '/tags' },
    { title: 'About', href: '/about' },
  ],
  
  // SEO defaults
  seo: {
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://yourdomain.com',
      siteName: 'My Blog',
    },
    twitter: {
      handle: '@your-twitter-handle',
      site: '@your-twitter-handle',
      cardType: 'summary_large_image',
    },
  },
  
  // Comments (e.g., Disqus, Giscus, etc.)
  comments: {
    provider: 'giscus', // 'disqus' | 'utterances' | 'giscus' | null
    giscusConfig: {
      repo: 'yourusername/your-repo',
      repositoryId: 'R_kgDO...',
      category: 'General',
      categoryId: 'DIC_kwDO...',
      mapping: 'pathname',
      reactionsEnabled: '1',
      emitMetadata: '0',
      theme: 'dark_dimmed',
    },
  },
} as const;

// Type for the blog configuration
export type BlogConfig = typeof blogConfig;
