import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Menu, X, ChevronDown, Home,
  User, Gamepad, Globe, BookOpen,
  Award, Briefcase, MessageSquare, Edit
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { ThemeContext } from '../App';
import { useRouter } from '../context/RouterContext';

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  subItems?: NavItem[];
}

const Header: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { navigateTo } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // framer-motion scrollY and transforms for header background and border
  const { scrollY } = useScroll();
  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    [
      isDarkMode ? 'rgba(17, 24, 39, 0)' : 'rgba(255, 255, 255, 0)',
      isDarkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    ]
  );

  const headerBorder = useTransform(
    scrollY,
    [0, 50],
    [
      isDarkMode ? 'rgba(55, 65, 81, 0)' : 'rgba(209, 213, 219, 0)',
      isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(209, 213, 219, 0.5)',
    ]
  );

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // Active nav highlight on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>('section[id]');
      const scrollPosition = window.scrollY + 120;
      
      let currentSection = 'home';
      
      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.clientHeight;
        const bottom = top + height;
        
        if (scrollPosition >= top && scrollPosition < bottom) {
          currentSection = section.getAttribute('id') || 'home';
        }
      });
      
      setActiveSection(currentSection);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { id: 'home', href: '#home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'about', href: '#about', label: 'About', icon: <User className="w-4 h-4" /> },
    {
      id: 'projects',
      href: '#projects',
      label: 'Projects',
      icon: <Briefcase className="w-4 h-4" />,
      subItems: [
        { id: 'games', href: '#games', label: 'Game Development', icon: <Gamepad className="w-4 h-4" /> },
        { id: 'web', href: '#web', label: 'Web Applications', icon: <Globe className="w-4 h-4" /> },
      ],
    },
    {
      id: 'blog',
      href: '#blog',
      label: 'Blog',
      icon: <BookOpen className="w-4 h-4" />,
      subItems: [
        { id: 'blog-section', href: '#blog', label: 'Blog Section', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'all-posts', href: 'blog-list', label: 'All Posts', icon: <Globe className="w-4 h-4" /> },
      ],
    },
    { id: 'certifications', href: '#certifications', label: 'Certifications', icon: <Award className="w-4 h-4" /> },
    { id: 'contact', href: '#contact', label: 'Contact', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  // ✅ SIMPLIFIED: Navigation handler (removed blog-admin support)
  const handleNavClick = (href: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    setIsMenuOpen(false);
    
    // Handle special blog routes
    if (href === 'blog-list') {
      navigateTo('blog-list');
      return;
    }

    // Handle studio route
    if (href === 'studio') {
      navigateTo('studio');
      return;
    }
    
    // Handle regular section navigation
    const sectionId = href.replace('#', '');
    
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({ 
          top, 
          behavior: 'smooth' 
        });
        
        setActiveSection(sectionId);
      } else {
        console.warn(`Section with id "${sectionId}" not found`);
      }
    }, 150);
  };

  // Helper function to check if a nav item or its subitems are active
  const isNavItemActive = (item: NavItem) => {
    if (activeSection === item.id) return true;
    if (item.subItems) {
      return item.subItems.some(subItem => activeSection === subItem.id);
    }
    return false;
  };

  // ✅ ONLY: Studio access handler (removed admin handler)
  const handleStudioAccess = () => {
    setIsMenuOpen(false);
    navigateTo('studio');
  };

  return (
    <motion.header
      style={{
        backgroundColor: headerBackground,
        borderBottom: `1px solid ${headerBorder}`,
      }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
    >
      <nav className="container mx-auto px-3 sm:px-4 md:px-6 py-2 flex flex-wrap items-center justify-between min-h-[60px]">
        {/* Logo + Name */}
        <motion.a
          href="#home"
          className="flex items-center group transition-all duration-200 min-w-0 flex-shrink-0"
          onClick={e => handleNavClick('#home', e)}
          initial={false}
          whileHover={{ scale: 1.045, rotate: -0.5 }}
        >
          <motion.img
            src="/images/logo.png"
            alt="Logo"
            className="flex-none object-contain rounded-full shadow-sm"
            style={{
              width: 'clamp(1.6rem, 4.5vw, 2.2rem)',
              height: 'clamp(1.6rem, 4.5vw, 2.2rem)',
              marginRight: 'clamp(0.4rem, 0.8vw, 1rem)',
              minWidth: 24,
              minHeight: 24,
              maxWidth: 40,
              maxHeight: 40,
            }}
            whileHover={{ rotate: 6, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 240, duration: 0.48 }}
            draggable={false}
          />
          <span className="flex flex-col text-left min-w-0">
            <motion.span
              className="font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent truncate"
              style={{
                fontSize: 'clamp(0.9rem, 1.8vw, 1.15rem)',
              }}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18, duration: 0.34, type: 'spring', stiffness: 200 }}
            >
              Harshal Poojari
            </motion.span>
            <motion.span
              className={`font-medium truncate tracking-wide mt-[-2px] ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              } italic`}
              style={{
                fontSize: 'clamp(0.75rem, 1.6vw, 0.9rem)',
              }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 0.95, x: 0 }}
              transition={{ delay: 0.26, duration: 0.30, type: 'tween' }}
            >
              Game Developer & Web Engineer
            </motion.span>
          </span>
        </motion.a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center space-x-4 flex-grow justify-end">
          <div
            className={`p-1.5 rounded-xl ${
              isDarkMode ? 'bg-slate-800/70' : 'bg-gray-100/70'
            } backdrop-blur-sm border ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'}`}
          >
            <ul className="flex items-center space-x-1">
              {navItems.map(item => (
                <motion.li
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.a
                    href={item.href}
                    onClick={e => handleNavClick(item.href, e)}
                    className={`relative flex items-center px-4 py-2 rounded-lg text-[1rem] font-medium transition ${
                      isNavItemActive(item) || hoveredItem === item.id
                        ? isDarkMode
                          ? 'text-white'
                          : 'text-gray-900'
                        : isDarkMode
                        ? 'text-gray-300'
                        : 'text-gray-600'
                    } hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10`}
                    whileHover={{ scale: 1.04 }}
                  >
                    <span className="flex items-center space-x-2">
                      {item.icon}
                      <span>{item.label}</span>
                      {item.subItems && (
                        <ChevronDown
                          className={`w-4 h-4 ml-1 transition-transform ${
                            hoveredItem === item.id ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </span>
                    {(isNavItemActive(item) || hoveredItem === item.id) && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
                        layoutId="navBackground"
                        initial={false}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.a>

                  {/* Dropdown for desktop */}
                  {item.subItems && hoveredItem === item.id && (
                    <motion.div
                      className={`absolute top-full left-0 mt-1 py-2 w-52 rounded-lg shadow-lg z-10 ${
                        isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {item.subItems.map(subItem => (
                        <motion.a
                          key={subItem.id}
                          href={subItem.href}
                          onClick={e => handleNavClick(subItem.href, e)}
                          className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                            activeSection === subItem.id
                              ? isDarkMode
                                ? 'bg-indigo-600/20 text-white'
                                : 'bg-indigo-50 text-indigo-900'
                              : isDarkMode
                              ? 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                          }`}
                          whileHover={{ x: 4 }}
                        >
                          {subItem.icon}
                          <span className="ml-2">{subItem.label}</span>
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ✅ ONLY: Studio Access Button (Removed Admin Button) */}
          {process.env.NODE_ENV === 'development' && (
            <motion.button
              onClick={handleStudioAccess}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isDarkMode
                  ? 'bg-green-600/20 text-green-300 hover:bg-green-600/30 border border-green-500/30'
                  : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Sanity Studio"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden xl:inline">Studio</span>
            </motion.button>
          )}

          <ThemeToggle />
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center space-x-1 lg:hidden">
          {/* ✅ ONLY: Mobile Studio Button (Removed Admin Button) */}
          {process.env.NODE_ENV === 'development' && (
            <motion.button
              onClick={handleStudioAccess}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-green-600/20 text-green-300 hover:bg-green-600/30'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Sanity Studio"
            >
              <Edit className="w-5 h-5" />
            </motion.button>
          )}
          
          <ThemeToggle />
          <button
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className={`rounded-lg p-2 text-xl z-50 transition ${
              isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setIsMenuOpen(v => !v)}
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            className={`fixed inset-0 z-[995] bg-black/70`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}
            onClick={e => {
              if (e.target === e.currentTarget) setIsMenuOpen(false);
            }}
          >
            <motion.div
              className={`absolute left-1/2 top-4 -translate-x-1/2 bg-white dark:bg-slate-900 rounded-xl shadow-xl w-[92vw] max-w-[20rem] max-h-[85vh] px-4 py-5 border border-gray-200 dark:border-slate-700 flex flex-col`}
              initial={{ y: -25, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -18, scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.22, bounce: 0.14 }}
            >
              {/* Mobile menu heading/logo */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="w-9 h-9 object-contain drop-shadow-md rounded-full"
                  draggable={false}
                />
                <span className="flex flex-col text-left">
                  <span className="font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent text-[1.18rem] leading-6 whitespace-nowrap truncate max-w-[calc(95vw-60px)]">
                    Harshal Poojari
                  </span>
                  <span className={`text-xs mt-[-2px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Game Developer & Web Engineer
                  </span>
                </span>
              </div>
              
              {/* Navigation links */}
              <ul className="flex flex-col gap-1.5 overflow-y-auto py-1 -mx-2 px-2">
                {navItems.map(item => (
                  <React.Fragment key={item.id}>
                    <motion.a
                      href={item.href}
                      onClick={e => handleNavClick(item.href, e)}
                      className={`flex items-center w-full px-3 py-2.5 text-[0.95rem] rounded-lg transition-all duration-200 ${
                        isNavItemActive(item)
                          ? isDarkMode
                            ? 'bg-indigo-600/20 text-white'
                            : 'bg-indigo-50 text-indigo-900'
                          : isDarkMode
                          ? 'text-gray-300 hover:bg-slate-700/40 hover:text-white'
                          : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.label}</span>
                      {item.subItems && <ChevronDown className="w-4 h-4 ml-auto" />}
                    </motion.a>
                    {item.subItems && (
                      <ul className="pl-6 pb-2 max-h-48 overflow-y-auto space-y-1 mt-1">
                        {item.subItems.map(subItem => (
                          <motion.a
                            key={subItem.id}
                            href={subItem.href}
                            onClick={e => handleNavClick(subItem.href, e)}
                            className={`flex items-center px-3 py-2 rounded-lg text-[0.9rem] transition ${
                              activeSection === subItem.id
                                ? isDarkMode
                                  ? 'bg-indigo-600/20 text-white'
                                  : 'bg-indigo-50 text-indigo-900'
                                : isDarkMode
                                ? 'text-gray-300 hover:bg-slate-700/40 hover:text-white'
                                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                            }`}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="mr-2">{subItem.icon}</span>
                            {subItem.label}
                          </motion.a>
                        ))}
                      </ul>
                    )}
                  </React.Fragment>
                ))}

                {/* ✅ ONLY: Mobile Studio Access (Removed Admin) */}
                {process.env.NODE_ENV === 'development' && (
                  <motion.button
                    onClick={handleStudioAccess}
                    className={`flex items-center w-full px-3 py-2.5 text-[0.95rem] rounded-lg transition-all duration-200 mt-2 border-t pt-4 ${
                      isDarkMode
                        ? 'text-green-300 hover:bg-green-600/20 border-slate-700'
                        : 'text-green-700 hover:bg-green-50 border-gray-200'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    <span>Studio</span>
                    <span className="ml-auto text-xs opacity-60">(CMS)</span>
                  </motion.button>
                )}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
