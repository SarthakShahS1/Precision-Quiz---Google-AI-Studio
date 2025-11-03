
import React from 'react';
import { MCQ, Difficulty } from '../types';
import { downloadAsCSV, downloadAsPDF } from '../utils/download';
import { CsvIcon, PdfIcon } from '../constants';

interface ControlsProps {
  mcqs: MCQ[];
  difficultyFilter: Difficulty | 'All';
  onFilterChange: (filter: Difficulty | 'All') => void;
}

const Controls: React.FC<ControlsProps> = ({ mcqs, difficultyFilter, onFilterChange }) => {
  const handleDownloadCSV = () => {
    downloadAsCSV(mcqs);
  };

  const handleDownloadPDF = () => {
    downloadAsPDF(mcqs);
  };

  return (
    <div className="my-6 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        <label htmlFor="difficulty" className="mr-2 font-medium text-gray-700 dark:text-gray-300">
          Filter by difficulty:
        </label>
        <select
          id="difficulty"
          value={difficultyFilter}
          onChange={(e) => onFilterChange(e.target.value as Difficulty | 'All')}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        >
          <option value="All">All</option>
          <option value={Difficulty.EASY}>Easy</option>
          <option value={Difficulty.MEDIUM}>Medium</option>
          <option value={Difficulty.HARD}>Hard</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 disabled:opacity-50 transition-colors"
          disabled={mcqs.length === 0}
        >
          <CsvIcon className="w-5 h-5"/>
          Download CSV
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:opacity-50 transition-colors"
          disabled={mcqs.length === 0}
        >
          <PdfIcon className="w-5 h-5"/>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Controls;
