import React, { createContext, useContext, useState, useEffect } from 'react';

const THEME_KEY = 'app-theme';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: (t: string) => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // الوضع الداكن افتراضي عند أول زيارة
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    document.documentElement.classList.add('dark');
    localStorage.setItem(THEME_KEY, 'dark');
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
