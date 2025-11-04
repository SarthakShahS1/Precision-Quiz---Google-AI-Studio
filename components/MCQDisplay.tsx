

import React from 'react';
import { MCQ, Difficulty } from '../types.ts';

interface MCQDisplayProps {
  mcqs: MCQ[];
}

const getDifficultyClass = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case Difficulty.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case Difficulty.HARD:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const MCQCard: React.FC<{ mcq: MCQ, index: number }> = ({ mcq, index }) => {
    return (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <p className="flex-grow font-semibold text-lg text-gray-800 dark:text-gray-100">
                        <span className="text-blue-500">{index + 1}.</span> {mcq.question}
                    </p>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getDifficultyClass(mcq.difficulty)}`}>
                        {mcq.difficulty}
                    </span>
                </div>
                <ul className="space-y-3">
                    {mcq.options.map((option, i) => (
                        <li key={i} className={`p-3 rounded-md text-sm transition-colors duration-200 ${
                            option === mcq.correctAnswer
                            ? 'bg-green-100 dark:bg-green-800/50 border-l-4 border-green-500 font-semibold text-green-800 dark:text-green-200'
                            : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                        }`}>
                            {String.fromCharCode(65 + i)}. {option}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const MCQDisplay: React.FC<MCQDisplayProps> = ({ mcqs }) => {
  if (!mcqs || mcqs.length === 0) {
    return (
      <div className="text-center p-8 bg-white/30 dark:bg-gray-800/30 rounded-lg">
        <h3 className="text-lg font-semibold">No questions to display.</h3>
        <p className="text-gray-600 dark:text-gray-400">Try changing the filter or generating new questions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {mcqs.map((mcq, index) => (
        <MCQCard key={index} mcq={mcq} index={index} />
      ))}
    </div>
  );
};

export default MCQDisplay;