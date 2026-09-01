// ============================================================
// ACADEMIC SCORE LIMITS
// Single source of truth for all score maximums.
// Do NOT hardcode these elsewhere.
// ============================================================

export const SCORE_LIMITS = {
  // Midterm components (1st & 2nd term)
  MIDTERM_NOTE_MAX: 10,
  MIDTERM_CA1_MAX: 10,
  MIDTERM_CA2_MAX: 10,
  MIDTERM_TOTAL_MAX: 30,

  // Post-midterm components (1st & 2nd term)
  POST_MIDTERM_NOTE_MAX: 10,
  POST_MIDTERM_CA_TEST_MAX: 20,
  POST_MIDTERM_TOTAL_MAX: 30,

  // Exam (1st & 2nd term)
  EXAM_MAX: 70,

  // Term total
  TERM_TOTAL_MAX: 100,

  // 3rd term
  THIRD_TERM_CA_MAX: 30,
  THIRD_TERM_EXAM_MAX: 70,
  THIRD_TERM_TOTAL_MAX: 100,

  // Annual
  ANNUAL_TOTAL_MAX: 300,
} as const;

// Grade scale display precision
export const DISPLAY_PRECISION = 2; // 2 decimal places

// Rounding modes
export type RoundingMode = "none" | "whole" | "1decimal" | "2decimals";

export function roundForDisplay(value: number, mode: RoundingMode = "2decimals"): number {
  switch (mode) {
    case "none":
      return value;
    case "whole":
      return Math.round(value);
    case "1decimal":
      return Math.round(value * 10) / 10;
    case "2decimals":
    default:
      return Math.round(value * 100) / 100;
  }
}
