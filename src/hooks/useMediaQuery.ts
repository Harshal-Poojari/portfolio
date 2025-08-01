import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set the initial value
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    // Create event listener function
    const listener = () => setMatches(media.matches);
    
    // Add event listener
    media.addEventListener('change', listener);
    
    // Clean up
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};


