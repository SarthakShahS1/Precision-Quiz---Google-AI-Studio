/**
 * @file types.ts
 * @description This file contains all the core type definitions and enums used throughout the application.
 */

/**
 * Represents the color theme of the application.
 */
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

/**
 * Represents the difficulty level of a multiple-choice question.
 */
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

/**
 * Defines the structure for a single Multiple Choice Question (MCQ).
 */
export interface MCQ {
  /** The question text. */
  question: string;
  /** An array of 4 possible answers. */
  options: string[];
  /** The correct answer, which must be one of the strings from the options array. */
  correctAnswer: string;
  /** The difficulty level of the question. */
  difficulty: Difficulty;
}

/**
 * Represents the different states or views of the application, controlling the UI flow.
 */
export type AppState = 'welcome' | 'loading' | 'quiz' | 'results';

/**
 * Defines the structure for a user's answer to a quiz question.
 * This is used for scoring and reviewing the quiz results.
 */
export interface UserAnswer {
  /** The question that was asked. */
  question: string;
  /** The options that were available. */
  options: string[];
  /** The answer selected by the user. */
  selectedAnswer: string;
  /** The correct answer for the question. */
  correctAnswer: string;
  /** A boolean indicating if the user's answer was correct. */
  isCorrect: boolean;
}