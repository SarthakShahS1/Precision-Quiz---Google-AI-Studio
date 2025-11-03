/**
 * @file geminiService.ts
 * @description This service handles all interactions with the Google Gemini API.
 * It's responsible for sending document text to the AI and parsing the generated
 * multiple-choice questions.
 */

import { GoogleGenAI, Type } from "@google/genai";
import { MCQ, Difficulty } from '../types';

// Retrieve the API key from environment variables.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

// Initialize the GoogleGenAI client with the API key.
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Defines the expected JSON schema for the AI's response.
 * This ensures the AI returns data in a structured and predictable format.
 */
const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: 'The multiple-choice question.'
      },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'An array of exactly 4 possible answers.'
      },
      correctAnswer: {
        type: Type.STRING,
        description: 'The correct answer, which must be one of the strings from the options array.'
      },
      difficulty: {
        type: Type.STRING,
        enum: ['Easy', 'Medium', 'Hard'],
        description: 'The difficulty level of the question.'
      }
    },
    required: ["question", "options", "correctAnswer", "difficulty"],
  }
};

/**
 * Generates a set of multiple-choice questions from a given text using the Gemini model.
 * @param text The source text extracted from a document.
 * @param numQuestions The number of questions to generate.
 * @param difficulty The desired difficulty for the questions.
 * @returns A promise that resolves to an array of MCQ objects.
 * @throws An error if the API call fails or returns malformed data.
 */
export const generateMCQsFromText = async (text: string, numQuestions: number, difficulty: Difficulty | 'Any'): Promise<MCQ[]> => {
  // Conditionally set the difficulty instruction for the AI.
  const difficultyConstraint = difficulty !== 'Any'
    ? `4. A difficulty rating of '${difficulty}'. All questions must conform to this difficulty.`
    : `4. A difficulty rating of 'Easy', 'Medium', or 'Hard'.`;

  // The prompt provides clear instructions to the AI model.
  const prompt = `
    Based on the following document text, generate ${numQuestions} high-quality multiple-choice questions (MCQs).
    For each MCQ, you must provide:
    1. A clear and concise question.
    2. Exactly four distinct options.
    3. The single correct answer, which must exactly match one of the four options.
    ${difficultyConstraint}

    Ensure the questions cover a variety of topics from the text and are grammatically correct.
    Do not generate questions about the document's metadata (e.g., page numbers, author). Focus solely on the core content.

    Document Text:
    ---
    ${text.substring(0, 20000)} 
    ---
  `;

  try {
    // Call the Gemini API with the prompt and schema configuration.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // A balanced temperature for creative but relevant questions.
      },
    });

    const jsonString = response.text;
    const parsedData = JSON.parse(jsonString);

    if (!Array.isArray(parsedData)) {
      throw new Error("AI returned data in an unexpected format.");
    }

    // Validate the structure of the returned data to ensure it matches the MCQ interface.
    const validatedMcqs: MCQ[] = parsedData.filter(item => 
      item.question &&
      Array.isArray(item.options) &&
      item.options.length === 4 &&
      item.correctAnswer &&
      item.options.includes(item.correctAnswer) &&
      ['Easy', 'Medium', 'Hard'].includes(item.difficulty)
    );

    // If parsing was successful but validation removed all items, it indicates a data format issue.
    if(validatedMcqs.length === 0 && parsedData.length > 0) {
      throw new Error("AI returned malformed MCQ data. Please try again.");
    }

    return validatedMcqs;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate MCQs from the AI. The content might be too complex or the service may be temporarily unavailable.");
  }
};