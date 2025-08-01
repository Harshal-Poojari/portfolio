import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Zap, Smartphone, Globe, Database } from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';
import { ThemeContext } from '../App';

const WebProjects: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const sectionRef = useScrollAnimation();
  const projectsRef = useStaggerAnimation('.project-card');

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with modern UI/UX, payment integration, and admin dashboard.',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      features: ['Responsive Design', 'Payment Gateway', 'Admin Panel'],
      image: '/images/ecommerce_system.jpg',
      liveUrl: '#',
      githubUrl: '#',
      status: 'Live'
    },
    {
      title: 'Task Management App',
      description: 'Collaborative task management application with real-time updates and team collaboration features.',
      tech: ['Vue.js', 'Firebase', 'Tailwind CSS'],
      features: ['Real-time Sync', 'Team Collaboration', 'Dark Mode'],
      image: '/images/task_management_app.png',
      liveUrl: '#',
      githubUrl: '#',
      status: 'Live'
    },
    {
      title: 'Content Management System',
      description: 'Advanced content generation and management platform with multiple templates and customization options.',
      tech: ['Next.js', 'Node.js', 'Prisma', 'PostgreSQL'],
      features: ['Template System', 'User Analytics', 'Content Scheduling'],
      image: '/images/content_management_system.png',
      liveUrl: '#',
      githubUrl: '#',
      status: 'Live'
    },
    {
      title: 'Portfolio CMS',
      description: 'Content management system specifically designed for developers and creatives.',
      tech: ['React', 'Express.js', 'MySQL', 'AWS'],
      features: ['Custom CMS', 'SEO Optimized', 'Cloud Hosting'],
      image: '/images/Portfolio_CMS.png',
      liveUrl: '#',
      githubUrl: '#',
      status: 'Live'
    },
    {
      title: 'Crypto Tracker',
      description: 'Real-time cryptocurrency tracking dashboard with portfolio management.',
      tech: ['React', 'Chart.js', 'CoinGecko API'],
      features: ['Live Data', 'Portfolio Tracking', 'Price Alerts'],
      image: '/images/crypto_tracker.png',
      liveUrl: '#',
      githubUrl: '#',
      status: 'Live'
    },
    {
      title: 'Learning Management System',
      description: 'Comprehensive LMS with course creation, progress tracking, and interactive features.',
      tech: ['React', 'Django', 'PostgreSQL', 'Redis'],
      features: ['Course Creation', 'Progress Tracking', 'Interactive Quizzes'],
      image: '/images/Learning_management_system.png',
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
    <section id="web" className={`py-20 px-6 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`} ref={sectionRef}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Web Projects
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-8" />
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Modern web applications built with cutting-edge technologies and best practices
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" ref={projectsRef}>
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className={`project-card group relative ${
                isDarkMode 
                  ? 'bg-slate-900/50 border-slate-700/50' 
                  : 'bg-white border-gray-200'
              } backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-400/50`}
              initial={{ opacity: 0, scale: 0.95, y: 30, rotateX: 0, rotateY: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0, rotateY: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1, 
                type: 'spring', 
                stiffness: 120, 
                damping: 18,
                scale: { type: 'spring', stiffness: 300, damping: 15 }
              }}
              whileHover={{ 
                scale: 1.03,
                y: -4,
                boxShadow: isDarkMode 
                  ? "0 20px 40px -10px rgba(99, 102, 241, 0.15)" 
                  : "0 20px 40px -10px rgba(99, 102, 241, 0.1)",
                borderColor: isDarkMode ? '#818CF8' : '#818CF8',
                transition: { 
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { 
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1]
                } 
              }}
              onHoverStart={e => {}}
              onHoverEnd={e => {}}
              style={{
                transformStyle: 'preserve-3d',
                transformPerspective: 1000,
              }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-pink-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:duration-300" />
              <div className="relative">
                {/* Project Image */}
                <motion.div
                  className={`aspect-video ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/20' 
                      : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
                  } flex items-center justify-center relative overflow-hidden group-hover:shadow-inner group-hover:shadow-indigo-500/5 transition-all duration-500`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: index * 0.12, type: 'spring', stiffness: 120, damping: 18 }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover object-center rounded-xl shadow-md border-2 border-indigo-200 dark:border-slate-700 transition-transform duration-700 group-hover:scale-105"
                    style={{ objectFit: 'cover', objectPosition: 'center', imageRendering: 'auto' }}
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  {/* Status badge */}
                  <div className="absolute top-3 right-3 z-20">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>{project.status}</span>
                  </div>
                </motion.div>

                {/* Project Info */}
                <div className="p-6 space-y-4 transform group-hover:-translate-y-1 transition-transform duration-500">
                  <div>
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
                        {techIcons[tech] || <Globe className="w-3 h-3" />}
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>

                  {/* Features */}
                  <div>
                    <ul className="space-y-1">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className={`flex items-center text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
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
                      className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Live</span>
                    </motion.a>
                    <motion.a
                      href={project.githubUrl}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WebProjects;