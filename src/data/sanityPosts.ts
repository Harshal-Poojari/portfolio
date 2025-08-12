// src/data/sanityPosts.ts
import { client, urlFor } from '../lib/sanity';
import type { BlogPost, BlogCategory, SanityBlogPost } from '../types/blog';

export const blogCategories: BlogCategory[] = [
  { id: 'all', name: 'All Posts', color: 'indigo' },
  { id: 'web-dev', name: 'Web Development', color: 'blue' },
  { id: 'game-dev', name: 'Game Development', color: 'purple' },
  { id: 'tech', name: 'Technology', color: 'green' },
  { id: 'tutorial', name: 'Tutorials', color: 'orange' },
];

// Simplified configuration check
const isSanityConfigured = (): boolean => {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
  
    // Basic check if project ID exists and is not empty
    const isConfigured = !!projectId && projectId.trim() !== '';
  
    console.log('🔧 Sanity Configuration Check:', {
      projectId: projectId ? `${projectId.substring(0, 4)}...${projectId.substring(projectId.length - 4)}` : 'Not found',
      isConfigured,
      reason: !projectId ? 'No project ID found' : 'Valid configuration',
      source: 'NEXT_PUBLIC_SANITY_PROJECT_ID'
    });
  
    return isConfigured;
  } catch (error) {
    console.error('❌ Error checking Sanity configuration:', error);
    return false;
  }
};

// ✅ ENHANCED: Better content conversion with improved error handling
const convertSanityContentToMarkdown = (content: any[]): string => {
  if (!Array.isArray(content)) {
    console.warn('⚠️ Content is not an array:', typeof content);
    return '';
  }

  if (content.length === 0) {
    console.warn('⚠️ Content array is empty');
    return '';
  }

  return content.map((block, index) => {
    try {
      if (!block || typeof block !== 'object') {
        console.warn(`⚠️ Block ${index} is not a valid object:`, block);
        return '';
      }

      if (block._type === 'block') {
        const text = (block.children || [])
          .map((child: any) => {
            if (child && typeof child === 'object' && child.text) {
              return child.text;
            }
            return '';
          })
          .join('');
        
        if (!text.trim()) {
          return '';
        }

        switch (block.style) {
          case 'h1': return `# ${text}`;
          case 'h2': return `## ${text}`;
          case 'h3': return `### ${text}`;
          case 'h4': return `#### ${text}`;
          case 'blockquote': return `> ${text}`;
          default: return text;
        }
      } else if (block._type === 'code') {
        const language = block.language || '';
        const code = block.code || '';
        return `\`\`\`${language}\n${code}\n\`\`\``;
      } else if (block._type === 'image') {
        try {
          // Enhanced image handling
          let imageSource = null;
          
          if (block.asset && block.asset._ref) {
            imageSource = block.asset;
          } else if (block.asset && block.asset.url) {
            imageSource = block.asset;
          } else if (block._ref) {
            imageSource = block;
          } else {
            imageSource = block;
          }

          if (imageSource) {
            const imageUrl = urlFor(imageSource).url();
            const alt = block.alt || block.caption || 'Image';
            return `![${alt}](${imageUrl})`;
          }
        } catch (imageError) {
          console.warn(`⚠️ Could not process image block ${index}:`, imageError);
          return '';
        }
      } else if (block._type === 'codeBlock') {
        // Handle @sanity/code-input plugin blocks
        const language = block.language || '';
        const code = block.code || '';
        const filename = block.filename ? `// ${block.filename}\n` : '';
        return `\`\`\`${language}\n${filename}${code}\n\`\`\``;
      }
      
      return '';
    } catch (blockError) {
      console.warn(`⚠️ Error processing block ${index}:`, blockError);
      return '';
    }
  }).filter(content => content && content.trim()).join('\n\n');
};

