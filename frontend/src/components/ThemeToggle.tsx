import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-6 right-6 p-3 rounded-full glass-effect hover:scale-110 transition-all duration-300 z-50"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <Sun className="w-6 h-6 text-yellow-400 animate-pulse" />
      ) : (
        <Moon className="w-6 h-6 text-slate-600" />
      )}
    </button>
  );
};

export default ThemeToggle;