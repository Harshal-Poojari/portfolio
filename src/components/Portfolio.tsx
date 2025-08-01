import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ExternalLink, Github, Star, Calendar, Search, X, Tag } from 'lucide-react';
import { ThemeContext } from '../App';

export const portfolioItems = [
    {
      title: 'Indian Business Board Game',
      category: 'game',
      anchorId: 'project-indian-business-board-game',
      type: 'Unity Game',
      description: 'Strategic business simulation game featuring Indian entrepreneurship themes.',
      technologies: ['Unity', 'C#', 'AI', 'Multiplayer'],
      tags: ['Game', 'Strategy', 'Indian Culture'],
      image: '/images/Buisnessgame.jpg',
      liveUrl: '#',
      githubUrl: '#',
      featured: true,
      year: '2024',
      status: 'In Development'
    },
    {
      title: 'Personal Portfolio Website',
      category: 'web',
      anchorId: 'project-personal-portfolio-website',
      type: 'Portfolio',
      description: 'Modern portfolio website with interactive 3D elements and dynamic content.',
      technologies: ['React', 'Three.js', 'Tailwind CSS', 'GSAP'],
      tags: ['Web', 'Frontend', '3D'],
      image: '/images/Portfolio_CMS.png',
      liveUrl: '#',
      githubUrl: '#',
      featured: true,
      year: '2024',
      status: 'Live'
    },
    {
      title: 'Game Difficulty System',
      category: 'tools',
      anchorId: 'project-game-difficulty-system',
      type: 'ML System',
      description: 'Dynamic difficulty adjustment system for games that adapts to player performance.',
      technologies: ['Unity', 'C#', 'Analytics'],
      tags: ['Game Development', 'User Experience', 'Game'],
      image: '/images/game_difficulty_system.png',
      liveUrl: '#',
      githubUrl: '#',
      featured: false,
      year: '2023',
      status: 'Completed'
    },
    {
      title: 'React Performance Monitor',
      category: 'opensource',
      anchorId: 'project-react-performance-monitor',
      type: 'Developer Tool',
      description: 'Open-source tool for monitoring React application performance and optimization suggestions.',
      technologies: ['React', 'TypeScript', 'Webpack', 'Node.js'],
      tags: ['Web', 'Developer Tool', 'Open Source'],
      image: '/images/React_performace_monitor.png',
      liveUrl: '#',
      githubUrl: '#',
      featured: false,
      year: '2023',
      status: 'Maintained'
    },
    {
      title: 'E-Learning Platform',
      category: 'web',
      anchorId: 'project-e-learning-platform',
      type: 'Full-Stack App',
      description: 'Comprehensive learning management system with video streaming and progress tracking.',
      technologies: ['Next.js', 'PostgreSQL', 'AWS', 'Stripe'],
      tags: ['Web', 'Full-Stack', 'Education'],
      image: '/images/Learning_management_system.png',
      liveUrl: '#',
      githubUrl: '#',
      featured: true,
      year: '2023',
      status: 'Live'
    },
    {
      title: 'Unity Asset Store Tools',
      category: 'opensource',
      anchorId: 'project-unity-asset-store-tools',
      type: 'Unity Package',
      description: 'Collection of Unity editor tools for game developers to improve workflow efficiency.',
      technologies: ['Unity', 'C#', 'Editor Scripting'],
      tags: ['Game', 'Developer Tool', 'Open Source'],
      image: '/images/Unity_asset_store_tools.png',
      liveUrl: '#',
      githubUrl: '#',
      featured: false,
      year: '2023',
      status: 'Published'
    }
  ];

