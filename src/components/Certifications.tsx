'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Calendar, ZoomIn, Filter, Search, Download, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

// --- UTILITY FUNCTIONS ---

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

type CertificationLevel = 'Foundational' | 'Associate' | 'Professional' | 'Competition' | string;

const getLevelStyles = (level: CertificationLevel): string => {
  const styles: Record<string, string> = {
    'Foundational': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50',
    'Associate': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50',
    'Professional': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/50',
    'Competition': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/50',
  };
  return styles[level] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
};

// --- DATA STRUCTURE ---
interface Certificate {
  title: string;
  issuer: string;
  date: string;
  category: string;
  description: string;
  credentialId: string;
  verifyUrl: string;
  image: string;
  skills: string[];
  level: CertificationLevel;
}

// --- SUB-COMPONENTS ---

const LensZoom: React.FC<{ imageUrl: string; children: React.ReactNode }> = ({ imageUrl, children }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const lensSize = 150;
    const zoomScale = 2.5;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPosition({ x, y });
    };

    const bgX = -(position.x * zoomScale - lensSize / 2);
    const bgY = -(position.y * zoomScale - lensSize / 2);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className="relative w-full h-full overflow-hidden"
        >
            {children}
            <motion.div
                className="absolute pointer-events-none rounded-full border-2 border-white/80 shadow-2xl backdrop-blur-sm"
                style={{
                    width: lensSize,
                    height: lensSize,
                    top: position.y - lensSize / 2,
                    left: position.x - lensSize / 2,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: `${bgX}px ${bgY}px`,
                    backgroundSize: `${(containerRef.current?.offsetWidth || 0) * zoomScale}px`,
                    backgroundRepeat: 'no-repeat',
                }}
                animate={{ opacity }}
                transition={{ duration: 0.2 }}
            />
            <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 backdrop-blur-sm">
                <ZoomIn className="w-3 h-3" />
                <span>Hover to zoom</span>
            </div>
        </div>
    );
};

