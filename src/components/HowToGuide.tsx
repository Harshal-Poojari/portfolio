import React from 'react';
import Script from 'next/script';
import Image from 'next/image';

interface HowToStep {
  name: string;
  text: string;
  image?: string;
  imageAlt?: string;
}

interface HowToGuideProps {
  title: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  className?: string;
}

export const HowToGuide: React.FC<HowToGuideProps> = ({
  title,
  description,
  steps,
  totalTime = 'PT30M',
  className = ''
}) => {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "totalTime": totalTime,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image })
    }))
  };

  if (!steps || steps.length === 0) return null;

  // Format total time for display (e.g., "PT30M" -> "30 minutes")
  const formatTime = (duration: string) => {
    const matches = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!matches) return '';
    
    const hours = matches[1] ? parseInt(matches[1].replace('H', '')) : 0;
    const minutes = matches[2] ? parseInt(matches[2].replace('M', '')) : 0;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    
    return parts.join(' ');
  };

  return (
    <section className={`howto-guide mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 ${className}`}>
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema, null, 2) }}
      />
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">
          📋 {title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">{description}</p>
        {totalTime && (
          <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">
            ⏱️ Estimated time: {formatTime(totalTime) || '30 minutes'}
          </p>
        )}
      </div>
      
      <ol className="space-y-6">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                {step.name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{step.text}</p>
              {step.image && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <Image 
                    src={step.image} 
                    alt={step.imageAlt || step.name}
                    width={800}
                    height={450}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
