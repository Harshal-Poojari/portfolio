import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string | string[];
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
  twitterHandle?: string;
  siteTwitter?: string;
  keywords?: string[];
  locale?: string;
  alternateLanguages?: Record<string, string>;
}

interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultImage: string;
  defaultAuthor: string;
  defaultTwitterHandle: string;
  siteTwitterHandle: string;
  defaultLocale: string;
}

// Centralized configuration - easily customizable
const seoConfig: SEOConfig = {
  siteName: 'LetsMakeAI',
  siteUrl: 'https://letsmakeai.com',
  defaultImage: '/default-og-image.jpg',
  defaultAuthor: 'Harshal Poojari', // Update with your name
  defaultTwitterHandle: '@harshalpoojari', // Update with your handle
  siteTwitterHandle: '@letsmakeai', // Update with your site handle
  defaultLocale: 'en_US',
};

/**
 * Generates comprehensive Next.js Metadata for SEO optimization
 * Supports OpenGraph, Twitter Cards, robots directives, structured data hints, and more
 * 
 * @param props - SEO properties for customization
 * @returns Metadata object for Next.js
 */
export const generateMetadata = ({
  title = 'LetsMakeAI - AI & Tech Insights by Prompto',
  description = 'Explore cutting-edge AI, machine learning, and technology insights. In-depth tutorials, project breakdowns, and industry analysis by an AI enthusiast.',
  image = seoConfig.defaultImage,
  path = '',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = seoConfig.defaultAuthor,
  section = 'Technology',
  tags = [],
  noIndex = false,
  noFollow = false,
  twitterHandle = seoConfig.defaultTwitterHandle,
  siteTwitter = seoConfig.siteTwitterHandle,
  keywords = [],
  locale = seoConfig.defaultLocale,
  alternateLanguages,
}: SEOProps = {}): Metadata => {
  
  // Ensure absolute URLs for images and canonical
  const absoluteImageUrl = image.startsWith('http') ? image : `${seoConfig.siteUrl}${image}`;
  const canonicalUrl = `${seoConfig.siteUrl}${path}`;
  
  // Ensure title doesn't duplicate branding
  const finalTitle = title.includes('LetsMakeAI') || title.includes('letsmakeai.com') 
    ? title 
    : `${title} | ${seoConfig.siteName}`;

  // Process authors (handle both string and array)
  const authorArray = Array.isArray(author) ? author : [author];

  // Build comprehensive keywords from tags and provided keywords
  const allKeywords = [...new Set([...tags, ...keywords])];

  return {
    title: finalTitle,
    description,
    keywords: allKeywords.length > 0 ? allKeywords.join(', ') : undefined,
    
    metadataBase: new URL(seoConfig.siteUrl),
    
    alternates: {
      canonical: canonicalUrl,
      ...(alternateLanguages && {
        languages: alternateLanguages
      })
    },
    
    openGraph: {
      type,
      title: finalTitle,
      description,
      url: canonicalUrl,
      siteName: seoConfig.siteName,
      locale,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - ${seoConfig.siteName}`,
        },
        // Fallback image
        ...(image !== seoConfig.defaultImage ? [{
          url: `${seoConfig.siteUrl}${seoConfig.defaultImage}`,
          width: 1200,
          height: 630,
          alt: `${seoConfig.siteName} - Default`,
        }] : [])
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(type === 'article' && {
        authors: authorArray,
        section,
        ...(tags.length > 0 && { tags })
      }),
    },
    
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description,
      images: [absoluteImageUrl],
      creator: twitterHandle,
      site: siteTwitter,
    },
    
    robots: {
      index: !noIndex,
      follow: !noFollow,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Additional metadata for better SEO
    category: section,
    
    ...(type === 'article' && {
      authors: authorArray.map(name => ({ name })),
      ...(publishedTime && {
        publishedTime: new Date(publishedTime).toISOString()
      }),
      ...(modifiedTime && {
        modifiedTime: new Date(modifiedTime).toISOString()
      })
    }),

    // Verification and ownership
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_SITE_VERIFICATION,
      other: {
        me: [seoConfig.siteUrl],
      },
    },

    // App-specific metadata for PWA/mobile
    applicationName: seoConfig.siteName,
    
    // Format detection
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
};

/**
 * Utility: Generate JSON-LD structured data for articles
 */
export const generateArticleStructuredData = ({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  image,
  url,
  tags = []
}: {
  title: string;
  description: string;
  author: string;
  publishedTime?: string;
  modifiedTime?: string;
  image?: string;
  url: string;
  tags?: string[];
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: image ? `${seoConfig.siteUrl}${image}` : undefined,
    author: {
      '@type': 'Person',
      name: author,
      url: seoConfig.siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}/logo.png`
      }
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    keywords: tags.join(', ')
  };
};

/**
 * Utility: Generate page-specific SEO props
 */
export const createSEO = {
  home: () => generateMetadata({
    title: "LetsMakeAI - AI & Tech Insights by Prompto",
    description: "Explore cutting-edge AI, machine learning, game development, and web technologies. Personal blog of Harshal Poojari featuring tutorials, projects, and industry insights.",
    path: "/",
    keywords: ["AI", "Machine Learning", "Web Development", "Game Development", "Technology Blog", "Prompto"]
  }),
  
  blog: () => generateMetadata({
    title: "Prompto Blog - AI & Development Insights",
    description: "Technical articles on AI implementation, web development, game creation, and emerging technologies. Deep dives into real-world projects and tutorials.",
    path: "/blog",
    keywords: ["AI Blog", "Tech Tutorials", "Development Insights", "Programming"]
  }),
  
  about: () => generateMetadata({
    title: "About Harshal Poojari - AI Developer & Creator",
    description: "Learn about Harshal Poojari's journey in AI, web development, and game creation. Skills, experience, and passion for cutting-edge technology.",
    path: "/about",
    keywords: ["Harshal Poojari", "AI Developer", "Web Developer", "About"]
  })
};

export default generateMetadata;
