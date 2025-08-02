import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Send, MapPin, Phone, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { ThemeContext } from '../App';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  
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
      href: 'mailto:harshalpoojari01@gmail.com'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Location',
      value: 'Panvel, Maharashtra, India',
      href: '#'
    }
  ];

  const socialLinks = [
    {
      icon: <Github className="w-6 h-6" />,
      label: 'GitHub',
      href: '#',
      color: 'hover:text-gray-300'
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      label: 'LinkedIn',
      href: '#',
      color: 'hover:text-blue-400'
    },
    {
      icon: <Twitter className="w-6 h-6" />,
      label: 'Twitter',
      href: '#',
      color: 'hover:text-blue-400'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      label: 'Discord',
      href: '#',
      color: 'hover:text-indigo-400'
    }
  ];

  return (
    <section id="contact" className={`py-20 px-6 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-8" />
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Ready to bring your next project to life? Let's discuss how we can work together to create something amazing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Send me a message</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Fill out the form below and I'll get back to you as soon as possible.
              </p>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div 
                  className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-green-500 font-medium">Message sent successfully! I'll get back to you soon.</p>
                  </div>
                </motion.div>
              )}
              
              {submitStatus === 'error' && (
                <motion.div 
                  className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-500 font-medium">Something went wrong. Please try again later.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                    className={`w-full px-4 py-3 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200 ${formErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Your name"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
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
                    className={`w-full px-4 py-3 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200 ${formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="your.email@example.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
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
                  className={`w-full px-4 py-3 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200 ${formErrors.subject ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="What's this about?"
                />
                {formErrors.subject && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.subject}</p>
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
                  rows={6}
                  className={`w-full px-4 py-3 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200 resize-none ${formErrors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Tell me about your project or idea..."
                />
                {formErrors.message && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Let's connect</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Prefer to reach out directly? Here are the best ways to get in touch with me.
              </p>
            </div>

            {/* Contact methods */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  className={`flex items-center space-x-4 p-4 ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/50' : 'bg-white border-gray-200 hover:border-indigo-500/50'} rounded-lg border transition-all duration-300 group`}
                >
                  <div className="text-indigo-400 group-hover:text-purple-400 transition-colors duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <p className={isDarkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>{info.label}</p>
                    <p className={isDarkMode ? 'text-white font-medium' : 'text-gray-800 font-medium'}>{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social links */}
            <div>
              <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Follow me</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`p-3 ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/50 text-gray-400' : 'bg-white border-gray-200 hover:border-indigo-500/50 text-gray-600'} rounded-lg border ${social.color} transition-all duration-300 transform hover:scale-110`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Availability status */}
            <div className={`p-6 ${isDarkMode ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/20' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300/30'} rounded-lg border`}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <h4 className="text-green-500 font-semibold">Available for Projects</h4>
              </div>
              <p className={isDarkMode ? 'text-gray-300 text-sm' : 'text-gray-700 text-sm'}>
                I'm currently open to new opportunities and interesting collaborations. 
                Let's create something amazing together!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;