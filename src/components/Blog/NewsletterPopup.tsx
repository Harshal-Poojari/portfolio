import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import NewsletterSignup from './NewsletterSignup';

interface NewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`relative max-w-md w-full mx-auto ${
                isDarkMode ? 'bg-slate-800' : 'bg-white'
              } rounded-2xl shadow-2xl overflow-hidden`}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${
                  isDarkMode
                    ? 'hover:bg-slate-700 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className={`px-6 pt-6 pb-4 text-center ${
                isDarkMode ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50'
              }`}>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Don't Miss Out!
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Get the latest blog posts and updates delivered straight to your inbox
                </p>
              </div>

              {/* Newsletter Form */}
              <div className="p-6">
                <NewsletterSignup className="shadow-none bg-transparent" />
              </div>

              {/* Footer */}
              <div className={`px-6 pb-6 text-center ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <p className="text-xs">
                  No spam, unsubscribe anytime. We respect your privacy.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
