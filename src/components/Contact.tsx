import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Send, MapPin, Phone, MessageCircle, CheckCircle, AlertCircle, Clock, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Validate subject
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
      isValid = false;
    }

    // Validate message
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Debug: Log environment variables (remove in production)
  useEffect(() => {
    console.log('Environment Variables:', {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ? '✅ Set' : '❌ Missing',
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ? '✅ Set' : '❌ Missing',
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Missing',
      autoReplyTemplateId: import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID ? '✅ Set' : '❌ Missing'
    });
  }, []);

  // Initialize EmailJS
  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!publicKey) {
      const error = 'EmailJS Public Key is not set in environment variables';
      console.error(error);
      return;
    }
    
    try {
      emailjs.init(publicKey);
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Prepare template parameters
      const templateParams = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        subject: formData.subject.trim(),
        time: new Date().toLocaleString()
      };
      
      // Validate template parameters
      Object.entries(templateParams).forEach(([key, value]) => {
        if (!value) {
          throw new Error(`Missing required parameter: ${key}`);
        }
      });

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('Missing required EmailJS configuration');
      }

      console.log('Sending email with params:', { serviceId, templateId, templateParams });
      
      // Prepare the email data
      const emailData = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          ...templateParams,
          to_email: 'your-email@example.com', // Add your email here
          to_name: 'Your Name', // Your name or your company name
          reply_to: templateParams.email
        }
      };

      console.log('Sending email with data:', JSON.stringify(emailData, null, 2));
      
      // Send the notification email
      const notificationResponse = await emailjs.send(
        serviceId,
        templateId,
        emailData.template_params,
        publicKey
      );
      
      if (notificationResponse.status >= 400) {
        throw new Error(`EmailJS error: ${notificationResponse.status} - ${notificationResponse.text}`);
      }
      
      console.log('Notification email sent successfully:', notificationResponse);
      
      // Send auto-reply to the user
      const autoReplyTemplateId = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
      if (!autoReplyTemplateId) {
        console.warn('Auto-reply template ID not found. Skipping auto-reply email.');
      } else {
        try {
          const autoReplyResponse = await emailjs.send(
            serviceId,
            autoReplyTemplateId,
            {
              name: formData.name,
              email: formData.email,
              message: formData.message,
              time: new Date().toLocaleString()
            },
            publicKey
          );
          console.log('Auto-reply email sent successfully:', autoReplyResponse);
        } catch (autoReplyError) {
          console.error('Failed to send auto-reply:', autoReplyError);
          // Don't fail the whole submission if auto-reply fails
        }
      }
      
      // Reset form on success
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitStatus('success');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      const errorDetails = {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        environment: {
          isDev: import.meta.env.DEV,
          serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ? '✅ Set' : '❌ Missing',
          templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ? '✅ Set' : '❌ Missing',
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Missing',
          autoReplyTemplateId: import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID ? '✅ Set' : '❌ Not required for main form'
        },
        timestamp: new Date().toISOString()
      };
      
      console.error('Failed to send email:', errorDetails);
      setSubmitStatus('error');
      
      // Show error details in console for easier debugging
      alert('Error details have been logged to the console. Please check the console (F12) for more information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: 'harshalpoojari01@gmail.com',
      href: 'mailto:harshalpoojari01@gmail.com',
      description: 'Send me an email'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Location',
      value: 'Panvel, Maharashtra, India',
      href: '#',
      description: 'Based in'
    }
  ];

  const socialLinks = [
    {
      icon: <Github className="w-5 h-5" />,
      label: 'GitHub',
      href: 'https://github.com/Harshal-Poojari',
      color: 'hover:text-gray-300',
      description: 'View my code'
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/harshal-poojari/',
      color: 'hover:text-blue-400',
      description: 'Professional network'
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      label: 'X (Twitter)',
      href: 'https://x.com/HarshalPoojari5',
      color: 'hover:text-blue-400',
      description: 'Follow updates'
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'Discord',
      href: 'https://discordapp.com/users/1400838131925778542',
      color: 'hover:text-indigo-400',
      description: 'Chat with me'
    }
  ];

  const stats = [
    { label: 'Projects Completed', value: '50+', icon: <Star className="w-4 h-4" /> },
    { label: 'Response Time', value: '< 24h', icon: <Clock className="w-4 h-4" /> },
    { label: 'Client Satisfaction', value: '100%', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  return (
    <section id="contact" className={`py-16 sm:py-20 lg:py-24 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Let's Work Together
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-6 sm:mb-8" />
          <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed`}>
            Have a project in mind? I'd love to hear about it. Let's discuss how we can bring your ideas to life.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className={`text-center p-4 sm:p-6 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'} border ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="text-indigo-400">{stat.icon}</div>
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div 
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={`p-6 sm:p-8 rounded-2xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'} border ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200'} shadow-lg`}>
              <div className="mb-6 sm:mb-8">
                <h3 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2 sm:mb-3`}>
                  Send me a message
                </h3>
                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Fill out the form below and I'll get back to you within 24 hours.
                </p>
              </div>

              {/* Success/Error Messages */}
              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div 
                    className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <p className="text-green-500 font-medium text-sm sm:text-base">
                        Message sent successfully! I'll get back to you soon.
                      </p>
                    </div>
                  </motion.div>
                )}
                
                {submitStatus === 'error' && (
                  <motion.div 
                    className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-red-500 font-medium text-sm sm:text-base">
                        Something went wrong. Please try again later.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 ${formErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                      placeholder="Your name"
                    />
                    {formErrors.name && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 ${formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                      placeholder="your.email@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 ${formErrors.subject ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    placeholder="What's this about?"
                  />
                  {formErrors.subject && (
                    <p className="mt-2 text-sm text-red-500">{formErrors.subject}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 resize-none ${formErrors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    placeholder="Tell me about your project or idea..."
                  />
                  {formErrors.message && (
                    <p className="mt-2 text-sm text-red-500">{formErrors.message}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02, boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.3)" }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div>
              <h3 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 sm:mb-4`}>
                Let's connect
              </h3>
              <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Prefer to reach out directly? Here are the best ways to get in touch with me.
              </p>
            </div>

            {/* Contact methods */}
            <div className="space-y-3 sm:space-y-4">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.href}
                  className={`block p-4 sm:p-5 ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/80' : 'bg-white border-gray-200 hover:border-indigo-500/50 hover:bg-gray-50'} rounded-xl border transition-all duration-300 group`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 p-2 sm:p-3 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-all duration-300">
                      {info.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                        {info.description}
                      </p>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} text-sm sm:text-base break-all`}>
                        {info.value}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social links */}
            <div>
              <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                Follow me
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative flex flex-col items-center p-3 sm:p-4 ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/50 text-gray-400' : 'bg-white border-gray-200 hover:border-indigo-500/50 text-gray-600'} rounded-xl border ${social.color} transition-all duration-300`}
                    aria-label={social.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="mb-2">{social.icon}</div>
                    <span className="text-xs font-medium">{social.label}</span>
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap transition-opacity duration-200">
                      {social.description}
                      <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability status */}
            <motion.div 
              className={`p-6 ${isDarkMode ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/20' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300/30'} rounded-xl border`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <h4 className="text-green-500 font-semibold text-sm sm:text-base">Available for Projects</h4>
              </div>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-xs sm:text-sm leading-relaxed`}>
                I'm currently open to new opportunities and interesting collaborations. 
                Let's create something amazing together!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;