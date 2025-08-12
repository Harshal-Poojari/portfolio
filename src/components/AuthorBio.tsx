import React from 'react';
import Script from 'next/script';
import Image from 'next/image';
import Link from 'next/link';

type SocialPlatform = 'twitter' | 'linkedin' | 'github' | 'website';

interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label: string;
}

interface Author {
  name: string;
  bio: string;
  image: string;
  jobTitle: string;
  company?: string;
  website?: string;
  socialLinks?: SocialLink[];
}

interface AuthorBioProps {
  author: Author;
  className?: string;
}

const socialIcons: Record<SocialPlatform, string> = {
  twitter: '🐦',
  linkedin: '💼',
  github: '👨‍💻',
  website: '🌐'
};

const socialColors: Record<SocialPlatform, string> = {
  twitter: 'text-blue-400 hover:text-blue-500',
  linkedin: 'text-blue-600 hover:text-blue-700',
  github: 'text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400',
  website: 'text-purple-600 hover:text-purple-700'
};

export const AuthorBio: React.FC<AuthorBioProps> = ({ 
  author, 
  className = '' 
}) => {
  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "description": author.bio,
    "jobTitle": author.jobTitle,
    "image": author.image,
    "url": author.website || "https://letsmakeai.com/about",
    ...(author.company && {
      "worksFor": {
        "@type": "Organization",
        "name": author.company
      }
    }),
    ...(author.socialLinks && {
      "sameAs": author.socialLinks.map(link => link.url)
    })
  };

  return (
    <div className={`author-bio mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-l-4 border-indigo-500 ${className}`}>
      <Script
        id="author-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema, null, 2) }}
      />
      
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0">
          <Image
            src={author.image}
            alt={author.name}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover border-2 border-white dark:border-gray-700"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {author.name}
          </h3>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">
            {author.jobTitle}
            {author.company && ` at ${author.company}`}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{author.bio}</p>
          
          {(author.socialLinks && author.socialLinks.length > 0) && (
            <div className="flex flex-wrap gap-4 mt-4">
              {author.socialLinks.map((social, index) => (
                <Link 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${socialColors[social.platform]}`}
                >
                  <span className="text-lg">{socialIcons[social.platform]}</span>
                  <span>{social.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Default export with sample data for easier usage
export const DefaultAuthorBio: React.FC<{className?: string}> = ({ className = '' }) => {
  const defaultAuthor: Author = {
    name: 'Harshal Poojari',
    jobTitle: 'Web & Game Developer',
    company: 'LetsMakeAI',
    bio: 'Passionate about creating immersive digital experiences with modern web technologies and game development.',
    image: './images/pofile-artistic.png', // Update this path to your actual author image
    website: 'https://letsmakeai.com',
    socialLinks: [
      {
        platform: 'github',
        url: 'https://github.com/Harshal-Poojari/',
        label: 'GitHub'
      },
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/harshal-poojari/',
        label: 'LinkedIn'
      },
      {
        platform: 'twitter',
        url: 'https://x.com/HarshalPoojari5/',
        label: 'Twitter'
      }
    ]
  };

  return <AuthorBio author={defaultAuthor} className={className} />;
};
