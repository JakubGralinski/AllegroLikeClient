import React from 'react';
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';
import { useTheme } from '../context/ThemeContext';

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-300 ease-in-out focus:outline-none shadow-inner
                  ${
                    isDarkMode
                      ? 'bg-slate-700' // Dark mode: Dark blue/navy track
                      : 'bg-sky-400'   // Light mode: Light blue/cyan track
                  }`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`absolute inline-flex items-center justify-center h-6 w-6 rounded-full transform transition-transform duration-300 ease-in-out shadow-md
                    top-1 left-1 
                    ${
                      isDarkMode
                        ? 'translate-x-8 bg-gray-300' // Dark mode: Thumb to the right, light gray/white
                        : 'translate-x-0 bg-yellow-400' // Light mode: Thumb to the left, yellow
                    }`}
      >
        {isDarkMode ? (
          <IoMoonOutline size={16} className="text-slate-800" />
        ) : (
          <IoSunnyOutline size={16} className="text-yellow-800" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggleButton; 