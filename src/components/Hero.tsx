import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileDown, X, ArrowLeft, ArrowRight, ExternalLink, Github } from 'lucide-react';
import * as THREE from 'three';
import { portfolioItems as importedPortfolioItems } from './Portfolio';
import { useTheme } from '../context/ThemeContext';

const Hero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const frameRef = useRef<number>();
  const boardPieceRef = useRef<THREE.Group>();
  const [modalOpen, setModalOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const portfolioItems = importedPortfolioItems.filter(item => item.featured);

  // Helper function to safely get current portfolio item
  const getCurrentPortfolioItem = () => {
    return galleryIndex >= 0 && galleryIndex < portfolioItems.length 
      ? portfolioItems[galleryIndex] 
      : null;
  };

  // Safe navigation functions
  const goToPrevious = () => {
    if (portfolioItems.length > 0) {
      setGalleryIndex((galleryIndex - 1 + portfolioItems.length) % portfolioItems.length);
    }
  };

  const goToNext = () => {
    if (portfolioItems.length > 0) {
      setGalleryIndex((galleryIndex + 1) % portfolioItems.length);
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 25;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: '#6366F1',
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create floating geometric shapes
    const shapes: THREE.Mesh[] = [];
    const geometries = [
      new THREE.OctahedronGeometry(0.3),
      new THREE.TetrahedronGeometry(0.3),
      new THREE.IcosahedronGeometry(0.3),
      new THREE.DodecahedronGeometry(0.3),
    ];

    for (let i = 0; i < 20; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? '#6366F1' : '#F59E0B',
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      shapes.push(mesh);
      scene.add(mesh);
    }

    // Create 3D board game piece
    const boardPieceGroup = new THREE.Group();
    
    // Base of the piece
    const baseGeometry = new THREE.CylinderGeometry(0.5, 0.7, 0.2, 32);
    const baseMaterial = new THREE.MeshBasicMaterial({ 
      color: '#F59E0B',
      wireframe: false,
      transparent: true,
      opacity: 0.8,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    boardPieceGroup.add(base);
    
    // Middle part
    const middleGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.8, 32);
    const middleMaterial = new THREE.MeshBasicMaterial({ 
      color: '#6366F1',
      wireframe: false,
      transparent: true,
      opacity: 0.8,
    });
    const middle = new THREE.Mesh(middleGeometry, middleMaterial);
    middle.position.y = 0.5;
    boardPieceGroup.add(middle);
    
    // Top part
    const topGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const topMaterial = new THREE.MeshBasicMaterial({ 
      color: '#8B5CF6',
      wireframe: false,
      transparent: true,
      opacity: 0.8,
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 1.1;
    boardPieceGroup.add(top);
    
    // Add wireframe overlay to the pieces
    const wireframeBase = new THREE.Mesh(
      baseGeometry,
      new THREE.MeshBasicMaterial({ 
        color: '#FFFFFF',
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      })
    );
    boardPieceGroup.add(wireframeBase);
    
    const wireframeMiddle = new THREE.Mesh(
      middleGeometry,
      new THREE.MeshBasicMaterial({ 
        color: '#FFFFFF',
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      })
    );
    wireframeMiddle.position.y = 0.5;
    boardPieceGroup.add(wireframeMiddle);
    
    const wireframeTop = new THREE.Mesh(
      topGeometry,
      new THREE.MeshBasicMaterial({ 
        color: '#FFFFFF',
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      })
    );
    wireframeTop.position.y = 1.1;
    boardPieceGroup.add(wireframeTop);
    
    // Scale and position the board piece
    boardPieceGroup.scale.set(0.8, 0.8, 0.8);
    boardPieceGroup.position.set(3, 0, 0);
    boardPieceGroup.rotation.set(0.3, 0, 0.2);
    scene.add(boardPieceGroup);
    boardPieceRef.current = boardPieceGroup;

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Rotate particles
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;

      // Animate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.01 + index * 0.001;
        shape.rotation.y += 0.01 + index * 0.001;
        shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
      });

      // Rotate board piece
      if (boardPieceRef.current) {
        boardPieceRef.current.rotation.y += 0.01;
        boardPieceRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Handle mouse movement for parallax effect
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      if (particlesMesh) {
        particlesMesh.rotation.x += mouseY * 0.0005;
        particlesMesh.rotation.y += mouseX * 0.0005;
      }
      
      if (boardPieceRef.current) {
        boardPieceRef.current.rotation.x += mouseY * 0.001;
        boardPieceRef.current.rotation.z += mouseX * 0.001;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Don't render modal if no portfolio items
  if (modalOpen && portfolioItems.length === 0) {
    setModalOpen(false);
    return null;
  }

  const currentItem = getCurrentPortfolioItem();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900 z-10" />
      
      {/* Content */}
      <motion.div 
        className="relative z-20 text-center px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="space-y-6 animate-fade-in">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Harshal Poojari
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Founder of <span className="text-indigo-400 font-semibold">Stellar Pop Games</span>
          </motion.p>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <p className="text-lg md:text-xl text-gray-400 italic max-w-2xl mx-auto leading-relaxed">
              "Building immersive worlds, one pixel and one line of code at a time."
            </p>
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg blur-xl" />
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <motion.button 
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => portfolioItems.length > 0 && setModalOpen(true)}
              disabled={portfolioItems.length === 0}
            >
              View My Work
            </motion.button>
            <a
              href="/Resume.pdf"
              download
              className="flex items-center gap-2 px-8 py-3 border border-gray-600 rounded-lg font-semibold hover:border-indigo-500 hover:text-indigo-400 transition-all duration-300"
              style={{ display: 'inline-flex' }}
            >
              <FileDown className="w-5 h-5" />
              Download Resume
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal Gallery */}
      <AnimatePresence>
        {modalOpen && currentItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 flex flex-col items-center"
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                onClick={() => setModalOpen(false)}
                aria-label="Close gallery"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>

              {/* Gallery Content */}
              <div className="w-full flex flex-col items-center">
                <button
                  className="w-full focus:outline-none"
                  style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
                  onClick={() => {
                    setModalOpen(false);
                    setTimeout(() => {
                      const section = document.getElementById('portfolio');
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                        setTimeout(() => {
                          if (currentItem?.anchorId) {
                            const anchor = document.getElementById(currentItem.anchorId);
                            if (anchor) {
                              anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }
                        }, 600);
                      }
                    }, 200);
                  }}
                  aria-label={`Go to ${currentItem.title} in portfolio`}
                >
                  <div className="relative group cursor-pointer w-full">
                    <img
                      src={currentItem.image}
                      alt={currentItem.title}
                      className="rounded-xl w-full h-56 object-cover mb-4 bg-slate-100 dark:bg-slate-800 shadow-lg group-hover:scale-105 group-hover:shadow-2xl transition-transform duration-300 border-4 border-transparent group-hover:border-indigo-400"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 rounded-xl transition-opacity duration-300">
                      <span className="text-white text-lg font-semibold bg-indigo-600/80 px-4 py-2 rounded-lg shadow-lg">View in Portfolio</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors duration-200 text-center">
                    {currentItem.title}
                  </h3>
                </button>
                <p className="text-sm mb-2 text-gray-600 dark:text-gray-300 text-center max-w-md">
                  {currentItem.description}
                </p>
                <div className="flex gap-2 mb-2 flex-wrap justify-center">
                  {currentItem.technologies?.map((tech: string) => (
                    <span key={tech} className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-800 text-xs text-indigo-700 dark:text-indigo-200 font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  {currentItem.liveUrl && currentItem.liveUrl !== '#' && (
                    <a href={currentItem.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition shadow">
                      <ExternalLink className="w-4 h-4" /> Live
                    </a>
                  )}
                  {currentItem.githubUrl && currentItem.githubUrl !== '#' && (
                    <a href={currentItem.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold transition shadow">
                      <Github className="w-4 h-4" /> Code
                    </a>
                  )}
                </div>
              </div>

              {/* Gallery Navigation */}
              {portfolioItems.length > 1 && (
                <div className="flex justify-between items-center w-full mt-6">
                  <button
                    className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                    onClick={goToPrevious}
                    aria-label="Previous project"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {galleryIndex + 1} / {portfolioItems.length}
                  </span>
                  <button
                    className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                    onClick={goToNext}
                    aria-label="Next project"
                  >
                    <ArrowRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
      >
        <div className="flex flex-col items-center animate-bounce">
          <span className="text-gray-400 text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
