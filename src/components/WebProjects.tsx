import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Zap, Smartphone, Globe, Database } from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';
import { useTheme } from '../context/ThemeContext';
import { CometCard } from './ui/comet-card';

// Tech icon component with proper typing
const TechIcon: React.FC<{ name: string }> = ({ name }) => {
  const iconMap: Record<string, React.ReactElement> = {
    'React': <Globe className="w-4 h-4" />,
    'Node.js': <Globe className="w-4 h-4" />,
    'MongoDB': <Database className="w-4 h-4" />,
    'Stripe': <Zap className="w-4 h-4" />,
    'Vue.js': <Globe className="w-4 h-4" />,
    'Firebase': <Zap className="w-4 h-4" />,
    'Next.js': <Globe className="w-4 h-4" />,
    'Prisma': <Database className="w-4 h-4" />,
    'PostgreSQL': <Database className="w-4 h-4" />,
    'Express.js': <Globe className="w-4 h-4" />,
    'MySQL': <Database className="w-4 h-4" />,
    'AWS': <Globe className="w-4 h-4" />,
    'Chart.js': <Globe className="w-4 h-4" />,
    'Django': <Globe className="w-4 h-4" />,
    'Redis': <Database className="w-4 h-4" />,
    'Tailwind CSS': <Globe className="w-4 h-4" />,
  };

  return iconMap[name] || <Globe className="w-4 h-4" />;
};

// Placeholder images for projects
const placeholderImages = [
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1415&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1415&q=80'
];

const WebProjects: React.FC = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useScrollAnimation();
  const projectsRef = useStaggerAnimation('.project-card');

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with modern UI/UX, payment integration, and admin dashboard.',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      features: ['Responsive Design', 'Payment Gateway', 'Admin Panel'],
      image: placeholderImages[0],
      liveUrl: '#',
      githubUrl: '#',
      status: 'Live'
    },
    {
      title: 'Task Management App',
      description: 'Collaborative task management application with real-time updates and team collaboration features.',
      tech: ['Vue.js', 'Firebase', 'Tailwind CSS'],
      features: ['Real-time Sync', 'Team Collaboration', 'Dark Mode'],
      image: placeholderImages[1],
      liveUrl: '#',
      githubUrl: '#',
      status: 'Live'
    },
    {
      title: 'Content Management System',
      description: 'Advanced content generation and management platform with multiple templates and customization options.',
      tech: ['Next.js', 'Node.js', 'Prisma', 'PostgreSQL'],
      features: ['Template System', 'User Analytics', 'Content Scheduling'],
      image: placeholderImages[2],
      liveUrl: '#',
      githubUrl: '#',
      status: 'Live'
    },
    {
      title: 'Portfolio CMS',
      description: 'Content management system specifically designed for developers and creatives.',
      tech: ['React', 'Express.js', 'MySQL', 'AWS'],
      features: ['Custom CMS', 'SEO Optimized', 'Cloud Hosting'],
      image: placeholderImages[3],
      liveUrl: '#',
      githubUrl: '#',
      status: 'Live'
    },
    {
      title: 'Crypto Tracker',
      description: 'Real-time cryptocurrency tracking dashboard with portfolio management.',
      tech: ['React', 'Chart.js', 'CoinGecko API'],
      features: ['Live Data', 'Portfolio Tracking', 'Price Alerts'],
      image: placeholderImages[4],
      liveUrl: '#',
      githubUrl: '#',
      status: 'Live'
    },
    {
      title: 'Learning Management System',
      description: 'Comprehensive LMS with course creation, progress tracking, and interactive features.',
      tech: ['React', 'Django', 'PostgreSQL', 'Redis'],
      features: ['Course Creation', 'Progress Tracking', 'Interactive Quizzes'],
      image: placeholderImages[5],
      liveUrl: '#',
      githubUrl: '#',
      status: 'Development'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-green-500 text-green-900';
      case 'Beta': return 'bg-yellow-500 text-yellow-900';
      case 'Development': return 'bg-blue-500 text-blue-900';
      default: return 'bg-gray-500 text-gray-900';
    }
  };

  const techIcons: { [key: string]: JSX.Element } = {
    'React': <Globe className="w-4 h-4" />,
    'Vue.js': <Globe className="w-4 h-4" />,
    'Next.js': <Zap className="w-4 h-4" />,
    'Node.js': <Database className="w-4 h-4" />,
    'Express.js': <Database className="w-4 h-4" />,
    'Django': <Database className="w-4 h-4" />,
    'MongoDB': <Database className="w-4 h-4" />,
    'PostgreSQL': <Database className="w-4 h-4" />,
    'MySQL': <Database className="w-4 h-4" />,
  };

  return (
    <section 
      id="web" 
      className={`relative py-20 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
      ref={sectionRef}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`} />
      </div>
      
      <div className="relative container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Here are some of my recent projects. Each one was built with a focus on performance, accessibility, and user experience.
          </motion.p>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          ref={projectsRef}
        >
          {projects.map((project, index) => (
            <CometCard 
              key={index}
              className="h-full"
              rotateDepth={10}
              translateDepth={15}
            >
              <div className={`h-full flex flex-col ${
                isDarkMode 
                  ? 'bg-slate-900/50 border-slate-700/50' 
                  : 'bg-white border-gray-200'
              } backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-400/50`}>
                {/* Project Image */}
                <div className={`aspect-video ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/20' 
                    : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
                } flex items-center justify-center relative overflow-hidden group-hover:shadow-inner group-hover:shadow-indigo-500/5 transition-all duration-500`}>
                  <motion.div 
                    className="relative w-full h-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: index * 0.12, type: 'spring', stiffness: 120, damping: 18 }}
                  >
                    <div className="relative w-full h-64 overflow-hidden rounded-xl shadow-lg group">
                      <div className="absolute inset-0">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="text-center p-6">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Globe className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                              {project.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Click to view details
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Status badge */}
                    <div className="absolute top-3 right-3 z-20">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Project Info */}
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {project.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className={`flex items-center space-x-1 px-2 py-1 ${
                          isDarkMode 
                            ? 'bg-slate-700/50 text-indigo-300' 
                            : 'bg-indigo-50 text-indigo-700'
                        } text-xs rounded-md`}
                      >
                        <TechIcon name={tech} />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>

                  {/* Features */}
                  <div>
                    <ul className="space-y-1">
                      {project.features.map((feature, featureIndex) => (
                        <li 
                          key={featureIndex} 
                          className={`flex items-center text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          <div className="w-1 h-1 bg-indigo-400 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-3 pt-2">
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Live</span>
                    </motion.a>
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-1 px-3 py-2 border ${
                        isDarkMode 
                          ? 'border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-indigo-400' 
                          : 'border-gray-300 hover:border-indigo-400 text-gray-600 hover:text-indigo-600'
                      } text-sm rounded-md transition-colors duration-200`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="w-3 h-3" />
                      <span>Code</span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </CometCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WebProjects;