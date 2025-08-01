import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { ThemeContext } from '../App';

const Footer: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/harshalpoojari',
      icon: <Github className="w-5 h-5" />
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/harshalpoojari',
      icon: <Linkedin className="w-5 h-5" />
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/harshalpoojari',
      icon: <Twitter className="w-5 h-5" />
    },
    {
      name: 'Email',
      url: 'mailto:contact@harshalpoojari.com',
      icon: <Mail className="w-5 h-5" />
    }
  ];

  const quickLinks = [
    { name: 'About Me', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    'Game Development',
    'Web Development',
    'System Architecture',
    'Technical Consulting',
    'Code Reviews',
    'Performance Optimization'
  ];

  const technologies = [
    'Unity',
    'React',
    'Node.js',
    'TypeScript',
    'Three.js',
    'Tailwind CSS'
  ];

  return (
    <>
      <div className="relative">
        {/* Gradient Separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
        <div className="absolute top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20" />
        
        {/* Fun Interactive Section */}
        <div className={`py-16 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`rounded-2xl ${
              isDarkMode 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-gray-50 border-gray-200'
              } border p-8 relative overflow-hidden`}
            >
              {/* Background Animation */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <motion.div
                  className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px]"
                  animate={{
                    backgroundPosition: ["0px 0px", "250px 250px"],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>

              <div className="relative z-10">
                <div className="text-center max-w-3xl mx-auto space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Let's Create Something Amazing Together! 🚀
                    </h2>
                    <p className={`text-lg ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Have a project in mind? I'm always excited to collaborate on new ideas and challenges.
                    </p>
                  </motion.div>

                  <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <motion.a
                      href="#contact"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get in Touch
                    </motion.a>
                    <motion.a
                      href="#portfolio"
                      className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold ${
                        isDarkMode 
                          ? 'bg-slate-700 text-white hover:bg-slate-600' 
                          : 'bg-white text-gray-900 hover:bg-gray-100'
                      } border border-transparent hover:border-indigo-500 transition-all duration-300`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View My Work
                    </motion.a>
                  </div>

                  {/* Fun Interactive Elements */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                    {[
                      { icon: '🎮', label: 'Games Created', value: '15+' },
                      { icon: '💻', label: 'Web Projects', value: '30+' },
                      { icon: '🌟', label: 'Happy Clients', value: '50+' },
                      { icon: '🏆', label: 'Awards', value: '10+' }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        className={`p-4 rounded-xl ${
                          isDarkMode 
                            ? 'bg-slate-700/50' 
                            : 'bg-white'
                        } text-center`}
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <div className={`text-2xl font-bold mb-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {stat.value}
                        </div>
                        <div className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className={`py-12 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* About Section */}
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">H</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      Harshal Poojari
                    </span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Game Developer & Web Engineer
                    </span>
                  </div>
                </motion.div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Creating immersive digital experiences through innovative game development and modern web solutions.
                </p>
                <div className="flex items-center space-x-4">
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg ${
                        isDarkMode 
                          ? 'bg-slate-800 text-gray-300 hover:text-white hover:bg-slate-700' 
                          : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                      } transition-all duration-200`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={link.name}
                    >
                      {link.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <motion.li key={link.name}>
                      <a
                        href={link.href}
                        className={`inline-flex items-center space-x-1 text-sm ${
                          isDarkMode 
                            ? 'text-gray-400 hover:text-indigo-400' 
                            : 'text-gray-600 hover:text-indigo-600'
                        } transition-colors duration-200`}
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Services
                </h3>
                <ul className="space-y-2">
                  {services.map((service) => (
                    <li 
                      key={service} 
                      className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`px-3 py-1 text-xs rounded-full ${
                        isDarkMode 
                          ? 'bg-slate-800 text-indigo-400 border border-slate-700' 
                          : 'bg-gray-100 text-indigo-600 border border-gray-200'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className={`mt-12 pt-8 border-t ${
              isDarkMode ? 'border-slate-800' : 'border-gray-200'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    © {currentYear} Crafted with passion by
                  </span>
                  <span className="font-semibold text-indigo-500">Harshal Poojari</span>
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex items-center space-x-4">
                  <a 
                    href="#" 
                    className={`text-sm ${
                      isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Privacy Policy
                  </a>
                  <a 
                    href="#" 
                    className={`text-sm ${
                      isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;