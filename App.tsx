/**
 * @file App.tsx
 * @description The root component for the Precision Quiz application.
 * It manages the overall state, including theme, application flow (welcome, loading, quiz, results),
 * and handles the core logic for file processing and quiz progression.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Theme, MCQ, AppState, UserAnswer, Difficulty } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import Welcome from './components/Welcome';
import TestRunnerView from './components/TestRunnerView';
import TestResultsView from './components/TestResultsView';
import { extractTextFromFile } from './services/documentProcessor';
import { generateMCQsFromText } from './services/geminiService';

// A reusable feature card component, moved from Welcome.tsx
const FeatureCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 text-center transform hover:-translate-y-1 transition-transform duration-300 h-full">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-500 dark:text-blue-400 mx-auto mb-4">
            {children}
        </div>
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);


const App: React.FC = () => {
  // State for managing the color theme (light/dark)
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  // State to store the generated Multiple Choice Questions
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  // State to handle loading indicators
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State for storing and displaying error messages
  const [error, setError] = useState<string | null>(null);
  // State to keep track of the currently processed file
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  
  // State for managing the application's current view/flow
  const [appState, setAppState] = useState<AppState>('welcome');
  // State for the index of the current question in the quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  // State to store the user's answers during the quiz
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  // State for the number of questions to generate
  const [numQuestions, setNumQuestions] = useState<number>(5);
  // State for the desired difficulty of the questions
  const [difficulty, setDifficulty] = useState<Difficulty | 'Any'>(Difficulty.EASY);


  // Effect to load and apply the saved theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Effect to apply the dark/light theme class to the HTML element and save the theme to localStorage
  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Effect to simulate test execution and transition to results
  useEffect(() => {
    if (appState === 'test_runner') {
      const timer = setTimeout(() => {
        setAppState('test_results');
      }, 2500); // Simulate a 2.5-second test run
      return () => clearTimeout(timer);
    }
  }, [appState]);

  /**
   * Toggles the color theme between light and dark.
   */
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  /**
   * Handles the entire process of file upload, text extraction, and MCQ generation.
   * @param file The file uploaded by the user.
   */
  const handleFileProcess = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setMcqs([]);
    setCurrentFile(file);
    setAppState('loading');

    try {
      // Step 1: Extract text from the uploaded document
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length < 100) {
        throw new Error("Could not extract sufficient text. Please ensure the document is not empty, scanned, or protected.");
      }
      // Step 2: Generate MCQs using the Gemini service
      const generatedMcqs = await generateMCQsFromText(text, numQuestions, difficulty);
      if (generatedMcqs.length === 0) {
        throw new Error("The AI could not generate any questions from this document. Please try a different one.");
      }
      // Step 3: Update state and go directly to the quiz
      setMcqs(generatedMcqs);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setAppState('quiz');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`An error occurred: ${errorMessage}`);
      setAppState('welcome'); // Revert to welcome screen on error
      setMcqs([]);
    } finally {
      setIsLoading(false);
    }
  }, [numQuestions, difficulty]);

  /**
   * Records the user's answer and progresses to the next question or the results screen.
   * @param selectedAnswer The answer chosen by the user for the current question.
   */
  const handleNextQuestion = (selectedAnswer: string) => {
    const currentMcq = mcqs[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentMcq.correctAnswer;

    // Create a record of the user's answer
    const newAnswer: UserAnswer = {
      question: currentMcq.question,
      options: currentMcq.options,
      selectedAnswer,
      correctAnswer: currentMcq.correctAnswer,
      isCorrect,
    };

    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    // Move to the next question or finish the quiz
    if (currentQuestionIndex < mcqs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setAppState('results');
    }
  };

  /**
   * Resets the application state to start a new quiz.
   */
  const handleRestart = () => {
    setAppState('welcome');
    setMcqs([]);
    setCurrentFile(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setError(null);
  };
  
  /**
   * Sets the application state to begin the test running process.
   */
  const handleRunTests = () => {
    setError(null);
    setAppState('test_runner');
  };

  /**
   * Renders the main content of the application based on the current appState.
   */
  const renderContent = () => {
    if (appState === 'loading') {
      return <Loader file={currentFile} />;
    }
    
    switch(appState) {
      case 'quiz':
        return mcqs.length > 0 ? (
          <QuizView
            key={currentQuestionIndex} // Use key to force re-render on question change
            mcq={mcqs[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={mcqs.length}
            onNext={handleNextQuestion}
          />
        ) : null;
      case 'results':
        return <ResultsView userAnswers={userAnswers} onRestart={handleRestart} />;
      case 'test_runner':
        return <TestRunnerView />;
      case 'test_results':
        return <TestResultsView onRestart={handleRestart} />;
      case 'welcome':
      default:
        return (
          <>
            <Welcome />
            <FileUpload onFileProcess={handleFileProcess} disabled={isLoading} />
            
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-x-8 gap-y-4">
                    {/* Number of Questions Dropdown */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <label htmlFor="numQuestions" className="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Number of Questions:
                        </label>
                        <select
                            id="numQuestions"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Number(e.target.value))}
                            disabled={isLoading}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white w-full"
                            aria-label="Select number of questions"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                        </select>
                    </div>

                    {/* Difficulty Level Dropdown */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <label htmlFor="difficulty" className="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Difficulty Level:
                        </label>
                        <select
                            id="difficulty"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as Difficulty | 'Any')}
                            disabled={isLoading}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white w-full"
                            aria-label="Select difficulty level"
                        >
                            <option value="Any">Any</option>
                            <option value={Difficulty.EASY}>Easy</option>
                            <option value={Difficulty.MEDIUM}>Medium</option>
                            <option value={Difficulty.HARD}>Hard</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* How it works section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-8">
                <FeatureCard title="1. Upload Document" description="Drag and drop or select a PDF, DOCX, or TXT file to get started.">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-4-4m4 4l4-4" /></svg>
                </FeatureCard>
                <FeatureCard title="2. AI-Powered Generation" description="Our AI analyzes the content and intelligently generates relevant questions.">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </FeatureCard>
                <FeatureCard title="3. Take the Quiz" description="Test your knowledge with the generated quiz and see your results instantly.">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                </FeatureCard>
            </div>

            {error && <ErrorMessage message={error} />}
          </>
        );
    }
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 font-sans flex flex-col">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex-grow">
        {renderContent()}
      </main>
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p className="mb-2">Powered by Gen AI</p>
        <button
          onClick={handleRunTests}
          className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
          aria-label="Run unit test cases and show report"
        >
          Run Unit Test Cases
        </button>
      </footer>
    </div>
  );
};

export default App;