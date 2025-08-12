import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-8">
        {/* Animated Profile Image */}
        <motion.div
          className="relative"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden relative shadow-2xl border-4 border-indigo-500/40">
            <img
              src={isDarkMode ? "/images/AI-dark.jpg" : "/images/AI-light.jpg"}
              alt="Harshal Poojari"
              className="w-full h-full object-cover"
            />
            {/* Animated Glow */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ boxShadow: isDarkMode
                ? '0 0 40px 10px rgba(99,102,241,0.4), 0 0 80px 20px rgba(139,92,246,0.2)'
                : '0 0 40px 10px rgba(99,102,241,0.2), 0 0 80px 20px rgba(139,92,246,0.1)'}}
              animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Harshal Poojari
          </span>
          <p className="text-gray-400 mt-2">Loading Portfolio...</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="w-64 mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-gray-500 text-sm mt-2">{progress}%</p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          className="flex space-x-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-indigo-500 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;