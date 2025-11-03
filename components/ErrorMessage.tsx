/**
 * @file ErrorMessage.tsx
 * @description A component for displaying error messages to the user in a standardized format.
 */

import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div
      className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-lg shadow-md dark:bg-red-900/30 dark:text-red-300 dark:border-red-600 my-4 animate-fade-in"
      role="alert"
    >
      <p className="font-bold">An Error Occurred</p>
      {/* Remove the redundant "An error occurred:" prefix if it exists */}
      <p>{message.replace('An error occurred: ', '')}</p>
    </div>
  );
};

export default ErrorMessage;