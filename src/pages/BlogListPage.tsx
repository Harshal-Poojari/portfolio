'use client';

import React, { useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Clock, Eye, Heart, ArrowLeft, Tag as TagIcon, Filter, TrendingUp, Sparkles, X, Command, Grid, List, Menu, Bookmark, Share, MoreHorizontal, Star, Zap, Users, MessageCircle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from '@/context/RouterContext';
import { loadBlogPosts, blogCategories } from '@/data/sanityPosts';
import type { BlogPost, BlogCategory } from '@/types/blog';
import NewsletterSignup from '@/components/Blog/NewsletterSignup';
import NewsletterPopup from '@/components/Blog/NewsletterPopup';
import { useNewsletterPopup } from '@/hooks/useNewsletterPopup';

const colorClassMap: Record<string, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  gray: 'bg-gray-500',
};

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Enhanced Floating Action Button Component
const FloatingActionButton: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3"
          >
            <motion.button
              className={`p-3 rounded-full shadow-lg backdrop-blur-md ${
                isDarkMode ? 'bg-slate-800/90 text-indigo-400' : 'bg-white/90 text-indigo-600'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bookmark className="w-5 h-5" />
            </motion.button>
            <motion.button
              className={`p-3 rounded-full shadow-lg backdrop-blur-md ${
                isDarkMode ? 'bg-slate-800/90 text-green-400' : 'bg-white/90 text-green-600'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        <MoreHorizontal className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

// Enhanced Blog Card Component
const EnhancedBlogCard: React.FC<{
  post: BlogPost;
  index: number;
  isDarkMode: boolean;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}> = ({ post, index, isDarkMode, viewMode, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group cursor-pointer relative overflow-hidden ${
        isDarkMode ? 'bg-slate-800/40 border-slate-700/30' : 'bg-white/70 border-gray-200/50'
      } backdrop-blur-sm rounded-2xl border hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 ${
        viewMode === 'list' ? 'flex items-center p-4' : ''
      }`}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: viewMode === 'grid' ? 1.02 : 1.01 }}
    >
      {/* Enhanced Grid View */}
      {viewMode === 'grid' ? (
        <>
          {/* Image Container with Enhanced Effects */}
          <div className="relative aspect-video bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 group-hover:from-indigo-900/40 group-hover:via-purple-900/40 group-hover:to-pink-900/40 transition-all duration-700 overflow-hidden">
            {post.coverImage ? (
              <>
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center"
                  animate={{ 
                    rotate: isHovered ? 360 : 0,
                    scale: isHovered ? 1.1 : 1 
                  }}
                  transition={{ duration: 0.7 }}
                >
                  <TagIcon className="w-10 h-10 text-white" />
                </motion.div>
              </div>
            )}

            {/* Enhanced Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {post.featured && (
                <motion.span 
                  className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg backdrop-blur-sm"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                >
                  <Star className="w-3 h-3 inline mr-1" />
                  Featured
                </motion.span>
              )}
              {post.isNew && (
                <motion.span 
                  className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg backdrop-blur-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  New
                </motion.span>
              )}
            </div>

            {/* Bookmark Button */}
            <motion.button
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                isBookmarked 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-black/20 text-white/80 hover:bg-black/40'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsBookmarked(!isBookmarked);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
            </motion.button>

            {/* Enhanced Stats */}
            <motion.div 
              className="absolute bottom-3 right-3 flex items-center gap-2 text-white/90 text-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0.7, y: 0 }}
            >
              {post.views && post.views > 0 && (
                <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-md">
                  <Eye className="w-3 h-3" />
                  {post.views > 999 ? `${(post.views/1000).toFixed(1)}k` : post.views}
                </div>
              )}
              {post.likes && post.likes > 0 && (
                <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-md">
                  <Heart className="w-3 h-3 text-red-400" />
                  {post.likes > 999 ? `${(post.likes/1000).toFixed(1)}k` : post.likes}
                </div>
              )}
              {post.comments && (
                <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-md">
                  <MessageCircle className="w-3 h-3 text-blue-400" />
                  {post.comments}
                </div>
              )}
            </motion.div>

            {/* Reading Progress Indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: "0%" }}
                animate={{ width: isHovered ? "100%" : "0%" }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="p-6 space-y-4">
            {/* Meta Information */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <Calendar className={`w-3 h-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <Clock className={`w-3 h-3 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {post.readingTime ?? '5'} min read
                  </span>
                </motion.div>
                {post.difficulty && (
                  <motion.div 
                    className="flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Zap className={`w-3 h-3 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {post.difficulty}
                    </span>
                  </motion.div>
                )}
              </div>
              <motion.span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  isDarkMode ? 'bg-indigo-600/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {blogCategories.find((cat: BlogCategory) => cat.id === post.category)?.name}
              </motion.span>
            </div>

            {/* Title and Excerpt */}
            <div>
              <motion.h3
                className={`text-xl font-bold mb-3 line-clamp-2 transition-all duration-300 ${
                  isDarkMode ? 'text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text' : 'text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                {post.title}
              </motion.h3>
              <p
                className={`text-sm leading-relaxed line-clamp-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {post.excerpt}
              </p>
            </div>

            {/* Enhanced Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                  <motion.span
                    key={tagIndex}
                    className={`px-3 py-1 text-xs rounded-full transition-all duration-300 cursor-pointer ${
                      isDarkMode 
                        ? 'bg-slate-700/50 text-gray-400 hover:bg-slate-600/50 hover:text-gray-300' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle tag click
                    }}
                  >
                    #{tag}
                  </motion.span>
                ))}
                {post.tags.length > 3 && (
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    isDarkMode ? 'text-gray-500 bg-slate-700/30' : 'text-gray-500 bg-gray-50'
                  }`}>
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Author Info */}
            {post.author && (
              <motion.div 
                className="flex items-center gap-3 pt-3 border-t border-gray-200/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {typeof post.author === 'string' ? post.author : post.author?.name || 'Unknown Author'}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Author
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </>
      ) : (
        /* Enhanced List View */
        <>
          <div className="w-32 h-20 rounded-xl overflow-hidden flex-shrink-0 mr-6 relative">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <TagIcon className="w-8 h-8 text-white" />
              </div>
            )}
            {post.featured && (
              <div className="absolute top-1 left-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className={`text-lg font-bold mb-2 line-clamp-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-white group-hover:text-indigo-400' : 'text-gray-900 group-hover:text-indigo-600'
                }`}>
                  {post.title}
                </h3>
                <p className={`text-sm line-clamp-2 mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-6 text-xs">
                  <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Clock className="w-3 h-3" />
                    {post.readingTime ?? '5'} min
                  </span>
                  {post.views && (
                    <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Eye className="w-3 h-3" />
                      {post.views > 999 ? `${(post.views/1000).toFixed(1)}k` : post.views}
                    </span>
                  )}
                  {post.likes && (
                    <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Heart className="w-3 h-3 text-red-400" />
                      {post.likes}
                    </span>
                  )}
                </div>
              </div>
              <motion.button
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isBookmarked 
                    ? 'bg-indigo-500 text-white' 
                    : isDarkMode ? 'bg-slate-700/50 text-gray-400 hover:bg-slate-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookmarked(!isBookmarked);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
              </motion.button>
            </div>
          </div>
        </>
      )}
    </motion.article>
  );
};

const BlogListPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { navigateTo, goBack } = useRouter();
  const { showPopup, closePopup } = useNewsletterPopup();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const blogPosts = await loadBlogPosts();
        
        // Normalize author data to always be a string
        const normalizedPosts = blogPosts.map(post => ({
          ...post,
          author: typeof post.author === 'string' ? post.author : post.author.name
        }));
        
        setPosts(normalizedPosts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
      if (e.key === 'Escape') {
        setSearchQuery('');
        setShowSearchSuggestions(false);
        setShowMobileMenu(false);
      }
    };

    if (isMounted) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      if (isMounted) {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      try {
        const saved = localStorage.getItem('blog-recent-searches');
        if (saved) {
          setRecentSearches(JSON.parse(saved));
        }
      } catch (error) {
        console.warn('Failed to load recent searches:', error);
      }
    }
  }, [isMounted]);

  const saveSearch = useCallback((query: string) => {
    if (!query.trim() || recentSearches.includes(query)) return;
    
    try {
      const updated = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      if (isMounted) {
        localStorage.setItem('blog-recent-searches', JSON.stringify(updated));
      }
    } catch (error) {
      console.warn('Failed to save search:', error);
    }
  }, [recentSearches, isMounted]);

  const filteredAndSortedPosts = useMemo(() => {
    let filteredPosts = posts;

    if (debouncedSearchQuery.trim()) {
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        (post.tags && post.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery)))
      );
    }

    if (selectedCategory !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === selectedCategory);
    }

    return filteredPosts.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [posts, debouncedSearchQuery, selectedCategory, sortBy]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return recentSearches.map(s => ({ text: s, type: 'recent' as const }));
    
    const query = searchQuery.toLowerCase();
    const suggestions: Array<{text: string, type: 'tag' | 'title' | 'recent'}> = [];
    
    const tags = [...new Set(posts.flatMap(post => post.tags || []))].filter(Boolean);
    tags.forEach(tag => {
      if (tag.toLowerCase().includes(query) && suggestions.length < 5) {
        suggestions.push({ text: tag, type: 'tag' });
      }
    });
    
    posts.forEach(post => {
      if (post.title.toLowerCase().includes(query) && suggestions.length < 8) {
        suggestions.push({ text: post.title, type: 'title' });
      }
    });
    
    return suggestions;
  }, [searchQuery, posts, recentSearches]);

  const handlePostClick = (post: BlogPost) => {
    navigateTo('blog-post', post.slug);
  };

  const handleSearchSubmit = (query: string) => {
    saveSearch(query);
    setShowSearchSuggestions(false);
  };

  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const featuredPosts = posts.filter(post => post.featured).length;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative mb-8">
            <motion.div 
              className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-500 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-purple-200 border-b-purple-500"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Loading Amazing Content...
            </span>
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Preparing your reading experience
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <motion.div 
          className="text-center max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-red-900/20' : 'bg-red-100'}`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Search className={`w-10 h-10 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
          </motion.div>
          <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Oops! Something went wrong
            </span>
          </h3>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
            <motion.button
              onClick={goBack}
              className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`}>
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className={`absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 ${isDarkMode ? 'bg-indigo-500' : 'bg-indigo-200'} blur-3xl`}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 ${isDarkMode ? 'bg-purple-500' : 'bg-purple-200'} blur-3xl`}
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0] 
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className={`absolute top-1/2 left-1/2 w-72 h-72 rounded-full opacity-5 ${isDarkMode ? 'bg-pink-500' : 'bg-pink-200'} blur-3xl`}
          animate={{ 
            x: [-100, 100, -100],
            y: [-50, 50, -50],
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>

      {/* Enhanced Header - Keeping your structure but with improvements */}
      <motion.header 
        className={`sticky top-0 z-50 backdrop-blur-xl border-b ${
          isDarkMode 
            ? 'bg-slate-900/95 border-slate-700/30' 
            : 'bg-white/95 border-gray-200/30'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between py-3">
              <motion.button
                onClick={goBack}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  isDarkMode ? 'text-indigo-400 hover:bg-slate-800/50' : 'text-indigo-600 hover:bg-indigo-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </motion.button>

              <div className="text-center flex-1 mx-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Prompto
                  </span>
                </h1>
              </div>

              <motion.button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-slate-800/50 text-white' : 'bg-gray-100 text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pb-4 space-y-3"
                >
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-indigo-500/20 ${
                        isDarkMode 
                          ? 'bg-slate-800/60 border-slate-700/50 text-white placeholder-gray-400' 
                          : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  {/* Mobile Controls */}
                  <div className="flex items-center justify-between gap-3">
                    <div className={`flex rounded-lg border ${
                      isDarkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/60 border-gray-200'
                    }`}>
                      {[
                        { key: 'date' as const, label: 'Latest', icon: Calendar },
                        { key: 'views' as const, label: 'Popular', icon: TrendingUp },
                        { key: 'likes' as const, label: 'Loved', icon: Heart }
                      ].map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          onClick={() => setSortBy(key)}
                          className={`flex items-center gap-1 px-2 py-1.5 text-xs font-medium transition-all duration-300 ${
                            sortBy === key
                              ? isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                              : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                          } ${key === 'date' ? 'rounded-l-lg' : key === 'likes' ? 'rounded-r-lg' : ''}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span className="hidden xs:inline">{label}</span>
                        </button>
                      ))}
                    </div>

                    <div className={`flex rounded-lg border ${
                      isDarkMode ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white/50 border-gray-200'
                    }`}>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-l-lg transition-all duration-300 ${
                          viewMode === 'grid'
                            ? isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                            : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Grid className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-r-lg transition-all duration-300 ${
                          viewMode === 'list'
                            ? isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                            : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <List className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <div className="py-4">
              {/* Single Row Layout */}
              <div className="flex items-center justify-between gap-6">
                {/* Left: Back Button + Title + Stats */}
                <div className="flex items-center gap-6">
                  <motion.button
                    onClick={goBack}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isDarkMode ? 'text-indigo-400 hover:bg-slate-800/50' : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </motion.button>

                  {/* Enhanced Title */}
                  <div className="text-center">
                    <motion.h1 
                      className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Prompto
                      </span>
                    </motion.h1>
                    <motion.p 
                      className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                    </motion.p>
                  </div>

                  {/* Enhanced Stats */}
                  <div className="flex items-center gap-6">
                    <motion.div 
                      className="flex items-center gap-2 text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`} />
                      <span className={`font-semibold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {filteredAndSortedPosts.length}
                      </span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>articles</span>
                    </motion.div>
                    <div className={`w-px h-6 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'}`} />
                    <motion.div 
                      className="flex items-center gap-2 text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-purple-400' : 'bg-purple-600'}`} />
                      <span className={`font-semibold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        {featuredPosts}
                      </span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>featured</span>
                    </motion.div>
                    <div className={`w-px h-6 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'}`} />
                    <motion.div 
                      className="flex items-center gap-2 text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-600'}`} />
                      <span className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {Math.round(totalViews / 1000) || 0}k
                      </span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>views</span>
                    </motion.div>
                  </div>
                </div>

                {/* Right: Search + Controls */}
                <div className="flex items-center gap-4">
                  {/* Enhanced Search */}
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <motion.input
                      id="search-input"
                      type="text"
                      placeholder="Search posts... (⌘K)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSearchSuggestions(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchSubmit(searchQuery);
                        }
                      }}
                      className={`w-80 pl-10 pr-16 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                        isDarkMode 
                          ? 'bg-slate-800/60 border-slate-700/50 text-white placeholder-gray-400' 
                          : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500'
                      }`}
                      whileFocus={{ scale: 1.02 }}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {searchQuery && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => setSearchQuery('')}
                          className={`p-1 rounded-full ${
                            isDarkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-3 h-3" />
                        </motion.button>
                      )}
                      <div className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded text-xs ${
                        isDarkMode ? 'bg-slate-700/50 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Command className="w-3 h-3" />
                        <span>K</span>
                      </div>
                    </div>

                    {/* Search Suggestions */}
                    <AnimatePresence>
                      {showSearchSuggestions && searchSuggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl z-50 ${
                            isDarkMode ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-gray-200'
                          } backdrop-blur-md`}
                        >
                          <div className="p-2">
                            {searchSuggestions.slice(0, 5).map((suggestion, index) => (
                              <motion.button
                                key={`${suggestion.type}-${suggestion.text}-${index}`}
                                onClick={() => {
                                  setSearchQuery(suggestion.text);
                                  handleSearchSubmit(suggestion.text);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                  isDarkMode ? 'hover:bg-slate-700/50 text-gray-300' : 'hover:bg-gray-100/50 text-gray-700'
                                }`}
                                whileHover={{ scale: 1.02 }}
                              >
                                {suggestion.type === 'recent' && <Clock className="w-3 h-3 text-gray-400" />}
                                {suggestion.type === 'tag' && <TagIcon className="w-3 h-3 text-indigo-400" />}
                                {suggestion.type === 'title' && <Search className="w-3 h-3 text-purple-400" />}
                                <span className="truncate text-sm">{suggestion.text}</span>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Enhanced Sort Controls */}
                  <div className={`flex rounded-xl border ${
                    isDarkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/60 border-gray-200'
                  }`}>
                    {[
                      { key: 'date' as const, label: 'Latest', icon: Calendar },
                      { key: 'views' as const, label: 'Popular', icon: TrendingUp },
                      { key: 'likes' as const, label: 'Loved', icon: Heart }
                    ].map(({ key, label, icon: Icon }) => (
                      <motion.button
                        key={key}
                        onClick={() => setSortBy(key)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                          sortBy === key
                            ? isDarkMode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-500 text-white shadow-lg'
                            : isDarkMode ? 'text-gray-300 hover:text-white hover:bg-slate-700/50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                        } ${key === 'date' ? 'rounded-l-xl' : key === 'likes' ? 'rounded-r-xl' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden xl:inline">{label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Enhanced View Mode Toggle */}
                  <div className={`flex rounded-xl border ${
                    isDarkMode ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white/50 border-gray-200'
                  }`}>
                    <motion.button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 rounded-l-xl transition-all duration-300 ${
                        viewMode === 'grid'
                          ? isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                          : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Grid className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => setViewMode('list')}
                      className={`p-3 rounded-r-xl transition-all duration-300 ${
                        viewMode === 'list'
                          ? isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                          : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <List className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Enhanced Category Pills */}
              <motion.div 
                className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-opacity-10 border-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {blogCategories.map((category: BlogCategory, index: number) => {
                  const bgClass = colorClassMap[category.color] || 'bg-gray-500';
                  const isSelected = selectedCategory === category.id;

                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        isSelected
                          ? `${bgClass} text-white shadow-lg shadow-${category.color}-500/25`
                          : isDarkMode
                            ? 'bg-slate-800/60 text-gray-300 hover:bg-slate-700/60 border border-slate-700/30'
                            : 'bg-white/60 text-gray-700 hover:bg-gray-50 border border-gray-200/50'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      {category.name}
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Click outside to close suggestions */}
      {showSearchSuggestions && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowSearchSuggestions(false)}
        />
      )}

      {/* Enhanced Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {filteredAndSortedPosts.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              key="empty"
            >
              <motion.div 
                className={`w-32 h-32 mx-auto mb-8 rounded-3xl flex items-center justify-center ${
                  isDarkMode ? 'bg-slate-800/30' : 'bg-gray-100'
                }`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Search className={`w-16 h-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </motion.div>
              <h3 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {searchQuery || selectedCategory !== 'all' ? 'No posts found' : 'No posts available'}
                </span>
              </h3>
              <p className={`text-lg mb-8 max-w-md mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first blog post in Sanity Studio'
                }
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <motion.button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Clear Filters
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              className={viewMode === 'grid' ? 'grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8' : 'space-y-6'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="posts"
            >
              {filteredAndSortedPosts.map((post, index) => (
                <EnhancedBlogCard
                  key={post.id}
                  post={post}
                  index={index}
                  isDarkMode={isDarkMode}
                  viewMode={viewMode}
                  onClick={() => handlePostClick(post)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Newsletter Section */}
        <motion.section 
          className="mt-20 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className={`text-center mb-8 p-8 rounded-3xl ${
              isDarkMode ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-indigo-50/50 border border-indigo-100'
            } backdrop-blur-sm`}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Stay Updated!
              </span>
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Get the latest articles and insights delivered to your inbox
            </p>
          </motion.div>
          <NewsletterSignup />
        </motion.section>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton isDarkMode={isDarkMode} />

      {/* Newsletter Popup */}
      <NewsletterPopup isOpen={showPopup} onClose={closePopup} />
    </div>
  );
};

export default BlogListPage;
