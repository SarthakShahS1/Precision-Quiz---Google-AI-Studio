/**
 * @file QuizView.tsx
 * @description The main view for taking the quiz. It displays one question at a time,
 * handles user selections, and progresses through the questions.
 */
import React, { useState } from 'react';
import { MCQ } from '../types';

interface QuizViewProps {
  mcq: MCQ;
  questionNumber: number;
  totalQuestions: number;
  onNext: (selectedAnswer: string) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ mcq, questionNumber, totalQuestions, onNext }) => {
  // State to store the user's selected option for the current question
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  // State to track if the user has answered the current question
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  /**
   * Handles the user's selection of an answer option.
   * @param option The text of the selected option.
   */
  const handleOptionClick = (option: string) => {
    // Prevent changing the answer after one has been selected
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
  };
  
  /**
   * Proceeds to the next question after an answer is submitted.
   */
  const handleNextClick = () => {
      if(selectedOption) {
          onNext(selectedOption);
      }
  }

  /**
   * Determines the appropriate CSS class for an option button based on its state.
   * @param option The text of the option.
   * @returns A string of CSS classes.
   */
  const getOptionClass = (option: string) => {
    // Default style for unanswered questions
    if (!isAnswered) {
      return 'bg-gray-100 dark:bg-gray-700/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:border-blue-300 dark:hover:border-blue-600';
    }
    
    // Style for the user's selected option
    if (option === selectedOption) {
      return 'bg-blue-200 dark:bg-blue-800 border-blue-500 ring-2 ring-blue-500/50';
    }
    
    // Fade out unselected options
    return 'bg-gray-100 dark:bg-gray-700/50 opacity-60';
  };

  // Calculate the progress percentage for the progress bar
  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-sm font-semibold">
          <p className="text-blue-600 dark:text-blue-400">Question {questionNumber} of {totalQuestions}</p>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {mcq.difficulty}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-teal-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">
        {mcq.question}
      </h2>

      <div className="space-y-4">
        {mcq.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 text-gray-700 dark:text-gray-200 ${getOptionClass(option)} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
            aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
          >
            <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span> {option}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="mt-8 text-right animate-fade-in">
            <button
                onClick={handleNextClick}
                className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-transform transform hover:scale-105"
            >
                {questionNumber === totalQuestions ? 'Finish Quiz' : 'Next Question'}
            </button>
        </div>
      )}
    </div>
  );
};

export default QuizView;