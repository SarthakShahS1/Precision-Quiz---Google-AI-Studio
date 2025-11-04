# Precision Quiz - AI-Powered MCQ Generator

Precision Quiz is a modern web application that leverages the power of Google's Gemini AI to automatically generate multiple-choice questions (MCQs) from user-uploaded documents. It provides an interactive and seamless experience for creating quizzes from study materials, articles, or any text-based document.

## Features

- **AI-Powered Generation**: Uses the Gemini API with a carefully engineered prompt to create relevant and high-quality MCQs. The system instructs the AI to adhere to a strict JSON schema, ensuring the output is always structured correctly with a question, four options, a correct answer, and a difficulty rating. This schema enforcement makes the generation process highly reliable.
- **Multiple File Formats**: Supports uploading PDF, DOCX, and TXT files.
- **Customizable Quizzes**: Users can specify the number of questions and the desired difficulty level (Easy, Medium, Hard).
- **Interactive Quiz Interface**: A clean, step-by-step quiz view with a progress bar to test your knowledge.
- **Instant Results & Review**: Get an immediate score upon completion and review your answers against the correct ones.
- **Data Export**: Download the generated questions or your quiz results in both CSV and PDF formats.
- **Responsive Design**: Fully responsive layout that works on desktops, tablets, and mobile devices.
- **Dual Themes**: Switch between a sleek Light and a comfortable Dark theme to suit your preference.
- **In-App Test Reporting**: View a simulated unit test execution report, including code coverage statistics, directly within the application.

## Tech Stack

- **Frontend**:
  - **React 19.2.0**: Latest version of the JavaScript library for building user interfaces.
  - **TypeScript 5.8.2**: Adds static typing to JavaScript for improved code quality and maintainability.
  - **Tailwind CSS**: Utility-first CSS framework loaded via CDN for rapid UI development.
  - **Vite 6.2.0**: Modern build tool and development server for fast development experience.
- **AI & Document Processing**:
  - **Google Gemini API (`@google/genai` v1.28.0)**: The core AI model for question generation with structured schema support.
  - **pdf.js (v2.11.338, Client-side)**: For parsing and extracting text from PDF files directly in the browser.
  - **mammoth.js (v1.4.18, Client-side)**: For extracting text from DOCX files on the client side.
- **PDF Generation**:
  - **jspdf (v2.5.1) & jspdf-autotable (v3.5.25)**: For generating downloadable PDF files of questions and results.

## Architecture

This project is built with a **serverless, client-side architecture** that runs entirely in the browser using modern ES modules and CDN-based dependencies. The application uses:

- **Vite** as the development server and build tool
- **CDN-based libraries** for document processing (pdf.js, mammoth.js, jspdf) loaded via HTML script tags
- **Environment variable injection** through Vite's configuration for API key management
- **ES Module imports** for React and dependencies via import maps

## How to Run the Project

### Prerequisites

1. **Node.js**: Ensure you have Node.js installed (version 16+ recommended)
2. **Google AI API Key**: You'll need a valid Google AI Studio API key

### 1. Set Up Your API Key

In the root of the project folder, open the `.env` file and replace `your_actual_api_key_here` with your key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 2. Install Dependencies

Open your terminal in the project's root directory and run:

```bash
npm install
```

### 3. Run the Development Server

Start the local development server:

```bash
npm run dev
```

### 4. Build for Production

To build the project for production:

```bash
npm run build
```

### 5. Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### 6. Open in Browser

The development server will start on port 3000. Open your web browser and navigate to `http://localhost:3000`.

**Note**: An internet connection is required for the application to communicate with the Google Gemini API and load CDN dependencies. The API key must be configured for the application to function.

## Project Structure

```
├── App.tsx                    # Main application component
├── index.tsx                  # Application entry point
├── types.ts                   # TypeScript type definitions
├── constants.tsx              # Application constants
├── components/                # React components
│   ├── Controls.tsx           # Quiz control components
│   ├── ErrorMessage.tsx       # Error display component
│   ├── FileUpload.tsx         # File upload interface
│   ├── Header.tsx             # Application header
│   ├── Loader.tsx             # Loading spinner component
│   ├── Logo.tsx               # Application logo
│   ├── MCQDisplay.tsx         # MCQ display component
│   ├── QuizView.tsx           # Main quiz interface
│   ├── ResultsView.tsx        # Quiz results display
│   ├── TestResultsView.tsx    # Test execution report
│   ├── TestRunnerView.tsx     # Test runner interface
│   └── Welcome.tsx            # Welcome screen
├── services/                  # Core services
│   ├── documentProcessor.ts   # Document parsing service
│   └── geminiService.ts       # Gemini AI integration
├── utils/                     # Utility functions
│   └── download.ts            # Export functionality
└── tests/                     # Test files (conceptual)
    ├── App.test.tsx
    ├── documentProcessor.test.ts
    ├── download.test.ts
    ├── geminiService.test.ts
    ├── QuizView.test.tsx
    └── ResultsView.test.tsx
```

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

The project includes test files within the `/tests` directory, written with a Jest-like syntax. Due to the simplified architecture, a test runner is not currently configured. However, the test files are provided to demonstrate the testing logic and can be run in a standard React testing setup.

To run these tests in a compatible environment:
1.  Set up a testing environment (e.g., `npm install --save-dev jest @testing-library/react @testing-library/jest-dom ts-jest @types/jest`).
2.  Configure Jest to work with TypeScript and mock necessary modules.
3.  Run the test command: `npm test` or `jest`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.