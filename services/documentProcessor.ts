/**
 * @file documentProcessor.ts
 * @description This service is responsible for client-side text extraction from various file formats.
 * It acts as a router, detecting the file's MIME type and delegating the extraction task to the
 * appropriate specialized parser. This module depends on the `pdf.js` and `mammoth.js` libraries,
 * which are loaded globally via `<script>` tags in `index.html`.
 */

// TypeScript declarations for global libraries loaded via script tags.
declare const pdfjsLib: any;
declare const mammoth: any;

/**
 * Extracts text from a file by routing it to the appropriate parser based on its MIME type.
 * @param file The file (PDF, DOCX, or TXT) from which to extract text.
 * @returns A promise that resolves with the extracted text as a string.
 * @throws An error if the file type is unsupported or if parsing fails.
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  if (file.type === 'application/pdf') {
    return extractTextFromPdf(file);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return extractTextFromDocx(file);
  } else if (file.type === 'text/plain') {
    return extractTextFromTxt(file);
  } else {
    throw new Error('Unsupported file type.');
  }
};

/**
 * Extracts text content from a PDF file using the pdf.js library.
 * @param file The PDF file.
 * @returns A promise that resolves with the combined text from all pages.
 */
const extractTextFromPdf = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error('Failed to read PDF file.'));
      }
      try {
        const pdf = await pdfjsLib.getDocument({ data: event.target.result }).promise;
        let textContent = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          // Concatenate the string content of each text item
          textContent += text.items.map((item: any) => item.str).join(' ');
        }
        resolve(textContent);
      } catch (error) {
        reject(new Error('Could not parse PDF file. It might be corrupted or encrypted.'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file.'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Extracts text content from a DOCX file using the mammoth.js library.
 * @param file The DOCX file.
 * @returns A promise that resolves with the raw text content.
 */
const extractTextFromDocx = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            if (!event.target?.result) {
                return reject(new Error('Failed to read DOCX file.'));
            }
            try {
                const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
                resolve(result.value);
            } catch (error) {
                reject(new Error('Could not parse DOCX file.'));
            }
        };
        reader.onerror = () => reject(new Error('Error reading file.'));
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Extracts text content from a plain TXT file.
 * @param file The TXT file.
 * @returns A promise that resolves with the file's content as a string.
 */
const extractTextFromTxt = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        resolve(event.target.result);
      } else {
        reject(new Error('Failed to read TXT file.'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file.'));
    reader.readAsText(file);
  });
};
