/**
 * @file download.ts
 * @description This module contains utility functions for generating and triggering the download
 * of quiz data in various formats (CSV, PDF). It encapsulates the logic for data formatting
 * and browser interactions. For PDF generation, it relies on the global `jspdf` object, which is
 * expected to be loaded via a `<script>` tag in `index.html`.
 */
import { MCQ, UserAnswer } from '../types.ts';

// TypeScript declaration for the global jspdf library.
declare const jspdf: any;

/**
 * Escapes a string for use in a CSV file. It handles commas, quotes, and newlines
 * by enclosing the string in double quotes and escaping existing double quotes.
 * @param str The string to escape.
 * @returns The escaped string, ready for CSV embedding.
 */
const escapeCSV = (str: string | undefined): string => {
  if (str === undefined || str === null) return '';
  let result = str.replace(/"/g, '""'); // Escape double quotes
  if (result.search(/("|,|\n)/g) >= 0) {
    result = `"${result}"`; // Enclose in double quotes if it contains special characters
  }
  return result;
};

/**
 * Creates a blob from data and triggers a file download in the browser.
 * This is a helper function to abstract the browser-specific download mechanism.
 * @param blob The data blob to download.
 * @param filename The desired name of the downloaded file.
 */
const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// --- Functions for downloading generated MCQs ---

/**
 * Creates and triggers a download for the generated MCQs as a CSV file.
 * @param mcqs An array of MCQ objects.
 */
export const downloadAsCSV = (mcqs: MCQ[]) => {
  if (mcqs.length === 0) return;
  const headers = ['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Difficulty'];
  const rows = mcqs.map(mcq => [
    escapeCSV(mcq.question),
    ...mcq.options.map(opt => escapeCSV(opt)),
    escapeCSV(mcq.correctAnswer),
    escapeCSV(mcq.difficulty),
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, 'precision-quiz-questions.csv');
};


/**
 * Creates and triggers a download for the generated MCQs as a PDF file.
 * @param mcqs An array of MCQ objects.
 */
export const downloadAsPDF = (mcqs: MCQ[]) => {
    if (mcqs.length === 0) return;
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text("Precision Quiz - Generated Questions", 14, 22);
  
    const tableData = mcqs.map((mcq, index) => [
      index + 1,
      mcq.question,
      mcq.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join('\n'),
      mcq.correctAnswer,
      mcq.difficulty
    ]);
  
    doc.autoTable({
      head: [['#', 'Question', 'Options', 'Correct Answer', 'Difficulty']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });
  
    doc.save('precision-quiz-questions.pdf');
};


// --- Functions for downloading quiz results ---

/**
 * Creates and triggers a download for the user's quiz results as a CSV file.
 * @param userAnswers An array of UserAnswer objects representing the quiz results.
 */
export const downloadResultsAsCSV = (userAnswers: UserAnswer[]) => {
  if (userAnswers.length === 0) return;
  const headers = ['Question', 'Your Answer', 'Correct Answer', 'Result'];
  const rows = userAnswers.map(answer => [
    escapeCSV(answer.question),
    escapeCSV(answer.selectedAnswer),
    escapeCSV(answer.correctAnswer),
    answer.isCorrect ? 'Correct' : 'Incorrect'
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, 'precision-quiz-results.csv');
};

/**
 * Creates and triggers a download for the user's quiz results as a PDF file.
 * @param userAnswers An array of UserAnswer objects.
 */
export const downloadResultsAsPDF = (userAnswers: UserAnswer[]) => {
    if (userAnswers.length === 0) return;
    const { jsPDF } = jspdf;
    const doc = new jsPDF();

    const score = userAnswers.filter(a => a.isCorrect).length;
    const total = userAnswers.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    doc.setFontSize(18);
    doc.text("Precision Quiz - Results", 14, 22);
    doc.setFontSize(12);
    doc.text(`Score: ${score}/${total} (${percentage}%)`, 14, 32);

    const tableData = userAnswers.map((answer, index) => [
      index + 1,
      answer.question,
      answer.selectedAnswer,
      answer.correctAnswer,
      answer.isCorrect ? 'Correct' : 'Incorrect'
    ]);
  
    doc.autoTable({
        head: [['#', 'Question', 'Your Answer', 'Correct Answer', 'Result']],
        body: tableData,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
        didParseCell: (data: any) => {
            if (data.column.index === 4 && data.cell.section === 'body') {
                if (data.cell.text[0] === 'Correct') {
                    data.cell.styles.textColor = [0, 128, 0]; // Green
                } else {
                    data.cell.styles.textColor = [255, 0, 0]; // Red
                }
            }
        }
    });

    doc.save('precision-quiz-results.pdf');
};