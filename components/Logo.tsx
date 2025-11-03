/**
 * @file Logo.tsx
 * @description Defines the SVG logo component for the "Precision Quiz" application.
 */

import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 320 50"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Precision Quiz Logo"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'rgb(20, 184, 166)', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    
    {/* Icon: A target symbol */}
    <circle cx="25" cy="25" r="18" fill="none" stroke="url(#logoGradient)" strokeWidth="6" />
    <circle cx="25" cy="25" r="8" fill="url(#logoGradient)" />
    
    {/* Text: "Precision Quiz" */}
    <text
      x="55"
      y="35"
      fontFamily="sans-serif"
      fontSize="28"
      fontWeight="bold"
      fill="currentColor"
    >
      Precision Quiz
    </text>
  </svg>
);

export default Logo;