const calculateReadingTime = (content: any[]): number => {
  if (!Array.isArray(content)) return 1;

  try {
    const text = content
      .filter(block => block && block._type === 'block')
      .map(block => (block.children || [])
        .map((child: any) => {
          if (child && typeof child === 'object' && child.text) {
            return child.text;
          }
          return '';
        })
        .join('')
      )
      .join(' ');

    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordsPerMinute = 200;
    const wordCount = words.length;
    
    const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    
    console.log(`📖 Reading time calculation: ${wordCount} words = ${readingTime} minutes`);
    return readingTime;
  } catch (error) {
    console.warn('⚠️ Error calculating reading time:', error);
    return 1;
  }
};

// ✅ IMPROVED: More robust date handling
const getValidDateStrings = (dateInput?: any): { date: string; publishedAt: string } => {
  const FALLBACK_DATE = '2024-01-15';
  const FALLBACK_PUBLISHED_AT = '2024-01-15T10:00:00.000Z';

  if (!dateInput) {
    console.warn('⚠️ No date input provided, using fallback');
    return { date: FALLBACK_DATE, publishedAt: FALLBACK_PUBLISHED_AT };
  }

  try {
    let dateObj: Date;

    if (typeof dateInput === 'string') {
      dateObj = new Date(dateInput);
    } else if (dateInput instanceof Date) {
      dateObj = dateInput;
    } else {
      console.warn('⚠️ Invalid date input type:', typeof dateInput);
      return { date: FALLBACK_DATE, publishedAt: FALLBACK_PUBLISHED_AT };
    }

    if (isNaN(dateObj.getTime())) {
      console.warn('⚠️ Invalid date object created from:', dateInput);
      return { date: FALLBACK_DATE, publishedAt: FALLBACK_PUBLISHED_AT };
    }

    const isoString = dateObj.toISOString();
    const dateParts = isoString.split('T');
    const dateOnly = dateParts.length > 0 && dateParts[0] ? dateParts[0] : FALLBACK_DATE;
    const finalDate = dateOnly.match(/^\d{4}-\d{2}-\d{2}$/) ? dateOnly : FALLBACK_DATE;

    return {
      date: finalDate,
      publishedAt: isoString
    };
  } catch (error) {
    console.warn('⚠️ Error formatting date:', error, 'Input was:', dateInput);
    return { date: FALLBACK_DATE, publishedAt: FALLBACK_PUBLISHED_AT };
  }
};

// ✅ ENHANCED: Better conversion function with comprehensive error handling
const convertSanityToPost = (sanityPost: SanityBlogPost): BlogPost => {
  try {
    if (!sanityPost || typeof sanityPost !== 'object') {
      throw new Error('Invalid sanity post object');
    }

    const content = sanityPost.content || [];
    const slug = sanityPost.slug?.current || `post-${Date.now()}`;
    const dateStrings = getValidDateStrings(sanityPost.publishedAt);

    // Enhanced image URL generation
    const coverImage = (() => {
      try {
        if (!sanityPost.coverImage) {
          return '';
        }

        // Handle different image object structures
        if (sanityPost.coverImage.asset) {
          return urlFor(sanityPost.coverImage.asset).url();
        } else if (sanityPost.coverImage._type === 'image') {
          return urlFor(sanityPost.coverImage).url();
        } else {
          return urlFor(sanityPost.coverImage).url();
        }
      } catch (error) {
        console.warn('⚠️ Error generating cover image URL:', error);
        return '';
      }
    })();
    
    const tags = Array.isArray(sanityPost.tags) 
      ? sanityPost.tags.filter(tag => tag && typeof tag === 'string' && tag.trim()) 
      : [];
    
    const category = sanityPost.category || 'tech';
    const postId = sanityPost._id || `fallback-${Date.now()}`;
    const title = sanityPost.title || 'Untitled';
    const excerpt = sanityPost.excerpt || '';

    const convertedPost: BlogPost = {
      id: postId,
      title: title,
      excerpt: excerpt,
      content: convertSanityContentToMarkdown(content),
      slug: slug,
      date: dateStrings.date,
      publishedAt: dateStrings.publishedAt,
      coverImage: coverImage,
      tags: tags,
      category: category,
      featured: Boolean(sanityPost.featured),
      author: 'Harshal Poojari',
      readingTime: calculateReadingTime(content),
      url: `/blog/${slug}`,
      views: 0,
      likes: 0,
      seoTitle: title,
      seoDescription: excerpt,
    };

    console.log(`✅ Converted Sanity post: "${title}" (${slug})`);
    return convertedPost;
  } catch (error) {
    console.error('❌ Error converting Sanity post:', error);
    console.error('❌ Original post data:', sanityPost);
    
    // Return a minimal valid post as fallback
    const fallbackPost: BlogPost = {
      id: `error-${Date.now()}`,
      title: 'Error Loading Post',
      excerpt: 'This post could not be loaded properly.',
      content: 'Content unavailable due to processing error.',
      slug: 'error-post',
      date: '2024-01-01',
      publishedAt: '2024-01-01T00:00:00.000Z',
      coverImage: '',
      tags: [],
      category: 'tech',
      featured: false,
      author: 'Harshal Poojari',
      readingTime: 1,
      url: '/blog/error-post',
      views: 0,
      likes: 0,
      seoTitle: 'Error Loading Post',
      seoDescription: 'This post could not be loaded properly.',
    };
    
    return fallbackPost;
  }
};

