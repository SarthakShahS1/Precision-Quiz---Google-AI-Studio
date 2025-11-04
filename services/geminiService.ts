/**
 * @file geminiService.ts
 * @description This service is the sole interface for interacting with the Google Gemini API.
 * It is responsible for constructing a detailed prompt based on user-provided text and settings,
 * sending the request to the AI model, and then parsing and validating the structured JSON response
 * to ensure it conforms to the application's data model for Multiple Choice Questions (MCQs).
 */

import { GoogleGenAI, Type } from "@google/genai";
import { MCQ, Difficulty } from '../types.ts';

// Retrieve the API key from environment variables.
// This key is expected to be injected by the runtime environment.
// A check in App.tsx ensures the app provides a graceful error if this is missing.
const API_KEY = process.env.API_KEY!;

// Initialize the GoogleGenAI client with the API key.
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Defines the expected JSON schema for the AI's response.
 * This is a powerful feature that instructs the Gemini model to return data
 * in a structured, predictable format, which significantly reduces the need for
 * complex string parsing and improves the reliability of the output.
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
 * @param difficulty The desired difficulty for the questions ('Easy', 'Medium', 'Hard', or 'Any').
 * @returns A promise that resolves to an array of MCQ objects.
 * @throws An error if the API call fails or returns data that cannot be parsed or validated.
 */
export const generateMCQsFromText = async (text: string, numQuestions: number, difficulty: Difficulty | 'Any'): Promise<MCQ[]> => {
  // Dynamically create the difficulty instruction based on user selection.
  const difficultyConstraint = difficulty !== 'Any'
    ? `4. A difficulty rating of '${difficulty}'. All questions must conform to this difficulty.`
    : `4. A difficulty rating of 'Easy', 'Medium', or 'Hard'.`;

  // The prompt is engineered to give the AI clear, structured instructions.
  // 1. It defines the goal: generate a specific number of MCQs.
  // 2. It specifies the required output format for each MCQ (question, 4 options, correct answer, difficulty).
  // 3. It incorporates the user's desired difficulty level, making the output dynamic.
  // 4. It provides the document text as context, truncated to a safe length to avoid exceeding API limits.
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
        // `responseMimeType: "application/json"` instructs Gemini to output a JSON string.
        responseMimeType: "application/json",
        // `responseSchema` enforces the defined structure, dramatically improving reliability.
        responseSchema: responseSchema,
        // `temperature` controls creativity. 0.7 is a good balance for generating
        // factually-grounded but varied questions without being overly rigid or imaginative.
        temperature: 0.7, 
      },
    });

    const jsonString = response.text;
    const parsedData = JSON.parse(jsonString);

    if (!Array.isArray(parsedData)) {
      throw new Error("AI returned data in an unexpected, non-array format.");
    }

    // This validation step is a critical final safeguard. Even with a schema, the AI might
    // occasionally produce data that doesn't perfectly align with our logic (e.g., a `correctAnswer`
    // that isn't one of the options). This filter ensures only 100% valid MCQs reach the user.
    const validatedMcqs: MCQ[] = parsedData.filter(item => 
      item.question &&
      Array.isArray(item.options) &&
      item.options.length === 4 &&
      item.correctAnswer &&
      item.options.includes(item.correctAnswer) &&
      ['Easy', 'Medium', 'Hard'].includes(item.difficulty)
    );

    // If parsing was successful but validation removed all items, it indicates a data format issue from the AI.
    if(validatedMcqs.length === 0 && parsedData.length > 0) {
      throw new Error("AI returned malformed MCQ data that failed validation. Please try again.");
    }

    return validatedMcqs;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // This generic error is user-facing, while the detailed error is logged to the console.
    throw new Error("Failed to generate MCQs from the AI. The content might be too complex or the service may be temporarily unavailable.");
  }
};