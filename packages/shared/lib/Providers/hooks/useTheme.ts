import { ThemeProviderContext } from '../';

import { useContext, useEffect } from 'react';

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  useEffect(() => {
    const handler = (event: MediaQueryListEvent) => {
      if (event.matches) {
        context.setTheme('dark');
      } else {
        context.setTheme('light');
      }
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handler);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handler);
    };
  }, []);

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
