/**
 * @file constants.tsx
 * @description This file contains reusable SVG icon components used throughout the application.
 * Each icon is a functional React component for easy integration and consistent styling.
 */

import React from 'react';

/**
 * Sun icon, used for the theme toggle button to switch to light mode.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Optional CSS classes to apply to the SVG element.
 */
export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

/**
 * Moon icon, used for the theme toggle button to switch to dark mode.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Optional CSS classes to apply to the SVG element.
 */
export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

/**
 * Upload icon, used prominently in the file input and dropzone area to indicate its function.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Optional CSS classes to apply to the SVG element.
 */
export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

/**
 * CSV icon, used for the "Download CSV" button to provide a visual cue for the file type.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Optional CSS classes to apply to the SVG element.
 */
export const CsvIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);
  
/**
 * PDF icon, used for the "Download PDF" button to provide a visual cue for the file type.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Optional CSS classes to apply to the SVG element.
 */
export const PdfIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
