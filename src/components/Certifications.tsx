import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ThemeContext } from '../App';

const Certifications: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const sectionRef = useScrollAnimation();
  const certifications = [
    {
      title: 'Microsoft Certified: Azure AI Engineer',
      issuer: 'Microsoft',
      date: '2024-01-15',
      description: 'Certification demonstrating expertise in designing and implementing AI solutions using Azure Cognitive Services.',
      credentialId: 'MS-AZ-204',
      verifyUrl: '/images/GenAI Microsoft.pdf',
      image: '/images/GenAI Microsoft.pdf',
      skills: ['Azure AI', 'Machine Learning', 'Cognitive Services']
    },
    {
      title: 'Google Cloud Digital Leader',
      issuer: 'Google Cloud',
      date: '2023-11-20',
      description: 'Certification validating fundamental knowledge of Google Cloud products and solutions.',
      credentialId: 'GCP-DL-2023',
      verifyUrl: 'https://www.cloudskillsboost.google/public_profiles/8d7e8f9a-1b2c-3d4e-5f6a-7b8c9d0e1f2a',
      image: '/images/Google_Solution_Challenge_2025.png',
      skills: ['Google Cloud', 'Cloud Computing', 'Digital Transformation']
    },
    {
      title: 'Web Development Professional',
      issuer: 'Udemy',
      date: '2023-09-10',
      description: 'Comprehensive web development certification covering modern frameworks and best practices.',
      credentialId: 'UDEMY-WEB-2023',
      verifyUrl: '/images/Web_Designing.pdf',
      image: '/images/Web_Designing.pdf',
      skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js']
    },
    {
      title: 'Data Analytics with Power BI',
      issuer: 'Microsoft',
      date: '2023-07-22',
      description: 'Certification in data visualization and business intelligence using Microsoft Power BI.',
      credentialId: 'MS-PL-300',
      verifyUrl: '/images/PowerBI.pdf',
      image: '/images/PowerBI.pdf',
      skills: ['Power BI', 'Data Visualization', 'Business Intelligence']
    },
    {
      title: 'Smart India Hackathon 2023',
      issuer: 'Government of India',
      date: '2023-05-18',
      description: 'National level hackathon finalist for developing innovative digital solutions.',
      credentialId: 'SIH-2023-FINALIST',
      verifyUrl: '/images/Smart_india_Hackathon.pdf',
      image: '/images/Smart_india_Hackathon.pdf',
      skills: ['Problem Solving', 'Teamwork', 'Innovation']
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <section id="certifications" className={`py-20 px-6 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`} ref={sectionRef}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Certifications
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-8" />
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Professional certifications and achievements in game development and technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              className={`group relative rounded-xl border overflow-hidden ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700/50' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 space-y-4">
                {/* Certificate Header with Image */}
                <div className="space-y-3">
                  {/* Certificate Image */}
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700 mb-3">
                    {cert.image.endsWith('.pdf') ? (
                      <object 
                        data={cert.image}
                        type="application/pdf"
                        className="w-full h-40 object-cover"
                        aria-label={`${cert.title} certificate preview`}
                      >
                        <div className="flex items-center justify-center h-full p-4 text-center">
                          <span className="text-gray-500 dark:text-gray-400">PDF Preview Unavailable</span>
                        </div>
                      </object>
                    ) : (
                      <img 
                        src={cert.image} 
                        alt={`${cert.title} certificate`}
                        className="w-full h-40 object-contain p-2"
                        loading="lazy"
                      />
                    )}
                  </div>
                  
                  {/* Certificate Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center ${
                        isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                      } text-sm font-medium`}>
                        <Award className="w-4 h-4 mr-1" />
                        {cert.issuer}
                      </span>
                      <span className={`flex items-center ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } text-sm`}>
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(cert.date)}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {cert.title}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {cert.description}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className={`px-2 py-1 text-xs rounded-md ${
                        isDarkMode 
                          ? 'bg-slate-700/50 text-indigo-300' 
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <motion.a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                      isDarkMode
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    } transition-colors duration-200`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>View Certificate</span>
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;