// ✅ IMPROVED: Smarter blog post loading with better error handling
export const loadBlogPosts = async (): Promise<BlogPost[]> => {
  console.log('🔄 Starting blog posts load process...');
  
  // Check if Sanity is properly configured first
  if (!isSanityConfigured()) {
    console.warn('⚠️ Sanity is not properly configured. Using fallback posts.');
    return getFallbackPosts();
  }

  try {
    console.log('🔄 Attempting to fetch posts from Sanity...');

    const query = `*[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      _type,
      title,
      slug,
      excerpt,
      coverImage {
        asset->{
          _id,
          _ref,
          url
        },
        alt,
        caption
      },
      category,
      tags,
      featured,
      publishedAt,
      content
    }`;

    // Set a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const sanityPosts: SanityBlogPost[] = await client.fetch(query, {}, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      console.log(`📝 Sanity query result:`, {
        type: Array.isArray(sanityPosts) ? 'array' : typeof sanityPosts,
        length: Array.isArray(sanityPosts) ? sanityPosts.length : 'N/A',
        firstPost: sanityPosts?.[0]?.title || 'No posts'
      });

      if (Array.isArray(sanityPosts) && sanityPosts.length > 0) {
        const posts = sanityPosts
          .filter(post => {
            const isValid = post && typeof post === 'object' && post._id;
            if (!isValid) {
              console.warn('⚠️ Filtering out invalid post:', post);
            }
            return isValid;
          })
          .map(convertSanityToPost);

        console.log(`✅ Successfully processed ${posts.length} posts from Sanity`);
        return posts;
      } else {
        console.info('ℹ️ No posts found in Sanity. Using fallback posts.');
        return getFallbackPosts();
      }
    } catch (error) {
      clearTimeout(timeoutId);
      const fetchError = error as Error;
      if (fetchError.name === 'AbortError') {
        console.error('❌ Sanity request timed out after 5 seconds');
      }
      throw fetchError; // Re-throw to be caught by the outer catch
    }
  } catch (error) {
    console.error('❌ Error fetching blog posts from Sanity:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('projectId') || error.message.includes('project not found')) {
        console.error('🚨 Sanity project ID is invalid or not found');
        console.log('💡 Please check your VITE_SANITY_PROJECT_ID environment variable');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        console.error('🚨 Network error connecting to Sanity');
        console.log('💡 Check your internet connection and make sure the Sanity API is accessible');
      } else if (error.message.includes('Invalid token')) {
        console.error('🚨 Invalid Sanity token');
        console.log('💡 Check your Sanity token in the environment variables');
      }
    }
    
    console.log('🔄 Falling back to demo posts...');
    return getFallbackPosts();
  }
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  console.log(`🔍 Looking for post with slug: "${slug}"`);
  
  try {
    if (!slug || typeof slug !== 'string' || !slug.trim()) {
      console.warn('⚠️ Invalid slug provided:', slug);
      return null;
    }

    const cleanSlug = slug.trim();

    // Try Sanity first regardless of config check
    const query = `*[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      _type,
      title,
      slug,
      excerpt,
      coverImage {
        asset->{
          _id,
          _ref,
          url
        },
        alt,
        caption
      },
      category,
      tags,
      featured,
      publishedAt,
      content
    }`;

    const sanityPost: SanityBlogPost | null = await client.fetch(query, { slug: cleanSlug });
    
    if (sanityPost) {
      console.log(`✅ Found post "${sanityPost.title}" in Sanity`);
      return convertSanityToPost(sanityPost);
    } else {
      console.log(`❌ Post "${cleanSlug}" not found in Sanity, checking fallback`);
      const fallbackPosts = getFallbackPosts();
      const fallbackPost = fallbackPosts.find(post => post.slug === cleanSlug) || null;
      
      if (fallbackPost) {
        console.log(`✅ Found "${cleanSlug}" in fallback posts`);
      } else {
        console.log(`❌ Post "${cleanSlug}" not found anywhere`);
      }
      
      return fallbackPost;
    }

  } catch (error) {
    console.error(`❌ Error fetching post "${slug}":`, error);
    const fallbackPosts = getFallbackPosts();
    return fallbackPosts.find(post => post.slug === slug) || null;
  }
};

