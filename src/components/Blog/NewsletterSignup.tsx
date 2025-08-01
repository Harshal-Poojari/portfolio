import React, { useState, useCallback, useContext } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, XCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { ThemeContext } from '@/App';
import { cn } from '@/lib/utils';

interface NewsletterSignupProps {
  className?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ className }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        setStatus('error');
        return;
      }

      if (!validateEmail(email)) {
        setErrorMessage('Please enter a valid email address.');
        setStatus('error');
        return;
      }

      setStatus('sending');
      setErrorMessage('');

      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID!,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
          {
            subscriber_email: email.trim(),
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
        );

        setStatus('success');
        setEmail('');
      } catch (error) {
        console.error('EmailJS error:', error);
        setErrorMessage('Failed to subscribe. Please try again later.');
        setStatus('error');
      }
    },
    [email]
  );

  return (
    <motion.div
      className={cn(
        'rounded-lg p-6 shadow-md',
        isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Mail
          className="w-6 h-6 text-indigo-500"
          aria-hidden="true"
        />
        <h3 className="text-lg font-semibold">Subscribe to our Newsletter</h3>
      </div>

      {status === 'success' ? (
        <motion.div
          className={cn(
            'flex items-center gap-2 rounded-md p-4 text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
            'select-none'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="alert"
          aria-live="polite"
        >
          <CheckCircle
            className="w-5 h-5"
            aria-hidden="true"
          />
          Thank you for subscribing! 🎉
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id="newsletter-email"
            name="newsletter-email"
            placeholder="Enter your email"
            className={cn(
              'w-full rounded-md border border-gray-300 px-4 py-2 text-base',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
              isDarkMode
                ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-400'
                : 'bg-white text-gray-900 placeholder-gray-500',
              status === 'error' && 'border-red-500 focus:ring-red-500 focus:border-red-500'
            )}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'sending'}
            aria-invalid={status === 'error'}
            aria-describedby="newsletter-error"
          />
          {status === 'error' && errorMessage && (
            <p
              id="newsletter-error"
              className={cn(
                'mt-2 text-sm text-red-600',
                isDarkMode ? 'text-red-400' : ''
              )}
              role="alert"
            >
              <XCircle
                className="inline w-4 h-4 mr-1 align-text-bottom"
                aria-hidden="true"
              />
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className={cn(
              'mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
              status === 'sending' && 'opacity-70 cursor-wait'
            )}
            aria-live="polite"
          >
            {status === 'sending' ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <Send
                  className="w-4 h-4"
                  aria-hidden="true"
                />
                Subscribe
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default NewsletterSignup;
