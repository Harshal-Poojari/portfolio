import React from 'react';
import { BlogPost } from '@/types/blog';

interface StructuredDataProps {
  post: BlogPost;
}

function toISODate(date: string | Date | undefined): string | undefined {
  if (!date) return undefined;
  try {
    return new Date(date).toISOString();
  } catch {
    return undefined;
  }
}

/**
 * This helper serializes author data for Schema.org. Handles string or object authors.
 */
function getAuthorSchema(author: any): any {
  if (!author) return { '@type': 'Person', name: 'Unknown Author' };
  if (typeof author === 'string') return { '@type': 'Person', name: author };
  // Optionally support multiple profiles / accounts
  const sameAs: string[] = [];
  if (author.twitter) sameAs.push(`https://twitter.com/${author.twitter}`);
  if (author.github) sameAs.push(`https://github.com/${author.github}`);
  if (author.website) sameAs.push(author.website);
  return {
    '@type': 'Person',
    name: author.name || 'Unknown Author',
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

const StructuredData: React.FC<StructuredDataProps> = ({ post }) => {
  if (!post || !post.title || !post.slug) return null;

  // Compose Schema.org compliant data
  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    image: post.openGraphImage
      ? Array.isArray(post.openGraphImage)
        ? post.openGraphImage
        : [post.openGraphImage]
      : post.coverImage
        ? [post.coverImage]
        : undefined,
    datePublished: toISODate(post.publishedAt) || undefined,
    dateModified: toISODate(post.updatedAt || post.publishedAt) || undefined,
    author: getAuthorSchema(post.author),
    publisher: {
      '@type': 'Organization',
      name: 'LetsMakeAI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://letsmakeai.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://letsmakeai.com/blog/${post.slug}`,
    },
    ...(Array.isArray(post.tags) && post.tags.length > 0
      ? { keywords: post.tags.join(', ') }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2), // pretty for debug/readability
      }}
    />
  );
};

export default StructuredData;
