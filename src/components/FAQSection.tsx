import React from 'react';
import Script from 'next/script';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs, className = '' }) => {
  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={`faq-section mt-12 border-t pt-8 ${className}`}>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema, null, 2) }}
      />
      
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="group border-b border-gray-200 dark:border-gray-700 pb-4">
            <summary className="flex justify-between items-center cursor-pointer py-3">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {faq.question}
              </h3>
              <span className="ml-4 text-gray-500 group-open:rotate-180 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </summary>
            <div className="mt-2 text-gray-600 dark:text-gray-300">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};
