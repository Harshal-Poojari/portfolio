import React, { createContext, useContext } from 'react';

// You can extend this context later as needed
export const ThemeContext = createContext<{ isDarkMode: boolean }>({
  isDarkMode: false,
});

// Helper hook for convenience
export const useTheme = () => useContext(ThemeContext);
