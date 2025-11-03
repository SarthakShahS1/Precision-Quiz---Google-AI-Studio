/**
 * @file index.tsx
 * @description Main entry point for the "Precision Quiz" React application.
 * This file finds the root DOM element and renders the main App component into it.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the root element in the HTML where the React app will be mounted.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Create a React root and render the App component.
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);