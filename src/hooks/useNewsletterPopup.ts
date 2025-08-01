import { useState, useEffect } from 'react';

export const useNewsletterPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('newsletter-popup-shown');
    if (popupShown) {
      setHasShown(true);
      return;
    }

    // Show popup after 30 seconds or when user scrolls 70% down
    const timer = setTimeout(() => {
      if (!hasShown) {
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem('newsletter-popup-shown', 'true');
      }
    }, 30000); // 30 seconds

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 70 && !hasShown) {
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem('newsletter-popup-shown', 'true');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShown]);

  const closePopup = () => setShowPopup(false);

  return { showPopup, closePopup };
};
