/**
 * @file Header.tsx
 * @description The header component for the application.
 * It displays the application logo/title and the theme toggle button.
 */

import React from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon } from '../constants';
import Logo from './Logo';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
        {/* Application Logo and Title */}
        <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto text-gray-800 dark:text-gray-200" />
        </div>
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-300"
          aria-label="Toggle theme"
        >
          {theme === Theme.LIGHT ? (
            <MoonIcon className="w-6 h-6" />
          ) : (
            <SunIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;