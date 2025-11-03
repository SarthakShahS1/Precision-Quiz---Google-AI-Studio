/**
 * @file Loader.tsx
 * @description A loading indicator component displayed during asynchronous operations,
 * such as file processing and AI-based MCQ generation.
 */

import React from 'react';

interface LoaderProps {
  file: File | null;
}

const Loader: React.FC<LoaderProps> = ({ file }) => {
  return (
    <div className="text-center p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg animate-fade-in">
      <div className="flex justify-center items-center mb-4">
        {/* Animated spinner icon */}
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Generating Your Quiz...</h3>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        The AI is analyzing {file ? <span className="font-medium">"{file.name}"</span> : "your document"}. This may take a moment.
      </p>
    </div>
  );
};

export default Loader;