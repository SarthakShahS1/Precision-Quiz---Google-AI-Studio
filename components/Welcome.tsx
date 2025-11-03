/**
 * @file Welcome.tsx
 * @description The welcome screen for the application.
 * It provides a brief introduction and instructions on how to use the app.
 */
import React from 'react';

const Welcome: React.FC = () => {
    return (
        // The mb-8 maintains spacing after this component is rendered above the FileUpload component.
        <div className="text-center p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-inner border border-gray-200/30 dark:border-gray-700/30 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Precision Quiz</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Transform any document into an interactive quiz. Just upload your file and let our AI do the rest.
            </p>
        </div>
    );
};

export default Welcome;