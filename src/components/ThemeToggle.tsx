import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../App';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.button
      className={`relative w-14 h-7 rounded-full p-1 transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
      }`}
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className={`w-5 h-5 rounded-full shadow-md flex items-center justify-center ${
          isDarkMode ? 'bg-indigo-400' : 'bg-white'
        }`}
        animate={{ x: isDarkMode ? 0 : 28 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDarkMode ? (
          <Moon className="w-3 h-3 text-white" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;