export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    console.log(`🔍 Filtering posts by category: "${category}"`);
    const posts = await loadBlogPosts();
    const filtered = category === 'all' ? posts : posts.filter(post => post.category === category);
    console.log(`✅ Found ${filtered.length} posts in category "${category}"`);
    return filtered;
  } catch (error) {
    console.error('❌ Error fetching posts by category:', error);
    return [];
  }
};

export const getFeaturedPosts = async (): Promise<BlogPost[]> => {
  try {
    const allPosts = await loadBlogPosts();
    const featured = allPosts.filter(post => post.featured);
    console.log(`✅ Found ${featured.length} featured posts`);
    return featured;
  } catch (error) {
    console.error('❌ Error fetching featured posts:', error);
    return getFallbackPosts().filter(post => post.featured);
  }
};

export const searchPosts = async (query: string): Promise<BlogPost[]> => {
  try {
    if (!query || typeof query !== 'string') {
      return [];
    }

    const posts = await loadBlogPosts();
    const lower = query.toLowerCase().trim();
    
    if (!lower) {
      return [];
    }

    const results = posts.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(lower);
      const excerptMatch = post.excerpt.toLowerCase().includes(lower);
      const tagMatch = post.tags.some((tag: string) => tag.toLowerCase().includes(lower));
      const contentMatch = post.content.toLowerCase().includes(lower);
      
      return titleMatch || excerptMatch || tagMatch || contentMatch;
    });

    console.log(`🔍 Search for "${query}" returned ${results.length} results`);
    return results;
  } catch (error) {
    console.error('❌ Error searching posts:', error);
    return [];
  }
};

