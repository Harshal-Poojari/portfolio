import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from '../context/RouterContext';
import { NAVIGATION_ANIMATIONS } from '../config/navigation';
import { loadBlogPosts } from '../data/sanityPosts';
import { BlogPost } from '../types/blog';
import { client } from '../lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import { format } from 'date-fns';

const BlogList: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { navigateTo } = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize the image URL builder
  const builder = imageUrlBuilder(client);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const blogPosts = await loadBlogPosts();
        setPosts(blogPosts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle blog post click
  const handlePostClick = (post: BlogPost, e: React.MouseEvent) => {
    // Only handle the click if it's not on a link or button
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button, [role="button"]')) {
      return;
    }
    
    console.log('🖱️ Clicking post from list:', post.title);
    
    // Check if the URL is external (starts with http/https)
    if (post.url && post.url.startsWith('http')) {
      window.open(post.url, '_blank');
      return;
    }
    
    // Use router for internal navigation
    if (post.slug) {
      navigateTo('blog-post', post.slug);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center text-slate-900 dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={NAVIGATION_ANIMATIONS.smooth}
      >
        All Blog Posts
      </motion.h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">No blog posts found.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              className={`flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-800/50 hover:bg-slate-800/70' 
                  : 'bg-white/80 hover:bg-white'
              } shadow-lg hover:shadow-xl`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...NAVIGATION_ANIMATIONS.smooth, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={(e) => handlePostClick(post, e)}
            >
              {post.coverImage && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.coverImage ? builder.image(post.coverImage).width(600).url() : ''} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {post.category || 'Uncategorized'}
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {post.tags[0]}
                        {post.tags.length > 1 ? ` +${post.tags.length - 1}` : ''}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                  <span>{Math.ceil(post.readingTime || 5)} min read</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
