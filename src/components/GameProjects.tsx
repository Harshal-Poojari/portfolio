import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Download, Star, Users, Trophy } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTheme } from '../context/ThemeContext';

const GameProjects: React.FC = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useScrollAnimation();

  const featuredGame = {
    title: 'Indian Business Board Game',
    subtitle: 'Strategic tile-based gameplay with dynamic opponents',
    description: 'An immersive business strategy game celebrating Indian entrepreneurship and culture. Features intelligent computer opponents, dynamic market conditions, and authentic Indian business scenarios.',
    features: [
      'Dynamic strategic opponents',
      'Dynamic tile-based gameplay',
      'Indian cultural themes',
      'Multiplayer support',
      'Real-time market simulation'
    ],
    stats: [
      { icon: <Users className="w-5 h-5" />, label: 'Players', value: '2-6' },
      { icon: <Star className="w-5 h-5" />, label: 'Rating', value: '4.8/5' },
      { icon: <Trophy className="w-5 h-5" />, label: 'Awards', value: '3' }
    ],
    image: '/api/placeholder/600/400',
    status: 'Coming Soon'
  };

  return (
    <section id="games" className={`py-20 px-6 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`} ref={sectionRef}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Game Projects
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-8" />
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Immersive gaming experiences crafted with passion and innovation
          </p>
        </div>

        {/* Featured Game */}
        <motion.div 
          className={`relative rounded-2xl overflow-hidden ${
            isDarkMode 
              ? 'bg-slate-800/50 border-slate-700' 
              : 'bg-gray-50 border-gray-200 shadow-sm'
          } border`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Game content */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Game Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {featuredGame.title}
                  </h3>
                  <p className={`text-lg ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-medium`}>
                    {featuredGame.subtitle}
                  </p>
                </div>
                
                <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {featuredGame.description}
                </p>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Key Features
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {featuredGame.features.map((feature, index) => (
                      <li 
                        key={index} 
                        className={`flex items-center space-x-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {featuredGame.stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl ${
                        isDarkMode 
                          ? 'bg-slate-700/50' 
                          : 'bg-indigo-50'
                      }`}>
                        {stat.icon}
                      </div>
                      <div className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stat.value}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Demo</span>
                  </motion.button>
                  
                  <motion.button
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold ${
                      isDarkMode 
                        ? 'border border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-indigo-400' 
                        : 'border border-gray-300 hover:border-indigo-400 text-gray-700 hover:text-indigo-600'
                    } transition-colors duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>View Details</span>
                  </motion.button>
                </div>
              </div>

              {/* Game Preview */}
              <div className="lg:w-1/2">
                <div className={`aspect-video rounded-xl overflow-hidden shadow-lg border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-700/50 border-slate-700' 
                    : 'bg-indigo-50 border-indigo-100'
                } flex items-center justify-center relative group`}> 
                  <img
                    src="/images/Buisnessgame.jpg"
                    alt="Indian Business Board Game Preview"
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-90"
                    style={{ borderRadius: '0.75rem' }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-3 py-1 rounded-full shadow-md pointer-events-none">
                    Game Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional games section placeholder */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 italic">More exciting games coming soon...</p>
        </div>
      </div>
    </section>
  );
};

export default GameProjects;