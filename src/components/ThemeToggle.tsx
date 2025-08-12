import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'floating';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className, 
  size = 'md', 
  variant = 'default' 
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-10 h-6',
    md: 'w-14 h-7',
    lg: 'w-16 h-8',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const switchPositions = {
    sm: { light: 0, dark: 16 },
    md: { light: 0, dark: 28 },
    lg: { light: 0, dark: 32 },
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return cn(
          "bg-transparent border-2",
          isDarkMode 
            ? "border-gray-600 text-gray-300 hover:text-white" 
            : "border-gray-300 text-gray-600 hover:text-gray-900"
        );
      case 'floating':
        return cn(
          "bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-lg",
          "border border-gray-200/50 dark:border-gray-600/50",
          "hover:bg-gray-50 dark:hover:bg-gray-700"
        );
      default:
        return cn(
          "transition-colors duration-300",
          isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
        );
    }
  };

  const getIconClasses = () => {
    switch (variant) {
      case 'minimal':
        return cn(
          "rounded-full shadow-sm",
          isDarkMode ? "bg-indigo-500" : "bg-white"
        );
      case 'floating':
        return cn(
          "rounded-full shadow-md",
          isDarkMode ? "bg-indigo-400" : "bg-white"
        );
      default:
        return cn(
          "rounded-full shadow-md",
          isDarkMode ? "bg-indigo-400" : "bg-white"
        );
    }
  };

  return (
    <motion.button
      className={cn(
        "relative rounded-full p-1 transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        sizeClasses[size],
        getVariantClasses(),
        isDarkMode 
          ? "focus:ring-slate-500" 
          : "focus:ring-gray-500",
        className
      )}
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className={cn(
          "flex items-center justify-center transition-all duration-300",
          getIconClasses()
        )}
        style={{
          width: size === 'sm' ? '20px' : size === 'md' ? '20px' : '24px',
          height: size === 'sm' ? '20px' : size === 'md' ? '20px' : '24px',
        }}
        animate={{ 
          x: isDarkMode ? switchPositions[size].dark : switchPositions[size].light 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30 
        }}
      >
        <AnimatePresence mode="wait">
          {isDarkMode ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-center justify-center",
                iconSizes[size]
              )}
            >
              <Moon className={cn(
                iconSizes[size],
                variant === 'minimal' ? "text-white" : "text-white"
              )} />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-center justify-center",
                iconSizes[size]
              )}
            >
              <Sun className={cn(
                iconSizes[size],
                variant === 'minimal' ? "text-gray-900" : "text-yellow-500"
              )} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-full bg-indigo-500/20"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

export default ThemeToggle;