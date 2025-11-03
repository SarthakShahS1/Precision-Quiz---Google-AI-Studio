# Precision Quiz - AI-Powered MCQ Generator

Precision Quiz is a modern web application that leverages the power of Google's Gemini AI to automatically generate multiple-choice questions (MCQs) from user-uploaded documents. It provides an interactive and seamless experience for creating quizzes from study materials, articles, or any text-based document.

## Features

- **AI-Powered Generation**: Uses the Gemini API to intelligently create relevant and high-quality MCQs from document content.
- **Multiple File Formats**: Supports uploading PDF, DOCX, and TXT files.
- **Customizable Quizzes**: Users can specify the number of questions and the desired difficulty level (Easy, Medium, Hard).
- **Interactive Quiz Interface**: A clean, step-by-step quiz view with a progress bar to test your knowledge.
- **Instant Results & Review**: Get an immediate score upon completion and review your answers against the correct ones.
- **Data Export**: Download the generated questions or your quiz results in both CSV and PDF formats.
- **Responsive Design**: Fully responsive layout that works on desktops, tablets, and mobile devices.
- **Dual Themes**: Switch between a sleek Light and a comfortable Dark theme to suit your preference.

## Tech Stack

- **Frontend**:
  - **React**: A JavaScript library for building user interfaces.
  - **TypeScript**: Adds static typing to JavaScript for improved code quality and maintainability.
  - **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **AI & Document Processing**:
  - **Google Gemini API (`@google/genai`)**: The core AI model for question generation.
  - **pdf.js (Client-side)**: For parsing and extracting text from PDF files directly in the browser.
  - **mammoth.js (Client-side)**: For extracting text from DOCX files on the client side.
- **PDF Generation**:
  - **jspdf & jspdf-autotable**: For generating downloadable PDF files of questions and results.

## How to Run the Project

This project is built with a simplified, serverless architecture that runs entirely in the browser. There is no build step or server-side dependency management required.

1.  Ensure all project files (`index.html`, `index.tsx`, `App.tsx`, etc.) are in the same directory.
2.  Serve the `index.html` file using a local web server. A simple way to do this is with Python:
    ```bash
    # If you have Python 3
    python -m http.server
    ```
3.  Open your web browser and navigate to the local address provided by the server (e.g., `http://localhost:8000`).
4.  The application will load and be ready to use.

**Note**: An internet connection is required for the application to communicate with the Google Gemini API.

## Unit Test Cases

This section outlines a comprehensive suite of conceptual unit tests for the application's key components and services. These tests are designed to ensure reliability, cover edge cases, and validate error handling.

### `tests/App.test.tsx` (Main Component)
-   **Core Flow**:
    -   Should render the `Welcome` and `FileUpload` components on initial load.
    -   Should transition `appState` from `welcome` -> `loading` -> `quiz` -> `results` during a successful user journey.
    -   Should call `handleRestart` from the `ResultsView` and correctly reset the state back to `welcome`.
-   **State Management**:
    -   Should correctly toggle the theme between `light` and `dark` and persist the choice to `localStorage`.
    -   Should update the number of questions and difficulty level based on user selection in the dropdowns.
-   **Error Handling**:
    -   Should display an error message and revert to the `welcome` state if `extractTextFromFile` fails.
    -   Should display an error and revert to `welcome` if `generateMCQsFromText` throws an error.

### `tests/geminiService.test.ts`
-   **API Interaction**:
    -   Should construct a valid prompt including user-specified number of questions and difficulty.
    -   Should correctly parse a valid JSON response from the API into an array of `MCQ` objects.
-   **Data Validation & Error Handling**:
    -   Should throw a specific error if the API call fails or returns a non-200 status.
    -   Should throw an error if the API returns a non-JSON string.
    -   Should throw a "malformed data" error if the JSON object's structure is correct but validation fails (e.g., `correctAnswer` is not one of the `options`).
    -   Should successfully filter out invalid MCQs from a mixed payload (some valid, some invalid) and return only the valid ones.
    -   Should handle an empty array `[]` response from the API gracefully.

### `tests/documentProcessor.test.ts`
-   **File Routing**:
    -   Should correctly route a `File` with MIME type `application/pdf` to the PDF parser.
    -   Should correctly route a `File` with MIME type `application/vnd.openxmlformats-officedocument.wordprocessingml.document` to the DOCX parser.
    -   Should correctly route a `File` with MIME type `text/plain` to the TXT parser.
-   **Error Handling**:
    -   Should throw an "Unsupported file type" error for any other file type (e.g., `image/png`).
    -   Should correctly propagate errors from the underlying parsers (e.g., if a file is encrypted, corrupted, or unreadable).

### `tests/QuizView.test.tsx` (Component Interaction)
-   **Functionality**:
    -   Should display the question number, total questions, difficulty, and question text correctly.
    -   Should show the "Next Question" button only after an answer has been selected.
    -   Should disable all options after one has been clicked to prevent changing the answer.
    -   Should call the `onNext` prop with the correct selected answer when the "Next" button is clicked.
-   **State & Styling**:
    -   Should apply the correct styles to selected, correct, and incorrect answers once a choice is made.
    -   Should calculate and display the progress bar's width accurately based on the current question number.

### `tests/ResultsView.test.tsx` (Component Interaction)
-   **Display Logic**:
    -   Should display the correct score percentage and summary text.
    -   Should apply the correct color to the score based on the percentage (e.g., green for >=80%, yellow for >=50%, red for <50%).
    -   Should correctly handle the edge case of zero questions to avoid division-by-zero errors.
-   **Interactivity**:
    -   Should call the `onRestart` handler when the "Start New Quiz" button is clicked.
    -   Should correctly toggle the visibility of the answer review section.
    -   Should trigger the `downloadResultsAsCSV` and `downloadResultsAsPDF` functions when their respective buttons are clicked.

### `tests/download.test.ts` (Utilities)
-   **CSV Generation**:
    -   `escapeCSV` should correctly handle strings containing commas, double quotes, and newlines.
    -   `downloadAsCSV` and `downloadResultsAsCSV` should generate a correctly formatted CSV string.
-   **PDF Generation**:
    -   `downloadAsPDF` and `downloadResultsAsPDF` should call the `jspdf` library with correctly structured data for the table body and headers.
-   **Edge Cases**:
    -   All download functions should handle an empty array of data gracefully without crashing, producing a file with only headers.

## Running Tests

The project includes test files within the `/tests` directory, written with a Jest-like syntax. Due to the sandboxed environment, a test runner is not configured. However, the test files are provided to demonstrate the testing logic and can be run in a standard React testing setup (e.g., Create React App with Jest and React Testing Library).

To run these tests in a compatible environment:
1.  Set up a testing environment (e.g., `npm install --save-dev jest @testing-library/react @testing-library/jest-dom ts-jest @types/jest`).
2.  Configure Jest to work with TypeScript and mock necessary modules.
3.  Run the test command: `npm test` or `jest`.
