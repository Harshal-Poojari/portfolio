import React from 'react';
import Head from 'next/head';

interface SocialMetaProps {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  updatedTime?: string;
  section?: string;
  tags?: string[];
  siteName?: string;
  twitterHandle?: string;
  locale?: string;
  noIndex?: boolean;
}

export const SocialMeta: React.FC<SocialMetaProps> = ({
  title,
  description,
  image = 'https://letsmakeai.com/images/default-og-image.jpg',
  url,
  type = 'website',
  author,
  publishedTime,
  updatedTime,
  section,
  tags = [],
  siteName = 'LetsMakeAI',
  twitterHandle = '@harshalpoojari',
  locale = 'en_US',
  noIndex = false
}) => {
  // Ensure the URL is absolute
  const canonicalUrl = url.startsWith('http') ? url : `https://letsmakeai.com${url}`;
  const imageUrl = image.startsWith('http') ? image : `https://letsmakeai.com${image}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Article specific */}
      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {updatedTime && <meta property="article:modified_time" content={updatedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {twitterHandle && (
        <meta name="twitter:creator" content={twitterHandle} />
      )}
      <meta name="twitter:site" content={twitterHandle} />

      {/* Additional SEO Meta */}
      <meta name="googlebot" content="index, follow" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#4f46e5" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
};

export default SocialMeta;