// ✅ UPDATED: Better fallback posts with more realistic content
const getFallbackPosts = (): BlogPost[] => [
  {
    id: 'fallback-1',
    title: 'Welcome to My Blog!',
    excerpt: 'This is a demo post. Connect your Sanity CMS to see your real blog posts here. Create amazing content with the powerful Sanity Studio.',
    content: `# Welcome to My Blog!

This is a **demo blog post** to show you how your blog will look once you connect your Sanity CMS.

## Getting Started with Sanity

To see your real blog posts:

1. **Set up your environment variables** in \`.env.local\`
2. **Create posts in Sanity Studio** (http://localhost:3333)
3. **Publish your posts**
4. **Refresh this page**

## Features Available

- ✅ Rich text editing with code blocks
- ✅ Image uploads and optimization  
- ✅ Categories and tags
- ✅ Featured posts
- ✅ SEO optimization
- ✅ Responsive design

\`\`\`javascript
// Example code block
const blogPost = {
  title: "My First Post",
  content: "Hello World!",
  published: true
};
\`\`\`

> **Note:** This is a fallback post. Your real content will appear here once Sanity is properly configured.

Start creating amazing content today!`,
    slug: 'welcome-to-my-blog',
    date: '2024-01-15',
    publishedAt: '2024-01-15T10:00:00.000Z',
    coverImage: '',
    tags: ['welcome', 'demo', 'sanity', 'blog'],
    category: 'tech',
    featured: true,
    author: 'Harshal Poojari',
    readingTime: 3,
    url: '/blog/welcome-to-my-blog',
    views: 42,
    likes: 8,
    seoTitle: 'Welcome to My Blog - Get Started with Sanity CMS',
    seoDescription: 'This is a demo post. Connect your Sanity CMS to see your real blog posts here.',
  },
  {
    id: 'fallback-2',
    title: 'How to Create Your First Blog Post',
    excerpt: 'Learn how to create and publish your first blog post using Sanity Studio. Step-by-step guide for content creators.',
    content: `# How to Create Your First Blog Post

Ready to start blogging? Here's how to create your first post using Sanity Studio.

## Step 1: Access Sanity Studio

Navigate to [http://localhost:3333](http://localhost:3333) to access your Sanity Studio.

## Step 2: Create a New Post

1. Click **"Blog Post"** in the content types
2. Click **"Create new Blog Post"**
3. Fill in the required fields

## Step 3: Add Content

Use the rich text editor to add:
- **Headings** for structure
- **Images** for visual appeal
- **Code blocks** for technical content
- **Lists** for organization

## Step 4: Publish

When you're ready, click the **"Publish"** button to make your post live!

\`\`\`bash
# Your post will be available at:
http://localhost:3000/blog/your-post-slug
\`\`\`

Happy blogging! 🚀`,
    slug: 'create-first-blog-post',
    date: '2024-01-10',
    publishedAt: '2024-01-10T14:30:00.000Z',
    coverImage: '',
    tags: ['tutorial', 'getting-started', 'sanity', 'blogging'],
    category: 'tutorial',
    featured: false,
    author: 'Harshal Poojari',
    readingTime: 4,
    url: '/blog/create-first-blog-post',
    views: 28,
    likes: 5,
    seoTitle: 'How to Create Your First Blog Post - Sanity Tutorial',
    seoDescription: 'Learn how to create and publish your first blog post using Sanity Studio.',
  }
];

// ✅ ENHANCED: Better connection test
export const testSanityConnection = async (): Promise<boolean> => {
  try {
    console.log('🔄 Testing Sanity connection...');
    
    const result = await client.fetch('*[_type == "blogPost"][0]');
    
    if (result) {
      console.log('✅ Sanity connection successful - found data:', result.title || 'Untitled post');
      return true;
    } else {
      console.log('✅ Sanity connection successful - no posts yet');
      return true;
    }
  } catch (error) {
    console.error('❌ Sanity connection failed:', error);
    return false;
  }
};

// ✅ ENHANCED: Better status reporting
export const getSanityStatus = () => {
  const viteProjectId = import.meta.env.VITE_SANITY_PROJECT_ID;
  const viteDataset = import.meta.env.VITE_SANITY_DATASET;
  
  const status = {
    configured: isSanityConfigured(),
    projectId: viteProjectId || 'Not set',
    dataset: viteDataset || 'production',
    usingFallback: !isSanityConfigured(),
    environmentType: 'Vite',
    allEnvVars: Object.keys(import.meta.env).filter(key => key.includes('SANITY'))
  };
  
  console.log('📊 Sanity Status:', status);
  return status;
};

// ✅ ENHANCED: Better environment debugging
export const debugEnvironment = () => {
  const debug = {
    'import.meta.env.VITE_SANITY_PROJECT_ID': import.meta.env.VITE_SANITY_PROJECT_ID,
    'import.meta.env.VITE_SANITY_DATASET': import.meta.env.VITE_SANITY_DATASET,
    'All VITE vars': Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')),
    'All SANITY vars': Object.keys(import.meta.env).filter(key => key.includes('SANITY')),
    'Environment type': 'Vite/React',
    'Node env': import.meta.env.MODE
  };
  
  console.log('🔍 Environment Debug:', debug);
  return debug;
};
