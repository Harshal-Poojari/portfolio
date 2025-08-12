// Schema.org structured data utilities

interface Author {
  name: string;
  url: string;
}

export const generatePersonSchema = (person: {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  sameAs: string[];
  worksFor: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person.name,
  jobTitle: person.jobTitle,
  description: person.description,
  url: person.url,
  sameAs: person.sameAs,
  worksFor: {
    '@type': 'Organization',
    name: person.worksFor
  }
});

export const generateBlogPostingSchema = (post: {
  headline: string;
  description: string;
  author: Author;
  datePublished: string;
  dateModified: string;
  url: string;
  image: string;
  publisherName: string;
  publisherLogo: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.headline,
  description: post.description,
  author: {
    '@type': 'Person',
    name: post.author.name,
    url: post.author.url
  },
  datePublished: post.datePublished,
  dateModified: post.dateModified,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': post.url
  },
  publisher: {
    '@type': 'Organization',
    name: post.publisherName,
    logo: {
      '@type': 'ImageObject',
      url: post.publisherLogo
    }
  },
  image: post.image
});
