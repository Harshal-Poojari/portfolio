import { compareDesc } from 'date-fns';

// Replace the Contentlayer Post type with our own
export type Post = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  tags?: string[];
  category?: string;
  featured?: boolean;
  draft?: boolean;
  body: {
    raw: string;
    code: string;
  };
  readingTime?: number;
  views?: number;
  description?: string;
  author?: {
    name: string;
    role: string;
    image: string;
  };
};

// Mock posts data - replaces allPosts from Contentlayer
const allPosts: Post[] = [
  {
    _id: '1',
    slug: 'getting-started-react',
    title: 'Getting Started with React Development',
    excerpt: 'Learn the fundamentals of React development and build modern web applications.',
    description: 'A comprehensive guide to React development covering components, hooks, and state management.',
    date: '2024-01-15',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    tags: ['React', 'JavaScript', 'Web Development', 'Frontend'],
    category: 'Frontend',
    featured: true,
    draft: false,
    views: 245,
    body: {
      raw: 'React is a powerful JavaScript library for building user interfaces...',
      code: `<h2>Introduction to React</h2>
<p>React is a powerful JavaScript library for building user interfaces.</p>
<h3>Key Features</h3>
<ul>
  <li><strong>Component-Based:</strong> Build encapsulated components</li>
  <li><strong>Virtual DOM:</strong> Efficient updates and rendering</li>
  <li><strong>JSX:</strong> Write HTML-like syntax in JavaScript</li>
</ul>`
    },
    readingTime: 8,
    author: {
      name: 'Harshal Poojari',
      role: 'Full Stack Developer & Game Creator',
      image: '/images/avatar.jpg'
    }
  },
  {
    _id: '2',
    slug: 'advanced-react-patterns',
    title: 'Advanced React Patterns and Best Practices',
    excerpt: 'Explore advanced React patterns including custom hooks, context API, and performance optimization.',
    description: 'Deep dive into advanced React patterns for building scalable applications.',
    date: '2024-01-22',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    tags: ['React', 'Advanced', 'Patterns', 'Performance'],
    category: 'Frontend',
    featured: true,
    draft: false,
    views: 189,
    body: {
      raw: 'Advanced React patterns help you build better applications...',
      code: `<h2>Advanced React Patterns</h2>
<p>Advanced React patterns help you build better, more maintainable applications.</p>
<h3>Custom Hooks</h3>
<p>Custom hooks allow you to extract component logic into reusable functions.</p>`
    },
    readingTime: 12,
    author: {
      name: 'Harshal Poojari',
      role: 'Full Stack Developer & Game Creator',
      image: '/images/avatar.jpg'
    }
  },
  {
    _id: '3',
    slug: 'typescript-with-react',
    title: 'TypeScript with React: A Complete Guide',
    excerpt: 'Learn how to use TypeScript effectively in React applications for better type safety.',
    description: 'Complete guide to integrating TypeScript with React for better development experience.',
    date: '2024-01-29',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    tags: ['TypeScript', 'React', 'Type Safety', 'Development'],
    category: 'Frontend',
    featured: false,
    draft: false,
    views: 156,
    body: {
      raw: 'TypeScript adds static type checking to JavaScript...',
      code: `<h2>Why TypeScript with React?</h2>
<p>TypeScript adds static type checking to JavaScript, making your React applications more robust.</p>
<h3>Benefits</h3>
<ul>
  <li>Catch errors at compile time</li>
  <li>Better IDE support and autocomplete</li>
  <li>Improved code documentation</li>
</ul>`
    },
    readingTime: 10,
    author: {
      name: 'Harshal Poojari',
      role: 'Full Stack Developer & Game Creator',
      image: '/images/avatar.jpg'
    }
  }
];

type GetPostsOptions = {
  limit?: number;
  tag?: string;
  category?: string;
  featured?: boolean;
  excludeId?: string;
  relatedTo?: string[];
};

// All your existing API functions work exactly the same
export function getAllPosts(options: GetPostsOptions = {}) {
  const { limit, tag, category, featured, excludeId, relatedTo } = options;

  let posts = allPosts
    .filter((post) => {
      if (process.env.NODE_ENV === 'production' && post.draft) {
        return false;
      }
      return true;
    })
    .filter((post) => {
      if (!tag) return true;
      return post.tags?.includes(tag);
    })
    .filter((post) => {
      if (!category) return true;
      return post.category === category;
    })
    .filter((post) => {
      if (featured === undefined) return true;
      return post.featured === featured;
    })
    .filter((post) => {
      if (!excludeId) return true;
      return post._id !== excludeId;
    });

  if (relatedTo && relatedTo.length > 0) {
    posts = posts
      .filter((post) => {
        if (!post.tags) return false;
        return post.tags.some((tag) => relatedTo.includes(tag));
      })
      .sort((a, b) => {
        const aMatches = a.tags?.filter((tag) => relatedTo.includes(tag)).length || 0;
        const bMatches = b.tags?.filter((tag) => relatedTo.includes(tag)).length || 0;
        return bMatches - aMatches;
      });
  }

  posts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  if (limit) {
    return posts.slice(0, limit);
  }

  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug);
}

export function getAllTags(): { name: string; count: number }[] {
  const tags = new Map<string, number>();

  allPosts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        tags.set(tag, (tags.get(tag) || 0) + 1);
      });
    }
  });

  return Array.from(tags.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): { name: string; count: number }[] {
  const categories = new Map<string, number>();

  allPosts.forEach((post) => {
    if (post.category) {
      categories.set(post.category, (categories.get(post.category) || 0) + 1);
    }
  });

  return Array.from(categories.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  if (!post.tags || post.tags.length === 0) {
    return getAllPosts({ limit, excludeId: post._id });
  }

  const related = getAllPosts({
    relatedTo: post.tags,
    excludeId: post._id,
  });

  if (related.length < limit) {
    const recent = getAllPosts({
      limit: limit - related.length,
      excludeId: post._id,
    }).filter((p) => !related.some((r) => r._id === p._id));

    return [...related, ...recent].slice(0, limit);
  }

  return related.slice(0, limit);
}

export function getAdjacentPosts(post: Post): { previous: Post | null; next: Post | null } {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p._id === post._id);
  
  let previous: Post | null = null;
  let next: Post | null = null;
  
  if (index !== -1) {
    if (index > 0) {
      const prevPost = posts[index - 1];
      previous = prevPost !== undefined ? prevPost : null;
    }
    
    if (index < posts.length - 1) {
      const nextPost = posts[index + 1];
      next = nextPost !== undefined ? nextPost : null;
    }
  }
  
  return { previous, next };
}