const Portfolio: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'game', label: 'Games' },
    { id: 'web', label: 'Web Apps' },
    { id: 'tools', label: 'Tools & Utilities' },
    { id: 'opensource', label: 'Open Source' }
  ];

  // Extract all unique tags
  const allTags = Array.from(new Set(portfolioItems.flatMap(item => item.tags)));

  // Filter items based on active filter, search term, and selected tags
  useEffect(() => {
    let filtered = portfolioItems;
    
    // Filter by category
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.category === activeFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term) ||
        item.technologies.some((tech: string) => tech.toLowerCase().includes(term))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item => 
        selectedTags.some(tag => item.tags.includes(tag))
      );
    }
    
    setFilteredItems(filtered);
  }, [activeFilter, searchTerm, selectedTags]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'text-green-400';
      case 'Completed': return 'text-blue-400';
      case 'In Development': return 'text-yellow-400';
      case 'Maintained': return 'text-purple-400';
      case 'Published': return 'text-indigo-400';
      default: return 'text-gray-400';
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const clearFilters = () => {
    setActiveFilter('all');
    setSearchTerm('');
    setSelectedTags([]);
  };

  return (
    <section id="portfolio" className={`py-20 px-6 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Complete Portfolio
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-8" />
          <p className={isDarkMode ? 'text-gray-400 max-w-2xl mx-auto' : 'text-gray-600 max-w-2xl mx-auto'}>
            A comprehensive showcase of my work across games, web applications, AI projects, and open-source contributions
          </p>
        </div>

        {/* Filter controls */}
        <div className="mb-12 space-y-6">
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : isDarkMode 
                      ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 hover:text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="w-4 h-4" />
                <span>{filter.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Search and additional filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search */}
            <div className={`relative flex-1 max-w-md ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                } border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200`}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Tag filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className={isDarkMode ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>
                Filter by tag:
              </span>
              {allTags.slice(0, 5).map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-500 text-white'
                      : isDarkMode
                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                </button>
              ))}
              {(activeFilter !== 'all' || searchTerm || selectedTags.length > 0) && (
                <button
                  onClick={clearFilters}
                  className={`text-xs px-3 py-1 rounded-full ${
                    isDarkMode 
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-8 text-center">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Showing {filteredItems.length} of {portfolioItems.length} projects
          </p>
        </div>

        {/* Portfolio grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.title}
                id={item.anchorId}
                className={`group relative ${
                  isDarkMode 
                    ? 'bg-slate-900/50 border-slate-700/50 hover:border-indigo-500/50' 
                    : 'bg-white border-gray-200 hover:border-indigo-400 shadow-sm'
                } backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300 ${
                  item.featured 
                    ? isDarkMode ? 'border-indigo-500/50 hover:border-indigo-400' : 'border-indigo-300 hover:border-indigo-500'
                    : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                {item.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500 text-yellow-900 text-xs font-semibold rounded-full">
                      <Star className="w-3 h-3" />
                      <span>Featured</span>
                    </div>
                  </div>
                )}

                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  {/* Project image */}
                  <div className="aspect-video bg-gradient-to-br from-indigo-900/30 to-purple-900/30 flex items-center justify-center relative overflow-hidden group-hover:opacity-80 transition-opacity duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-90 rounded-xl shadow-md border-2 border-indigo-200 dark:border-slate-700"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    {/* Status indicator */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className={`text-xs font-semibold ${getStatusColor(item.status)}`}>{item.status}</span>
                    </div>
                    {/* Quick action overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                      <div className="flex space-x-3">
                        <motion.a
                          href={item.liveUrl}
                          className="p-3 bg-indigo-600/90 hover:bg-indigo-700 text-white rounded-full"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </motion.a>
                        <motion.a
                          href={item.githubUrl}
                          className="p-3 bg-gray-800/90 hover:bg-gray-900 text-white rounded-full"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Github className="w-5 h-5" />
                        </motion.a>
                      </div>
                    </div>
                  </div>

                  {/* Project info */}
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={isDarkMode ? 'text-indigo-400 text-sm font-medium' : 'text-indigo-600 text-sm font-medium'}>
                          {item.type}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-500 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{item.year}</span>
                        </div>
                      </div>
                      <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white group-hover:text-indigo-400' : 'text-gray-900 group-hover:text-indigo-600'} transition-colors duration-200`}>
                        {item.title}
                      </h3>
                      <p className={isDarkMode ? 'text-gray-300 text-sm leading-relaxed' : 'text-gray-600 text-sm leading-relaxed'}>
                        {item.description}
                      </p>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className={`px-2 py-1 ${
                            isDarkMode 
                              ? 'bg-slate-700/50 text-indigo-300' 
                              : 'bg-gray-100 text-indigo-700'
                          } text-xs rounded-md`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag: string, tagIndex: number) => (
                        <button
                          key={tagIndex}
                          onClick={() => handleTagClick(tag)}
                          className={`flex items-center space-x-1 px-2 py-0.5 text-xs rounded-full ${
                            selectedTags.includes(tag)
                              ? 'bg-indigo-500 text-white'
                              : isDarkMode
                                ? 'bg-slate-700/70 text-gray-300 hover:bg-slate-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Tag className="w-2 h-2" />
                          <span>{tag}</span>
                        </button>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex space-x-3 pt-2">
                      <a
                        href={item.liveUrl}
                        className={`flex items-center space-x-1 px-3 py-2 ${
                          isDarkMode
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        } text-sm rounded-md transition-colors duration-200`}
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </a>
                      <a
                        href={item.githubUrl}
                        className={`flex items-center space-x-1 px-3 py-2 ${
                          isDarkMode
                            ? 'border border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-indigo-400'
                            : 'border border-gray-300 hover:border-indigo-400 text-gray-700 hover:text-indigo-600'
                        } text-sm rounded-md transition-colors duration-200`}
                      >
                        <Github className="w-3 h-3" />
                        <span>Code</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className={`text-center py-20 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-xl font-medium mb-2">No projects found</p>
            <p>Try adjusting your filters or search term</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Load more button */}
        {filteredItems.length > 0 && filteredItems.length < portfolioItems.length && (
          <div className="text-center mt-12">
            <motion.button 
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-white"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter('all')}
            >
              View All Projects
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;