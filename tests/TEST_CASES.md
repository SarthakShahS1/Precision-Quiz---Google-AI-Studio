# Test Cases Documentation - Precision Quiz Application

**Project:** Precision Quiz - Google AI Studio  
**Repository:** SarthakShahS1/Precision-Quiz---Google-AI-Studio  
**Date:** November 4, 2025  
**Version:** 0.0.0  

## Table of Contents
1. [Overview](#overview)
2. [Test Environment Setup](#test-environment-setup)
3. [Positive Flow Test Cases](#positive-flow-test-cases)
4. [Negative Flow Test Cases](#negative-flow-test-cases)
5. [Test Coverage Summary](#test-coverage-summary)
6. [Test Data](#test-data)

---

## Overview

This document contains comprehensive test cases for the Precision Quiz application, covering both positive and negative flows across all major components and services.

**Application Flow:**
```
File Upload → Document Processing → AI Quiz Generation → Quiz Taking → Results Display → Export
```

---

## Test Environment Setup

### Prerequisites
```bash
# Install dependencies
npm install

# Add testing dependencies (required)
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event jest-environment-jsdom
```

### Mock Requirements
- Google Gemini AI API
- File reading APIs (PDF.js, Mammoth.js)
- Browser APIs (localStorage, Blob, URL)

---

## Positive Flow Test Cases

### 🎯 **APP COMPONENT** - [`App.tsx`](App.tsx)

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|----------------|----------|
| **APP-P-001** | **Initial App Rendering** | | High |
| | **Steps:** 1. Load the application | Welcome screen displays with file upload area | |
| | **Verify:** Welcome message, FileUpload component, Logo component visible | | |
| **APP-P-002** | **Complete Happy Path Flow** | | Critical |
| | **Steps:** 1. Upload valid PDF file<br>2. Wait for processing<br>3. Answer all quiz questions<br>4. View results | Successful navigation: Welcome → Loading → Quiz → Results | |
| | **Verify:** Each screen renders correctly, data persists between screens | | |
| **APP-P-003** | **Theme Toggle Functionality** | | Medium |
| | **Steps:** 1. Click theme toggle button<br>2. Verify dark mode<br>3. Toggle back to light mode | Theme changes applied, preference saved to localStorage | |
| | **Verify:** CSS classes updated, localStorage contains theme preference | | |

### 📄 **DOCUMENT PROCESSOR** - [`services/documentProcessor.ts`](services/documentProcessor.ts)

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|----------------|----------|
| **DOC-P-001** | **PDF File Processing** | | High |
| | **Steps:** 1. Upload valid PDF file<br>2. Call extractTextFromFile() | Text extracted successfully from PDF | |
| | **Verify:** Returned string contains readable text content | | |
| **DOC-P-002** | **DOCX File Processing** | | High |
| | **Steps:** 1. Upload valid DOCX file<br>2. Call extractTextFromFile() | Text extracted successfully from DOCX | |
| | **Verify:** Returned string contains readable text content | | |
| **DOC-P-003** | **TXT File Processing** | | Medium |
| | **Steps:** 1. Upload valid TXT file<br>2. Call extractTextFromFile() | Text extracted successfully from TXT | |
| | **Verify:** Returned string matches file content | | |

### 🤖 **GEMINI AI SERVICE** - [`services/geminiService.ts`](services/geminiService.ts)

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|----------------|----------|
| **AI-P-001** | **Successful MCQ Generation** | | Critical |
| | **Steps:** 1. Call generateMCQsFromText() with valid text<br>2. Specify difficulty level | Valid MCQ array returned with correct difficulty | |
| | **Verify:** Questions have 4 options, correct answers, proper formatting | | |
| **AI-P-002** | **Mixed Quality Data Filtering** | | High |
| | **Steps:** 1. Mock API returns mix of valid/invalid MCQs<br>2. Process response | Only valid MCQs returned, invalid ones filtered out | |
| | **Verify:** All returned MCQs meet validation criteria | | |
| **AI-P-003** | **Empty Response Handling** | | Medium |
| | **Steps:** 1. Mock API returns empty array<br>2. Process response | Empty array returned gracefully, no errors thrown | |
| | **Verify:** Function completes without throwing exceptions | | |

### 📝 **QUIZ VIEW COMPONENT** - [`components/QuizView.tsx`](components/QuizView.tsx)

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|----------------|----------|
| **QUIZ-P-001** | **Question Display** | | High |
| | **Steps:** 1. Render QuizView with MCQ data | Question details displayed correctly | |
| | **Verify:** Question text, options, difficulty, progress shown | | |
| **QUIZ-P-002** | **Option Selection** | | Critical |
| | **Steps:** 1. Click on an answer option | Option selected, "Next" button appears | |
| | **Verify:** Selected option highlighted, other options disabled | | |
| **QUIZ-P-003** | **Progress Bar Calculation** | | Medium |
| | **Steps:** 1. Render with questionNumber=3, totalQuestions=10 | Progress bar shows 30% width | |
| | **Verify:** Progress bar width = (3/10) * 100% = 30% | | |
| **QUIZ-P-004** | **Answer Submission** | | Critical |
| | **Steps:** 1. Select answer<br>2. Click "Next Question" | onNext callback called with selected answer | |
| | **Verify:** Correct answer value passed to parent component | | |
| **QUIZ-P-005** | **Last Question Handling** | | High |
| | **Steps:** 1. Render last question (questionNumber = totalQuestions) | "Finish Quiz" button shown instead of "Next Question" | |
| | **Verify:** Button text changes appropriately | | |
| **QUIZ-P-006** | **All Options Disabled After Selection** | | Medium |
| | **Steps:** 1. Select any option | All option buttons become disabled | |
| | **Verify:** Cannot select multiple options | | |

### 📊 **RESULTS VIEW COMPONENT** - [`components/ResultsView.tsx`](components/ResultsView.tsx)

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|----------------|----------|
| **RES-P-001** | **Score Calculation Display** | | Critical |
| | **Steps:** 1. Render with userAnswers (2 correct out of 3 total) | Shows "67%" and "2 out of 3 questions correctly" | |
| | **Verify:** Percentage and summary text accurate | | |
| **RES-P-002** | **Restart Functionality** | | High |
| | **Steps:** 1. Click "Start New Quiz" button | onRestart callback triggered | |
| | **Verify:** Parent component receives restart signal | | |
| **RES-P-003** | **Answer Review Toggle** | | Medium |
| | **Steps:** 1. Click "Review Answers"<br>2. Click "Hide Answers" | Review section toggles visibility | |
| | **Verify:** Answer details show/hide correctly | | |
| **RES-P-004** | **Download Functionality** | | Medium |
| | **Steps:** 1. Click CSV download button<br>2. Click PDF download button | Download functions called with correct data | |
| | **Verify:** downloadResultsAsCSV() and downloadResultsAsPDF() invoked | | |
| **RES-P-005** | **Score Color Coding** | | Low |
| | **Steps:** 1. Test with high score (>80%): green<br>2. Medium score (50-80%): yellow<br>3. Low score (<50%): red | Correct color classes applied based on score | |
| | **Verify:** CSS classes match score ranges | | |

### 💾 **DOWNLOAD UTILITIES** - [`utils/download.ts`](utils/download.ts)

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|----------------|----------|
| **DL-P-001** | **CSV String Escaping** | | Medium |
| | **Steps:** 1. Test escapeCSV() with various inputs:<br>- Simple text<br>- Text with commas<br>- Text with quotes<br>- Text with newlines | Proper CSV escaping applied | |
| | **Verify:** Special characters escaped according to CSV standards | | |
| **DL-P-002** | **CSV Generation** | | High |
| | **Steps:** 1. Call downloadAsCSV() with MCQ data | CSV file generated and download triggered | |
| | **Verify:** CSV contains headers and properly formatted data | | |
| **DL-P-003** | **PDF Generation** | | High |
| | **Steps:** 1. Call downloadAsPDF() with results data | PDF file generated and download triggered | |
| | **Verify:** PDF contains formatted quiz results | | |

---

## Negative Flow Test Cases

### ❌ **APP COMPONENT ERROR HANDLING**

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|----------------|----------|
| **APP-N-001** | **File Processing Error** | | High |
| | **Steps:** 1. Upload corrupted file<br>2. Mock document processor to throw error | Error message displayed, app returns to welcome screen | |
| | **Verify:** User sees error message, can try again | | |
| **APP-N-002** | **AI Service Error** | | High |
| | **Steps:** 1. Upload valid file<br>2. Mock AI service to fail | Error message displayed, app returns to welcome screen | |
| | **Verify:** Graceful error handling, no app crash | | |

### 📄 **DOCUMENT PROCESSOR ERROR HANDLING**

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|----------------|----------|
| **DOC-N-001** | **Unsupported File Type** | | High |
| | **Steps:** 1. Upload image file (PNG/JPG)<br>2. Call extractTextFromFile() | Error thrown: "Unsupported file type" | |
| | **Verify:** Appropriate error message, function rejects | | |
| **DOC-N-002** | **Corrupted File Error** | | Medium |
| | **Steps:** 1. Upload corrupted PDF/DOCX<br>2. Call extractTextFromFile() | Parser error propagated to caller | |
| | **Verify:** Original error message preserved and thrown | | |

### 🤖 **AI SERVICE ERROR HANDLING**

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|----------------|----------|
| **AI-N-001** | **Malformed Response Data** | | High |
| | **Steps:** 1. Mock API returns MCQ with wrong option count<br>2. Process response | Error thrown for malformed data | |
| | **Verify:** Validation catches incorrect option count | | |
| **AI-N-002** | **Invalid Correct Answer** | | High |
| | **Steps:** 1. Mock API returns MCQ where correctAnswer not in options<br>2. Process response | Error thrown for invalid correct answer | |
| | **Verify:** Validation catches answer not in options list | | |
| **AI-N-003** | **Non-JSON Response** | | Medium |
| | **Steps:** 1. Mock API returns plain text instead of JSON<br>2. Process response | Error thrown: "Failed to generate MCQs" | |
| | **Verify:** JSON parsing error handled gracefully | | |
| **AI-N-004** | **API Failure** | | High |
| | **Steps:** 1. Mock API to throw network error<br>2. Call generateMCQsFromText() | Error thrown with appropriate message | |
| | **Verify:** Network errors propagated with user-friendly message | | |

### 📊 **EDGE CASES**

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|----------------|----------|
| **EDGE-N-001** | **Zero Questions Scenario** | | Medium |
| | **Steps:** 1. Render ResultsView with empty userAnswers array | Shows "0%" score and "0 out of 0 questions" | |
| | **Verify:** No division by zero errors, graceful display | | |
| **EDGE-N-002** | **Empty Download Data** | | Low |
| | **Steps:** 1. Call download functions with empty arrays | Functions complete without errors | |
| | **Verify:** Empty files generated, no crashes | | |

---

## Test Coverage Summary

### 📈 **Coverage Metrics**

| **Component/Service** | **Positive Cases** | **Negative Cases** | **Total Cases** | **Priority** |
|----------------------|-------------------|-------------------|-----------------|--------------|
| App Component | 3 | 2 | 5 | Critical |
| Document Processor | 3 | 2 | 5 | High |
| Gemini AI Service | 3 | 4 | 7 | Critical |
| Quiz View Component | 6 | 0 | 6 | High |
| Results View Component | 5 | 0 | 5 | High |
| Download Utilities | 3 | 0 | 3 | Medium |
| Edge Cases | 0 | 2 | 2 | Medium |
| **TOTAL** | **23** | **10** | **33** | |

### 🎯 **Test Priority Distribution**

- **Critical:** 10 test cases (30%)
- **High:** 15 test cases (45%) 
- **Medium:** 7 test cases (21%)
- **Low:** 1 test case (3%)

---

## Test Data

### 📋 **Sample Test Data**

#### Mock MCQ Data
```typescript
const mockMCQ: MCQ = {
  question: 'What is the capital of France?',
  options: ['London', 'Berlin', 'Paris', 'Madrid'],
  correctAnswer: 'Paris',
  difficulty: Difficulty.EASY
};
```

#### Mock User Answers
```typescript
const mockUserAnswers: UserAnswer[] = [
  { question: 'Q1', options: ['a', 'b'], selectedAnswer: 'a', correctAnswer: 'a', isCorrect: true },
  { question: 'Q2', options: ['c', 'd'], selectedAnswer: 'c', correctAnswer: 'd', isCorrect: false },
  { question: 'Q3', options: ['e', 'f'], selectedAnswer: 'f', correctAnswer: 'f', isCorrect: true }
];
```

#### Test Files for Upload
```
✅ Valid Files:
- sample.pdf (valid PDF with text)
- document.docx (valid DOCX with content)
- notes.txt (plain text file)

❌ Invalid Files:
- corrupted.pdf (corrupted PDF file)
- image.png (unsupported image file)
- empty.txt (empty file)
```

### 🔧 **Mock Configurations**

#### Gemini AI Mock Responses
```typescript
// Success response
{ text: JSON.stringify([mockMCQ]) }

// Malformed response  
{ text: JSON.stringify([{ question: 'Q', options: ['a', 'b'] }]) } // Missing options

// Error response
throw new Error('API service unavailable')
```

---

## Implementation Notes

1. **Test Files Location:** All test files are in [`tests/`](tests/) directory
2. **Current Status:** Test files are conceptual and use `console.assert`
3. **Next Steps:** Set up Jest + React Testing Library for actual test execution
4. **Mocking Strategy:** Mock external APIs, file operations, and browser APIs
5. **Continuous Integration:** Tests should run on every commit to main branch

---

**Document Version:** 1.0  
**Last Updated:** November 4, 2025  