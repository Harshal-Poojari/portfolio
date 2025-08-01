import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, Clock, ArrowRight, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ThemeContext } from '@/App';
import { loadBlogPosts, blogCategories } from "../data/sanityPosts"; // ✅ Using Sanity data
import { useRouter } from '@/context/RouterContext';
import type { BlogPost, BlogCategory } from '@/types/blog';

const Blog: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const sectionRef = useScrollAnimation();
  const { navigateTo } = useRouter();
  
  // State management
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Loading blog posts from Sanity CMS...'); // Debug log
        
        const allPosts = await loadBlogPosts();
        
        console.log(`✅ Loaded ${allPosts.length} posts from Sanity`); // Debug log
        
        // Get latest 3 posts, prioritizing featured posts
        const sortedPosts = allPosts.sort((a, b) => {
          // Featured posts first
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          // Then by date
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setPosts(sortedPosts.slice(0, 3));
      } catch (err) {
        console.error('❌ Error loading posts from Sanity:', err);
        setError('Failed to load blog posts from Sanity CMS');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryInfo = (categoryId: string): BlogCategory | undefined => {
    return blogCategories.find(cat => cat.id === categoryId);
  };

  const handlePostClick = (post: BlogPost) => {
    console.log('🖱️ Clicking post:', post.title); // Debug log
    
    // Check if the URL is external (starts with http/https)
    if (post.url && post.url.startsWith('http')) {
      window.open(post.url, '_blank');
      return;
    }
    // Navigate to blog post page
    navigateTo('blog-post', post.slug);
  };

  const handleRefresh = async () => {
    console.log('🔄 Refreshing blog posts...'); // Debug log
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const allPosts = await loadBlogPosts();
        const sortedPosts = allPosts.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setPosts(sortedPosts.slice(0, 3));
      } catch (err) {
        console.error('❌ Error refreshing posts:', err);
        setError('Failed to refresh blog posts');
      } finally {
        setLoading(false);
      }
    };
    await fetchPosts();
  };

  // Loading state
  if (loading) {
    return (
      <section id="blog" className={`py-20 px-6 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Loading blog posts...
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Fetching content from Sanity CMS
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="blog" className={`py-20 px-6 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
              isDarkMode ? 'bg-red-900/20' : 'bg-red-100'
            }`}>
              <BookOpen className={`w-12 h-12 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Failed to Load Posts
            </h3>
            <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {error}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRefresh}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => navigateTo('blog-list')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300'
                }`}
              >
                Go to Blog List
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="blog" className={`py-20 px-6 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Latest Blog Posts
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-8" />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto mb-4`}>
              Thoughts, tutorials, and insights from my journey in game development and web technologies
            </p>
            {/* ✅ Added indicator that content comes from Sanity */}
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Content managed via Sanity CMS • {posts.length} recent posts
            </p>
          </motion.div>
        </div>

        {posts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post, index) => {
                const category = getCategoryInfo(post.category);
                
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`group relative cursor-pointer ${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-slate-700/50' 
                        : 'bg-white border-gray-200'
                    } backdrop-blur-sm rounded-xl border overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                    onClick={() => handlePostClick(post)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Post Image */}
                    <div className="relative aspect-video bg-gradient-to-br from-indigo-900/30 to-purple-900/30 group-hover:from-indigo-900/40 group-hover:to-purple-900/40 transition-all duration-300">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}

                      {/* Featured badge */}
                      {post.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                            Featured
                          </span>
                        </div>
                      )}

                      {/* Category badge */}
                      {category && (
                        <div className="absolute top-4 right-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${category.color}-500 text-white`}>
                            {category.name}
                          </span>
                        </div>
                      )}

                      {/* Link indicator */}
                      <div className={`absolute bottom-4 right-4 p-2 rounded-full ${
                        isDarkMode 
                          ? 'bg-slate-800/90 text-indigo-400' 
                          : 'bg-white/90 text-indigo-600'
                      } opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
                        {(post.url && post.url.startsWith('http')) ? 
                          <ExternalLink className="w-4 h-4" /> : 
                          <ArrowRight className="w-4 h-4" />
                        }
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Post meta */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                              {formatDate(post.date)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                              {post.readingTime} min
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Post title and excerpt */}
                      <div>
                        <h3 className={`text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {post.title}
                        </h3>
                        <p className={`text-sm leading-relaxed line-clamp-3 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                            <span
                              key={tagIndex}
                              className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-md ${
                                isDarkMode 
                                  ? 'bg-slate-700/50 text-gray-300' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <Tag className="w-3 h-3" />
                              <span>{tag}</span>
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className={`px-2 py-1 text-xs rounded-md ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* View All Posts & Studio Access */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                <motion.button 
                  onClick={() => navigateTo('blog-list')}
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isDarkMode
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>View All Posts</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* ✅ Quick access to Sanity Studio */}
                {process.env.NODE_ENV === 'development' && (
                  <motion.button 
                    onClick={() => navigateTo('studio')}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-green-600/20 text-green-300 hover:bg-green-600/30 border border-green-500/30'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Manage blog posts in Sanity Studio"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Manage Posts</span>
                  </motion.button>
                )}
              </div>

              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Explore all my articles and tutorials
              </p>
            </motion.div>
          </>
        ) : (
          /* No Posts State - Updated for Sanity */
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Blog Posts Yet
            </h3>
            <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Ready to create your first blog post? Use Sanity Studio to get started.
            </p>
            
            {/* ✅ Direct link to create first post */}
            {process.env.NODE_ENV === 'development' && (
              <div className="flex gap-4 justify-center">
                <motion.button 
                  onClick={() => navigateTo('studio')}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Create First Post</span>
                </motion.button>
                
                <button
                  onClick={handleRefresh}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Blog;
