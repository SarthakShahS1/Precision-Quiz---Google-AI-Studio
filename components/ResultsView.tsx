/**
 * @file ResultsView.tsx
 * @description The view that displays the user's quiz results.
 * It shows the final score, provides options to restart or review answers,
 * and allows downloading the results.
 */
import React, { useState } from 'react';
import { UserAnswer } from '../types.ts';
import { downloadResultsAsCSV, downloadResultsAsPDF } from '../utils/download.ts';
import { CsvIcon, PdfIcon } from '../constants.tsx';

interface ResultsViewProps {
  userAnswers: UserAnswer[];
  onRestart: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ userAnswers, onRestart }) => {
  // State to toggle the visibility of the answer review section
  const [showReview, setShowReview] = useState(false);

  // Calculate score and percentage
  const score = userAnswers.filter(a => a.isCorrect).length;
  const total = userAnswers.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  /**
   * Determines the color class for the score based on performance.
   * @returns A string of Tailwind CSS color classes.
   */
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  }

  return (
    <div className="animate-fade-in">
        <div className="text-center p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Quiz Complete!</h2>
            
            {/* Score Display */}
            <div className={`text-7xl font-bold ${getScoreColor()}`}>{percentage}%</div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                <button
                    onClick={onRestart}
                    className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105"
                >
                    Start New Quiz
                </button>
                 <button
                    onClick={() => setShowReview(!showReview)}
                    className="w-full sm:w-auto px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-colors"
                >
                    {showReview ? 'Hide' : 'Review'} Answers
                </button>
            </div>
            {/* Download Buttons */}
            <div className="flex justify-center items-center gap-3 mt-6">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Download Results:</span>
                <button
                    onClick={() => downloadResultsAsCSV(userAnswers)}
                    className="flex items-center gap-2 p-2 text-sm font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 focus:ring-4 focus:ring-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900 transition-colors"
                    aria-label="Download results as CSV"
                >
                    <CsvIcon className="w-5 h-5"/>
                </button>
                <button
                    onClick={() => downloadResultsAsPDF(userAnswers)}
                    className="flex items-center gap-2 p-2 text-sm font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 focus:ring-4 focus:ring-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 transition-colors"
                    aria-label="Download results as PDF"
                >
                    <PdfIcon className="w-5 h-5"/>
                </button>
            </div>

            {/* Description moved to bottom */}
            <div className="mt-8 border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                <p className="text-lg text-gray-600 dark:text-gray-400">Here's your performance:</p>
                <p className="font-semibold text-xl mt-1 text-gray-700 dark:text-gray-300">You answered {score} out of {total} questions correctly.</p>
            </div>
        </div>

        {/* Answer Review Section */}
        {showReview && (
            <div className="mt-8 bg-white/30 dark:bg-gray-800/30 p-6 rounded-2xl animate-fade-in border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Answer Review</h3>
                <div className="space-y-6">
                    {userAnswers.map((answer, index) => (
                        <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                           <p className="font-semibold text-lg mb-3">
                               <span className="text-blue-500">{index + 1}.</span> {answer.question}
                           </p>
                           <ul className="space-y-2 text-sm">
                               {answer.options.map((option, i) => (
                                   <li key={i} className={`p-2 rounded-md transition-colors duration-200 ${
                                       option === answer.correctAnswer
                                       ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 font-bold border-l-4 border-green-500' // Correct answer
                                       : option === answer.selectedAnswer
                                       ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 line-through' // Incorrectly selected answer
                                       : 'text-gray-600 dark:text-gray-400' // Other options
                                   }`}>
                                       {String.fromCharCode(65 + i)}. {option}
                                   </li>
                               ))}
                           </ul>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default ResultsView;