const CertificateModal: React.FC<{
    cert: Certificate | null;
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}> = ({ cert, isOpen, onClose, onNext, onPrev, hasNext, hasPrev }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && hasPrev) onPrev();
            if (e.key === 'ArrowRight' && hasNext) onNext();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, hasPrev, hasNext, onClose, onPrev, onNext]);

    return (
        <AnimatePresence>
            {isOpen && cert && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full h-full max-w-6xl max-h-[90vh] p-4 flex flex-col items-center justify-center"
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            {cert.image.endsWith('.pdf') ? (
                                <iframe
                                    src={`${cert.image}#toolbar=0&navpanes=0`}
                                    className="w-full h-full rounded-lg border border-slate-700"
                                    title={cert.title}
                                />
                            ) : (
                                <img
                                    src={cert.image}
                                    alt={`${cert.title} certificate`}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                />
                            )}
                        </div>

                        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 text-white/70 hover:text-white transition-colors"><X /></button>
                        {hasPrev && <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 rounded-full text-white/70 hover:text-white transition-colors"><ChevronLeft /></button>}
                        {hasNext && <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 rounded-full text-white/70 hover:text-white transition-colors"><ChevronRight /></button>}
                        
                        <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md rounded-lg p-4 text-white text-left">
                            <h3 className="text-xl font-bold mb-1">{cert.title}</h3>
                            <p className="text-gray-300 text-sm">{cert.issuer} • Issued {formatDate(cert.date)}</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CertificateCard: React.FC<{
  cert: Certificate;
  onView: () => void;
}> = ({ cert, onView }) => {
  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 h-full flex flex-col">
      <div className={cn("absolute top-4 right-4 z-10 px-3 py-1 text-xs font-medium rounded-full border", getLevelStyles(cert.level))}>
          {cert.level}
      </div>
      
      <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-slate-100 dark:bg-slate-700 cursor-pointer overflow-hidden" onClick={onView}>
              {cert.image.endsWith('.pdf') ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                      <Award className="w-12 h-12 text-gray-400 mb-2" />
                      <h4 className="font-semibold text-gray-700 dark:text-gray-200">PDF Certificate</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1"><Eye className="w-3 h-3" />Click to view</p>
                  </div>
              ) : (
                  <LensZoom imageUrl={cert.image}>
                      <div className="w-full h-64 flex items-center justify-center p-2">
                          <img
                              src={cert.image}
                              alt={`${cert.title} certificate`}
                              className="h-full w-auto max-w-full object-contain"
                              onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = '/images/placeholder-cert.jpg';
                              }}
                          />
                      </div>
                  </LensZoom>
              )}
          </div>
          
          <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">{cert.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{cert.issuer}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(cert.date)}</span>
                  </div>
                  <button
                      onClick={(e) => {
                          e.stopPropagation();
                          window.open(cert.verifyUrl, '_blank');
                      }}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
                      title="View credential"
                  >
                      <ExternalLink className="w-3.5 h-3.5" />
                  </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                  {cert.skills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                          {skill}
                      </span>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

// --- MAIN CERTIFICATIONS COMPONENT ---
const Certifications = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [modalState, setModalState] = useState<{ isOpen: boolean; index: number }>({ isOpen: false, index: 0 });

    const certifications: Certificate[] = [
        {
            title: 'Microsoft Certified: Generative AI Foundational Certificate', 
            issuer: 'Microsoft', 
            date: '2025-07-15', 
            category: 'cloud',
            description: 'Expertise in designing and implementing AI solutions.',
            credentialId: '', 
            verifyUrl: '/images/GenAI_cert.png', 
            image: '/images/GenAI_cert.png',
            skills: ['Azure AI', 'Generative AI', 'Automation'], 
            level: 'Foundational',
        },
        {
            title: 'Google Cloud Solution Challenge', 
            issuer: 'Google Cloud', 
            date: '2025-07-15', 
            category: 'cloud',
            description: 'Fundamental knowledge of Google Cloud products, services, and solutions.',
            credentialId: '', 
            verifyUrl: '/images/GDG1_cert.png', 
            image: '/images/GDG1_cert.png',
            skills: ['Google Cloud', 'Cloud Computing', 'Application Development'], 
            level: 'Competition',
        },
        {
            title: 'Google Developer Groups', 
            issuer: 'Hack2Skill', 
            date: '2025-07-15', 
            category: 'cloud',
            description: 'Active participation and contribution to Hack2Skill community events.',
            credentialId: '', 
            verifyUrl: '/images/GDG_cert.jpg', 
            image: '/images/GDG_cert.jpg',
            skills: ['Community', 'Networking', 'Google Technologies'], 
            level: 'Competition',
        },
        {
            title: 'Microsoft Power BI Certification', 
            issuer: 'OfficeMaster', 
            date: '2025-07-15', 
            category: 'skills',
            description: 'Certified in data visualization and business intelligence with Microsoft Power BI.',
            credentialId: '', 
            verifyUrl: '/images/PowerBI_cert.png', 
            image: '/images/PowerBI_cert.png',
            skills: ['Power BI', 'Data Visualization', 'Business Intelligence'], 
            level: 'Professional',
        },
        {
            title: 'Smart India Hackathon', 
            issuer: 'Government of India', 
            date: '2024-09-15', 
            category: 'competition',
            description: 'National level hackathon participation with innovative project implementation.',
            credentialId: '', 
            verifyUrl: '/images/SIH_cert.png', 
            image: '/images/SIH_cert.png',
            skills: ['Hackathon', 'Problem Solving', 'Teamwork'], 
            level: 'Competition',
        },
        {
            title: 'Web Design Certification', 
            issuer: 'Web Development Institute', 
            date: '2024-10-15', 
            category: 'development',
            description: 'Professional certification in modern web design principles and practices.',
            credentialId: '', 
            verifyUrl: '/images/Webdesign_cert.png', 
            image: '/images/Webdesign_cert.png',
            skills: ['Web Design', 'UI/UX', 'Responsive Design'], 
            level: 'Professional',
        },
    ];

    const categories = useMemo(() => [
        { id: 'all', name: 'All' },
        { id: 'cloud', name: 'Cloud' },
        { id: 'development', name: 'Development' },
        { id: 'competition', name: 'Competitions' },
        { id: 'skills', name: 'Skills' },
    ].map(cat => ({...cat, count: certifications.filter(c => cat.id === 'all' || c.category === cat.id).length })), [certifications]);
    
    const filteredCertifications = useMemo(() => certifications.filter(cert => {
        const searchLower = searchTerm.toLowerCase();
        return (selectedCategory === 'all' || cert.category === selectedCategory) &&
               (cert.title.toLowerCase().includes(searchLower) ||
                cert.issuer.toLowerCase().includes(searchLower) ||
                cert.skills.some(skill => skill.toLowerCase().includes(searchLower)));
    }), [searchTerm, selectedCategory, certifications]);

    const openModal = (index: number) => setModalState({ isOpen: true, index });
    const closeModal = () => setModalState({ isOpen: false, index: 0 });
    const handleNext = () => setModalState(prev => ({ ...prev, index: (prev.index + 1) % filteredCertifications.length }));
    const handlePrev = () => setModalState(prev => ({ ...prev, index: (prev.index - 1 + filteredCertifications.length) % filteredCertifications.length }));

    return (
        <section id="certifications" className="py-24 px-4 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring' }} className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-6">
                        <Award className="w-8 h-8 text-white" />
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Certifications
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                        A collection of my professional credentials and achievements.
                    </p>
                </div>

                <div className="mb-12 flex flex-col md:flex-row gap-6 justify-center items-center">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search certificates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={cn(
                                    "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2",
                                    selectedCategory === category.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                        : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-slate-700'
                                )}
                            >
                                {category.name}
                                <span className={cn('px-2 py-0.5 text-xs rounded-full', selectedCategory === category.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-slate-700')}>{category.count}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredCertifications.map((cert, index) => (
                        <motion.div
                            key={cert.credentialId}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
                        >
                           <CertificateCard cert={cert} onView={() => openModal(index)} />
                        </motion.div>
                    ))}
                </div>

                 {filteredCertifications.length === 0 && (
                    <div className="text-center py-16 col-span-full">
                        <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No certifications found</h3>
                        <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
            
            <CertificateModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                cert={filteredCertifications[modalState.index]}
                onNext={handleNext}
                onPrev={handlePrev}
                hasNext={filteredCertifications.length > 1}
                hasPrev={filteredCertifications.length > 1}
            />
        </section>
    );
};

export default Certifications;