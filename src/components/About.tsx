import React, { useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, Gamepad2, Cpu, Zap, Terminal, GitBranch, Heart, 
  Sparkles, Rocket, Brain, Palette, Users, MessageCircle,
  ChevronRight, Star, Lightbulb, Compass, Code2, 
  Gamepad, Laptop, Braces, Terminal as TerminalIcon, Box, Server
} from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';
import { ThemeContext } from '../App';

const About: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const sectionRef = useScrollAnimation();
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  
  // Typing Game States
  const [gameActive, setGameActive] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wordHistory, setWordHistory] = useState<Array<{ word: string; correct: boolean }>>([]);
  const [highScore, setHighScore] = useState(0);
  const [theme, setTheme] = useState<'tech' | 'quotes' | 'facts'>('tech');
  const inputRef = useRef<HTMLInputElement>(null);

  // Add these new states
  const [duration, setDuration] = useState<30 | 60 | 120>(60);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);

  // Word Lists
  const wordLists = {
    tech: [
      'React', 'TypeScript', 'JavaScript', 'Developer', 'Frontend', 'Backend',
      'API', 'Database', 'Component', 'Function', 'Interface', 'Module',
      'Framework', 'Library', 'Algorithm', 'Variable', 'Constant', 'Method',
      'Docker', 'Git', 'Node.js', 'Express', 'MongoDB', 'Redux', 'Vue.js',
      'Angular', 'Python', 'Java', 'Kotlin', 'Swift', 'Flutter', 'Firebase'
    ],
    quotes: [
      'Dream big', 'Never give up', 'Stay focused', 'Keep coding',
      'Build future', 'Create magic', 'Think different', 'Be creative',
      'Start small', 'Grow daily', 'Learn always', 'Code passion',
      'Stay curious', 'Embrace change', 'Work smart', 'Be innovative',
      'Take risks', 'Keep learning', 'Stay humble', 'Dream bigger'
    ],
    facts: [
      'Coding fun', 'Tech world', 'Web design', 'Game dev',
      'AI future', 'Data flow', 'Cloud apps', 'Mobile first',
      'Fast code', 'Clean code', 'Bug free', 'Ship it',
      'Full stack', 'DevOps', 'Agile dev', 'Test driven'
    ],
    gaming: [
      'Unity', 'Unreal', 'Godot', 'GameMaker', 'Blender', 'Maya',
      'Level Design', 'Game Loop', 'Sprites', 'Animation', 'Collision',
      'Physics', 'Particle', 'Shader', 'Texture', 'Mesh', 'Rigging'
    ],
    webdev: [
      'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap', 'jQuery',
      'REST API', 'GraphQL', 'WebSocket', 'OAuth', 'JWT', 'CORS',
      'Webpack', 'Vite', 'ESLint', 'Prettier', 'NPM', 'Yarn'
    ],
    design: [
      'UI/UX', 'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator',
      'Typography', 'Color Theory', 'Layout', 'Grid System', 'Wireframe',
      'Prototype', 'Mockup', 'Design System', 'Accessibility', 'Responsive'
    ]
  };

  // Get random word
  const getRandomWord = () => {
    const words = wordLists[theme];
    return words[Math.floor(Math.random() * words.length)];
  };

  // Start game
  const startGame = () => {
    setGameActive(true);
    setTimeLeft(duration);
    setUserInput('');
    setWordHistory([]);
    setWpm(0);
    setAccuracy(100);
    setCurrentWord(getRandomWord() ?? 'Loading...');
    setFeedback(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gameActive) return;
    
    const input = e.target.value;
    setUserInput(input);

    // Check if word is completed
    if (input.endsWith(' ')) {
      const typedWord = input.trim();
      const isCorrect = typedWord === currentWord;
      
      // Update word history
      setWordHistory(prev => [...prev, { word: currentWord, correct: isCorrect }]);
      
      // Calculate accuracy
      const totalWords = wordHistory.length + 1;
      const correctWords = wordHistory.filter(w => w.correct).length + (isCorrect ? 1 : 0);
      setAccuracy(Math.round((correctWords / totalWords) * 100));

      // Calculate WPM
      const timeSpent = 15 - timeLeft;
      const wordsTyped = wordHistory.length + 1;
      const newWpm = Math.round((wordsTyped / timeSpent) * 60);
      setWpm(newWpm);

      // Update high score
      if (newWpm > highScore) {
        setHighScore(newWpm);
      }

      // Reset for next word
      setUserInput('');
      setCurrentWord(getRandomWord() ?? 'Loading...');
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!gameActive) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent space from adding space to input
      const typedWord = userInput.trim();
      const isCorrect = typedWord === currentWord;
      
      // Show feedback in corner
      setFeedback({
        text: isCorrect ? '✓ Correct!' : '✗ Try Again',
        isCorrect
      });
      
      // Clear feedback after 1 second
      setTimeout(() => {
        setFeedback(null);
      }, 1000);

      // Update word history
      setWordHistory(prev => [...prev, { word: currentWord, correct: isCorrect }]);
      
      // Calculate accuracy
      const totalWords = wordHistory.length + 1;
      const correctWords = wordHistory.filter(w => w.correct).length + (isCorrect ? 1 : 0);
      setAccuracy(Math.round((correctWords / totalWords) * 100));

      // Calculate WPM
      const timeSpent = duration - timeLeft;
      const wordsTyped = wordHistory.length + 1;
      const newWpm = Math.round((wordsTyped / (timeSpent / 60)));
      setWpm(newWpm);

      // Update high score
      if (newWpm > highScore) {
        setHighScore(newWpm);
      }

      // Reset for next word
      setUserInput('');
      setCurrentWord(getRandomWord() ?? 'Loading...');
    }
  };

  // Game timer
  useEffect(() => {
    let timer: number;
    if (gameActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => window.clearInterval(timer);
  }, [gameActive, timeLeft]);



  

  // Floating animation for background elements
  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };



  // Interactive typing effect for the intro text
  const [displayText, setDisplayText] = useState('');
  const fullText = "I believe in creating experiences that don't just entertain, but inspire and connect people across cultures.";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // Update the toolbox data to be more personal and specific
  const toolbox = [
    { 
      name: 'Unity & C#',
      type: 'Game Development',
      level: 90,
      icon: <Gamepad className="w-4 h-4" />,
      description: 'Specialized in creating immersive game experiences with Unity, focusing on Indian-themed games and strategic gameplay mechanics. Proficient in C# development and Unity\'s latest features.',
      projects: ['Indian Business Board Game', 'Strategic Multiplayer Games']
    },
    { 
      name: 'React & TypeScript',
      type: 'Frontend Development',
      level: 88,
      icon: <Code2 className="w-4 h-4" />,
      description: 'Building modern, responsive web applications using React 18+ and TypeScript. Experienced with Next.js, Framer Motion, and state management solutions.',
      projects: ['Portfolio Website', 'Game Dashboard']
    },
    { 
      name: 'Three.js & WebGL',
      type: '3D Graphics',
      level: 85,
      icon: <Box className="w-4 h-4" />,
      description: 'Creating interactive 3D experiences for the web. Skilled in Three.js, WebGL, and integrating 3D elements with React applications.',
      projects: ['3D Game Previews', 'Interactive Demos']
    },
    { 
      name: 'Node.js & Express',
      type: 'Backend Development',
      level: 82,
      icon: <Server className="w-4 h-4" />,
      description: 'Developing robust backend services with Node.js and Express. Experience with RESTful APIs, WebSocket integration, and database management.',
      projects: ['Game Server', 'API Development']
    },
    { 
      name: 'Game Systems',
      type: 'Game Development',
      level: 85,
      icon: <Gamepad className="w-4 h-4" />,
      description: 'Implementing advanced game systems using Unity and custom algorithms. Focus on creating intelligent NPCs and dynamic gameplay systems.',
      projects: ['Dynamic Opponents', 'Difficulty Systems']
    },
    { 
      name: 'Creative Coding',
      type: 'Graphics & Animation',
      level: 85,
      icon: <Palette className="w-4 h-4" />,
      description: 'Combining creativity with code to create unique visual experiences. Skilled in GSAP, SVG animations, and creative coding techniques.',
      projects: ['Interactive Animations', 'Visual Effects']
    }
  ];

  // Add this inside your component, before the return statement
  const backgroundIcons = [
    <Code className="w-6 h-6" />,
    <Gamepad2 className="w-6 h-6" />,
    <Star className="w-6 h-6" />,
    <Brain className="w-6 h-6" />,
    <Laptop className="w-6 h-6" />
  ];

  const journey = [
    {
      year: '2020',
      title: 'Founder',
      description: 'Founded Stellar Pop Games',
      icon: <Gamepad2 className="w-5 h-5" />
    },
    {
      year: '2021',
      title: 'Web Development',
      description: 'Expanded into full-stack web development',
      icon: <Code className="w-5 h-5" />
    },
    {
      year: '2022',
      title: 'Game Systems',
      description: 'Started exploring advanced game development',
      icon: <Gamepad className="w-5 h-5" />
    },
    {
      year: '2023',
      title: 'Stellar Pop Games',
      description: 'Founded my game development studio',
      icon: <Star className="w-5 h-5" />
    },
    {
      year: '2024',
      title: 'Current Project',
      description: 'Building Indian Business Board Game',
      icon: <Rocket className="w-5 h-5" />
    }
  ];

  const values = [
    { icon: <Sparkles />, label: 'Creativity', color: 'from-purple-500 to-pink-500' },
    { icon: <Lightbulb />, label: 'Innovation', color: 'from-yellow-500 to-orange-500' },
    { icon: <Compass />, label: 'Detail', color: 'from-blue-500 to-cyan-500' },
    { icon: <Users />, label: 'Accessibility', color: 'from-green-500 to-emerald-500' }
  ];

  const funFacts = [
    "I've consumed over 1000 cups of coffee while coding 🎮",
    "My first game was a text-based adventure about a lost pizza 🍕",
    "I debug in my dreams sometimes 💭",
    "I name my Git branches after Indian spices 🌶️"
  ];

  // Update the renderToolbox function
  const renderToolbox = () => (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative rounded-2xl overflow-hidden ${
        isDarkMode 
          ? 'bg-slate-800/30' 
          : 'bg-white/10'
      }`}
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear'
        }}
      />

      {/* Content Container */}
      <div className="relative p-6">
        {/* Section Title */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
              isDarkMode 
                ? 'bg-indigo-500/10 text-indigo-400' 
                : 'bg-indigo-50 text-indigo-600'
            }`}
          >
            <Code2 className="w-6 h-6" />
          </motion.div>
          <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Development Arsenal
          </h3>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-indigo-500/50 to-purple-500/50 rounded-full" />
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {toolbox.map((tool, index) => (
            <motion.button
              key={tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/50' 
                  : 'bg-white/50 border-gray-200/50 hover:border-indigo-500/30'
              } transition-colors duration-300`}
            >
              {/* Glow Effect */}
              <motion.div
                className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isDarkMode 
                    ? 'bg-indigo-500/5' 
                    : 'bg-indigo-500/5'
                }`}
              />

              <div className="relative flex flex-col items-center text-center">
                <div className={`p-3 rounded-xl mb-3 ${
                  isDarkMode 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'bg-indigo-100 text-indigo-600'
                } transition-colors duration-300`}>
                  {tool.icon}
                </div>
                <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {tool.name}
                </h4>
                <span className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {tool.type}
                </span>
                <div className="w-full space-y-2">
                  <div className="h-1 rounded-full overflow-hidden bg-slate-700/30">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tool.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                  <div className="flex justify-center">
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`}>
                      {tool.level}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
    </motion.div>
  );



  return (
    <section 
      id="about" 
      className={`relative py-20 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`} 
      ref={sectionRef}
    >
      <div className="container mx-auto max-w-6xl relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold inline-flex items-center justify-center gap-3">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                The Story So Far
              </span>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                ✨
              </motion.div>
            </h2>
          </motion.div>
          
          {/* Intro Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className={`max-w-3xl mx-auto mb-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            <p className={`text-xl font-light italic ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {displayText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                |
              </motion.span>
            </p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Personal Intro & Image */}
          <div className="space-y-8 relative">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl overflow-hidden ${
                isDarkMode 
                  ? 'bg-slate-800/50 border border-slate-700/50' 
                  : 'bg-white border border-gray-200 shadow-lg'
              }`}
            >
              {/* Profile Image Container */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <div className={`absolute inset-0 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30' 
                    : 'bg-gradient-to-br from-indigo-100/30 to-purple-100/30'
                }`}>
                  {/* Profile Image */}
                  <div className="h-full flex items-center justify-center">
                    <motion.div 
                      className="relative w-64 h-64 rounded-full overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={isDarkMode 
                          ? "/images/AI-dark.jpg"  // AI dark theme
                          : "/images/AI-light.jpg" // AI light theme
                        }
                        alt="Harshal Poojari"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Hover Effect - Show artistic version */}
                      <motion.div
                        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    >
                        <img
                          src="/images/AI-Artistic.jpg" // AI artistic
                          alt="Harshal Poojari - Artistic"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Harshal Poojari
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      Founder @ Stellar Pop Games
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-full ${
                      isDarkMode 
                        ? 'bg-slate-700 text-pink-400 hover:bg-slate-600' 
                        : 'bg-gray-100 text-pink-500 hover:bg-gray-200'
                    }`}
                    onClick={() => setShowEasterEgg(!showEasterEgg)}
                  >
                    <Heart className="w-5 h-5" />
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showEasterEgg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`p-4 rounded-lg ${
                        isDarkMode 
                          ? 'bg-slate-700/50 border border-slate-600' 
                          : 'bg-gray-100 border border-gray-200'
                      }`}>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {funFacts[Math.floor(Math.random() * funFacts.length)]}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className={`p-4 rounded-lg ${
                    isDarkMode 
                      ? 'bg-slate-700/50' 
                      : 'bg-gray-100'
                  }`}>
                    <div className="text-2xl font-bold text-indigo-500">3+</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Years Experience
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    isDarkMode 
                      ? 'bg-slate-700/50' 
                      : 'bg-gray-100'
                  }`}>
                    <div className="text-2xl font-bold text-purple-500">10+</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Projects Built
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Current Project - Interactive Showcase */}
            <div className={`mt-12 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'} rounded-xl overflow-hidden border ${
              isDarkMode ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <div className="relative">
                {/* Project Header */}
                <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                      }`}>
                        <span className="text-2xl">🎮</span>
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Indian Business Board Game
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-500'}`} />
                          <span className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                            Active Development
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {['Unity', 'C#', 'Multiplayer'].map((tech) => (
                        <div key={tech} className={`px-3 py-1 rounded-lg text-sm ${
                isDarkMode 
                            ? 'bg-slate-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interactive Content */}
                <div className="p-6">
                  <div className="flex items-start gap-8">
                    {/* Project Info */}
                    <div className="flex-1">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        A strategic multiplayer board game celebrating Indian entrepreneurship. Players navigate through city tiles, 
                        manage properties, and compete in a dynamic market.
                      </p>
                      
                      
                    </div>

                    {/* Progress Preview */}
                    <div className={`w-64 p-4 rounded-xl ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                    }`}>
                      <h4 className={`text-sm font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Development Progress
                      </h4>
                      <div className="space-y-3">
                        {[
                          { label: 'Core Game', progress: 90 },
                          { label: 'Multiplayer', progress: 85 },
                          { label: 'UI/UX', progress: 75 }
                        ].map((item, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                {item.label}
                              </span>
                              <span className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}>
                                {item.progress}%
                              </span>
                            </div>
                            <div className={`h-1.5 rounded-full overflow-hidden ${
                              isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                            }`}>
                              <div 
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-dashed ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-200'
                  }">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded text-xs ${
                        isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        v0.8.5 Beta
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-50 text-purple-600'
                      }`}>
                        Last updated: 2 days ago
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200">
                        Try Demo
                      </button>
                      <button className={`px-4 py-1.5 text-sm rounded-lg border ${
                        isDarkMode 
                          ? 'border-gray-600 text-gray-300 hover:border-indigo-500 hover:text-indigo-400' 
                          : 'border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600'
                      } transition-all duration-200`}>
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Typing Speed Mini-Game */}
            <div className={`mt-4 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'} rounded-xl overflow-hidden border ${
              isDarkMode ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Speed Typing Challenge
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Test your typing speed • High Score: {highScore} WPM
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value) as 30 | 60 | 120)}
                      className={`px-2 py-1 rounded text-xs ${
                        isDarkMode 
                          ? 'bg-slate-700 text-gray-300 border-slate-600' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      } border outline-none`}
                      disabled={gameActive}
                    >
                      <option value={30}>30 seconds</option>
                      <option value={60}>1 minute</option>
                      <option value={120}>2 minutes</option>
                    </select>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as any)}
                      className={`px-2 py-1 rounded text-xs ${
                        isDarkMode 
                          ? 'bg-slate-700 text-gray-300 border-slate-600' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      } border outline-none`}
                      disabled={gameActive}
                    >
                      <option value="tech">Tech Terms</option>
                      <option value="webdev">Web Dev</option>
                      <option value="gaming">Gaming</option>
                      <option value="design">Design</option>
                      <option value="quotes">Quotes</option>
                      <option value="facts">Fun Facts</option>
                    </select>
                    <button
                      onClick={gameActive ? () => setGameActive(false) : startGame}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        gameActive
                          ? isDarkMode 
                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                          : isDarkMode
                            ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                      } transition-colors`}
                    >
                      {gameActive ? 'Stop' : 'Start'}
                    </button>
                  </div>
                </div>

                {/* Game Area */}
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                }`}>
                  {/* Current Word Display */}
                  <div className="text-center mb-4">
                    <motion.div
                      key={currentWord}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-2xl font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {currentWord}
                    </motion.div>
                  </div>

                  {/* Input Field */}
                  <div className="mb-4 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={userInput}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      disabled={!gameActive}
                      placeholder={gameActive ? 'Type word and press Space or Enter...' : 'Press Start to begin'}
                      className={`w-full px-4 py-2 rounded-lg text-center ${
                  isDarkMode 
                          ? 'bg-slate-800 text-white border-slate-600'
                          : 'bg-white text-gray-900 border-gray-200'
                      } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    
                    {/* Feedback Display */}
                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`absolute -top-8 right-0 px-2 py-1 rounded text-sm font-medium ${
                          feedback.isCorrect
                            ? isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-50 text-green-600'
                            : isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {feedback.text}
                      </motion.div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className={`p-2 rounded-lg text-center ${
                      isDarkMode ? 'bg-slate-800' : 'bg-white'
                    }`}>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Time Left
                </div>
                      <motion.div
                        animate={{ scale: timeLeft <= 5 ? [1, 1.1, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                        className={`text-xl font-bold ${
                          timeLeft <= 5
                            ? 'text-red-500'
                            : isDarkMode
                              ? 'text-white'
                              : 'text-gray-900'
                        }`}
                      >
                        {timeLeft}s
                      </motion.div>
                    </div>
                    <div className={`p-2 rounded-lg text-center ${
                      isDarkMode ? 'bg-slate-800' : 'bg-white'
                    }`}>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        WPM
                      </div>
                      <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {wpm}
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg text-center ${
                      isDarkMode ? 'bg-slate-800' : 'bg-white'
                    }`}>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Accuracy
                      </div>
                      <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {accuracy}%
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg text-center ${
                      isDarkMode ? 'bg-slate-800' : 'bg-white'
                    }`}>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Words
                      </div>
                      <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {wordHistory.length}
                      </div>
                    </div>
              </div>

                  {/* Word History */}
                <div className="flex flex-wrap gap-2">
                    {wordHistory.slice(-5).map((item, index) => (
                      <motion.div
                      key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`px-2 py-1 rounded text-xs ${
                          item.correct
                            ? isDarkMode
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-green-50 text-green-600'
                            : isDarkMode
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-red-50 text-red-600'
                      }`}
                    >
                        {item.word}
                      </motion.div>
                  ))}
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Right Column - Journey & Skills */}
          <div className="space-y-8">
            {/* Journey Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {journey.map((step, index) => (
                <motion.div
                  key={step.year}
                  className={`relative flex items-start gap-4 ${
                    index !== journey.length - 1 ? 'pb-6' : ''
                  }`}
                  onHoverStart={() => setActiveJourneyStep(index)}
                >
                  {/* Timeline line */}
                  {index !== journey.length - 1 && (
                    <div 
                      className={`absolute left-[19px] top-8 w-0.5 h-full ${
                        isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                      }`}
                    />
                  )}

                  {/* Year bubble */}
                  <motion.div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                      activeJourneyStep === index
                        ? isDarkMode
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-500 text-white'
                        : isDarkMode
                          ? 'bg-slate-700 text-gray-400'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step.icon}
                  </motion.div>

                  {/* Content */}
                  <div className={`flex-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-mono text-sm ${
                        isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                      }`}>
                        {step.year}
                      </span>
                      <h4 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-sm">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {values.map((value, index) => (
                <motion.div
                  key={value.label}
                  className={`p-4 rounded-xl ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border border-slate-700/50' 
                      : 'bg-white border border-gray-200 shadow-sm'
                  }`}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-3`}>
                    {value.icon}
                  </div>
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {value.label}
                  </h4>
                </motion.div>
              ))}
            </motion.div>

            {renderToolbox()}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a 
            href="#contact"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              isDarkMode
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Let's Build Something Epic Together</span>
            <ChevronRight className="w-5 h-5" />
          </a>
          <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Always open to interesting conversations and collaborations
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;