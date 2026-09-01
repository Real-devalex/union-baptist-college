import { SCORE_LIMITS, roundForDisplay, type RoundingMode } from "./constants";

// ============================================================
// MIDTERM CALCULATIONS (1st & 2nd Term)
// ============================================================

/**
 * Calculate midterm total from component scores.
 * Formula: midtermTotal = noteAttendance + ca1 + ca2
 * Range: 0-30
 */
export function calculateMidtermTotal(
  noteAttendance: number | null,
  ca1: number | null,
  ca2: number | null
): number | null {
  if (noteAttendance === null || ca1 === null || ca2 === null) return null;
  return roundForDisplay(noteAttendance + ca1 + ca2);
}

/**
 * Convert midterm total to percentage for grade lookup.
 * Formula: midtermPercentage = (midtermTotal / 30) * 100
 */
export function calculateMidtermPercentage(midtermTotal: number | null): number | null {
  if (midtermTotal === null) return null;
  return roundForDisplay((midtermTotal / SCORE_LIMITS.MIDTERM_TOTAL_MAX) * 100);
}

// ============================================================
// POST-MIDTERM CALCULATIONS (1st & 2nd Term)
// ============================================================

/**
 * Calculate post-midterm total from component scores.
 * Formula: postMidtermTotal = noteAssignment + caTest
 * Range: 0-30
 */
export function calculatePostMidtermTotal(
  noteAssignment: number | null,
  caTest: number | null
): number | null {
  if (noteAssignment === null || caTest === null) return null;
  return roundForDisplay(noteAssignment + caTest);
}

// ============================================================
// TERM CA CALCULATION (1st & 2nd Term only)
// ============================================================

/**
 * Calculate the Continuous Assessment score for the term.
 * CRITICAL BUSINESS RULE: For 1st and 2nd terms only.
 * Formula: termCA = (midtermTotal + postMidtermTotal) / 2
 * Range: 0-30
 *
 * Example: midterm=20, postMidterm=26 → termCA = (20+26)/2 = 23
 * Example: midterm=21, postMidterm=26 → termCA = (21+26)/2 = 23.5
 */
export function calculateTermCA(
  midtermTotal: number | null,
  postMidtermTotal: number | null
): number | null {
  if (midtermTotal === null || postMidtermTotal === null) return null;
  return roundForDisplay((midtermTotal + postMidtermTotal) / 2);
}

// ============================================================
// TERM TOTAL (1st & 2nd Term)
// ============================================================

/**
 * Calculate final term result for 1st/2nd term.
 * Formula: termTotal = termCA + examScore
 * Range: 0-100
 *
 * Example: termCA=23, exam=58 → termTotal = 81
 */
export function calculateTermTotal(
  termCA: number | null,
  examScore: number | null
): number | null {
  if (termCA === null || examScore === null) return null;
  return roundForDisplay(termCA + examScore);
}

// ============================================================
// 3RD TERM CALCULATIONS
// ============================================================

/**
 * Calculate 3rd term total.
 * NOTE: 3rd term does NOT use midterm averaging.
 * Formula: thirdTermTotal = thirdTermCA + thirdTermExam
 * Range: 0-100
 *
 * Example: CA=25, Exam=62 → total = 87
 */
export function calculateThirdTermTotal(
  thirdTermCA: number | null,
  thirdTermExam: number | null
): number | null {
  if (thirdTermCA === null || thirdTermExam === null) return null;
  return roundForDisplay(thirdTermCA + thirdTermExam);
}

// ============================================================
// ANNUAL CALCULATIONS (3rd Term Report)
// ============================================================

/**
 * Calculate annual total across all three terms.
 * Formula: annualTotal = 1stTerm + 2ndTerm + 3rdTermTotal
 * Range: 0-300
 *
 * Example: 72 + 80 + 87 = 239
 */
export function calculateAnnualTotal(
  firstTermTotal: number | null,
  secondTermTotal: number | null,
  thirdTermTotal: number | null
): number | null {
  if (firstTermTotal === null || secondTermTotal === null || thirdTermTotal === null) return null;
  return roundForDisplay(firstTermTotal + secondTermTotal + thirdTermTotal);
}

/**
 * Calculate annual average for a single subject.
 * Formula: annualAverage = annualTotal / 3
 * Range: 0-100%
 *
 * Example: 239 / 3 = 79.67%
 */
export function calculateAnnualAverage(annualTotal: number | null): number | null {
  if (annualTotal === null) return null;
  return roundForDisplay(annualTotal / 3);
}

// ============================================================
// OVERALL AVERAGES
// ============================================================

/**
 * Calculate overall average for a term (across all subjects).
 * Formula: overallAverage = sum(subjectTermTotals) / numberOfSubjects
 * Range: 0-100%
 */
export function calculateOverallAverage(termTotals: (number | null)[]): number | null {
  const validTotals = termTotals.filter((t): t is number => t !== null);
  if (validTotals.length === 0) return null;
  const sum = validTotals.reduce((a, b) => a + b, 0);
  return roundForDisplay(sum / validTotals.length);
}

/**
 * Calculate overall annual average across all subjects.
 * Formula: sum(annualSubjectTotals) / (numberOfSubjects × 3)
 * Equivalent to: average of each subject's annual average
 *
 * Example: If 10 subjects with annual totals summing to 2390:
 *   2390 / (10 × 3) = 79.67%
 */
export function calculateOverallAnnualAverage(
  annualSubjectTotals: (number | null)[]
): number | null {
  const validTotals = annualSubjectTotals.filter((t): t is number => t !== null);
  if (validTotals.length === 0) return null;
  const sum = validTotals.reduce((a, b) => a + b, 0);
  return roundForDisplay(sum / (validTotals.length * 3));
}

// ============================================================
// GRADE CALCULATION
// ============================================================

export interface GradeScaleEntry {
  label: string;
  minScore: number;
  maxScore: number;
}

/**
 * Calculate grade from score using the global grade scale.
 * The grade scale must be sorted by sortOrder (ascending).
 * Score must be within [minScore, maxScore] for a match.
 * If score is below all ranges, returns the lowest grade.
 *
 * @param score - The percentage/total score (0-100)
 * @param gradeScale - Array of grade scale entries sorted by sortOrder
 * @returns The grade label (e.g., "A", "B", "C")
 */
export function calculateGrade(
  score: number | null,
  gradeScale: GradeScaleEntry[]
): string | null {
  if (score === null || gradeScale.length === 0) return null;

  // Check each grade range
  for (const grade of gradeScale) {
    if (score >= grade.minScore && score <= grade.maxScore) {
      return grade.label;
    }
  }

  // If score is below all ranges, return the lowest grade
  const sorted = [...gradeScale].sort((a, b) => a.minScore - b.minScore);
  if (score < sorted[0].minScore) {
    return sorted[0].label;
  }

  // If score is above all ranges, return the highest grade
  return sorted[sorted.length - 1].label;
}

// ============================================================
// VALIDATION
// ============================================================

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate midterm score components.
 */
export function validateMidtermScores(
  noteAttendance: number | null,
  ca1: number | null,
  ca2: number | null
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (noteAttendance !== null) {
    if (noteAttendance < 0 || noteAttendance > SCORE_LIMITS.MIDTERM_NOTE_MAX) {
      errors.push({ field: "midtermNoteAttendance", message: `Must be 0-${SCORE_LIMITS.MIDTERM_NOTE_MAX}` });
    }
  }
  if (ca1 !== null) {
    if (ca1 < 0 || ca1 > SCORE_LIMITS.MIDTERM_CA1_MAX) {
      errors.push({ field: "midtermCA1", message: `Must be 0-${SCORE_LIMITS.MIDTERM_CA1_MAX}` });
    }
  }
  if (ca2 !== null) {
    if (ca2 < 0 || ca2 > SCORE_LIMITS.MIDTERM_CA2_MAX) {
      errors.push({ field: "midtermCA2", message: `Must be 0-${SCORE_LIMITS.MIDTERM_CA2_MAX}` });
    }
  }

  return errors;
}

/**
 * Validate post-midterm score components.
 */
export function validatePostMidtermScores(
  noteAssignment: number | null,
  caTest: number | null
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (noteAssignment !== null) {
    if (noteAssignment < 0 || noteAssignment > SCORE_LIMITS.POST_MIDTERM_NOTE_MAX) {
      errors.push({ field: "postMidtermNoteAssignment", message: `Must be 0-${SCORE_LIMITS.POST_MIDTERM_NOTE_MAX}` });
    }
  }
  if (caTest !== null) {
    if (caTest < 0 || caTest > SCORE_LIMITS.POST_MIDTERM_CA_TEST_MAX) {
      errors.push({ field: "postMidtermCATest", message: `Must be 0-${SCORE_LIMITS.POST_MIDTERM_CA_TEST_MAX}` });
    }
  }

  return errors;
}

/**
 * Validate exam score.
 */
export function validateExamScore(examScore: number | null): ValidationError[] {
  const errors: ValidationError[] = [];

  if (examScore !== null) {
    if (examScore < 0 || examScore > SCORE_LIMITS.EXAM_MAX) {
      errors.push({ field: "examScore", message: `Must be 0-${SCORE_LIMITS.EXAM_MAX}` });
    }
  }

  return errors;
}

/**
 * Validate 3rd term scores.
 */
export function validateThirdTermScores(
  thirdTermCA: number | null,
  thirdTermExam: number | null
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (thirdTermCA !== null) {
    if (thirdTermCA < 0 || thirdTermCA > SCORE_LIMITS.THIRD_TERM_CA_MAX) {
      errors.push({ field: "thirdTermCA", message: `Must be 0-${SCORE_LIMITS.THIRD_TERM_CA_MAX}` });
    }
  }
  if (thirdTermExam !== null) {
    if (thirdTermExam < 0 || thirdTermExam > SCORE_LIMITS.THIRD_TERM_EXAM_MAX) {
      errors.push({ field: "thirdTermExam", message: `Must be 0-${SCORE_LIMITS.THIRD_TERM_EXAM_MAX}` });
    }
  }

  return errors;
}

// ============================================================
// FULL RESULT CALCULATION
// ============================================================

export interface ResultInput {
  // Term info
  termName: "FIRST" | "SECOND" | "THIRD";
  // Midterm (1st/2nd term only)
  midtermNoteAttendance: number | null;
  midtermCA1: number | null;
  midtermCA2: number | null;
  // Post-midterm (1st/2nd term only)
  postMidtermNoteAssignment: number | null;
  postMidtermCATest: number | null;
  // 3rd term
  thirdTermCA: number | null;
  thirdTermExam: number | null;
  // Exam (1st/2nd term)
  examScore: number | null;
  // Previous terms (for 3rd term annual calc)
  firstTermTotal: number | null;
  secondTermTotal: number | null;
  // Grade scale
  gradeScale: GradeScaleEntry[];
}

export interface CalculationResult {
  midtermTotal: number | null;
  midtermPercentage: number | null;
  midtermGrade: string | null;
  postMidtermTotal: number | null;
  termCA: number | null;
  termTotal: number | null;
  finalGrade: string | null;
  thirdTermTotal: number | null;
  annualTotal: number | null;
  annualAverage: number | null;
  errors: ValidationError[];
}

/**
 * Calculate all result fields for a single student/subject.
 * This is the MAIN entry point for result calculation.
 * Server-side only - never trust client-calculated values.
 */
export function calculateFullResult(input: ResultInput): CalculationResult {
  const errors: ValidationError[] = [];
  let midtermTotal: number | null = null;
  let midtermPercentage: number | null = null;
  let midtermGrade: string | null = null;
  let postMidtermTotal: number | null = null;
  let termCA: number | null = null;
  let termTotal: number | null = null;
  let finalGrade: string | null = null;
  let thirdTermTotal: number | null = null;
  let annualTotal: number | null = null;
  let annualAverage: number | null = null;

  if (input.termName === "FIRST" || input.termName === "SECOND") {
    // Validate and calculate midterm
    errors.push(...validateMidtermScores(
      input.midtermNoteAttendance,
      input.midtermCA1,
      input.midtermCA2
    ));
    midtermTotal = calculateMidtermTotal(
      input.midtermNoteAttendance,
      input.midtermCA1,
      input.midtermCA2
    );
    midtermPercentage = calculateMidtermPercentage(midtermTotal);
    midtermGrade = calculateGrade(midtermPercentage, input.gradeScale);

    // Validate and calculate post-midterm
    errors.push(...validatePostMidtermScores(
      input.postMidtermNoteAssignment,
      input.postMidtermCATest
    ));
    postMidtermTotal = calculatePostMidtermTotal(
      input.postMidtermNoteAssignment,
      input.postMidtermCATest
    );

    // Calculate term CA (1st/2nd term formula)
    termCA = calculateTermCA(midtermTotal, postMidtermTotal);

    // Validate and calculate exam + term total
    errors.push(...validateExamScore(input.examScore));
    termTotal = calculateTermTotal(termCA, input.examScore);
    finalGrade = calculateGrade(termTotal, input.gradeScale);
  }

  if (input.termName === "THIRD") {
    // Validate and calculate 3rd term
    errors.push(...validateThirdTermScores(
      input.thirdTermCA,
      input.thirdTermExam
    ));
    thirdTermTotal = calculateThirdTermTotal(
      input.thirdTermCA,
      input.thirdTermExam
    );
    finalGrade = calculateGrade(thirdTermTotal, input.gradeScale);

    // Calculate annual (needs previous term totals)
    annualTotal = calculateAnnualTotal(
      input.firstTermTotal,
      input.secondTermTotal,
      thirdTermTotal
    );
    annualAverage = calculateAnnualAverage(annualTotal);
  }

  return {
    midtermTotal,
    midtermPercentage,
    midtermGrade,
    postMidtermTotal,
    termCA,
    termTotal,
    finalGrade,
    thirdTermTotal,
    annualTotal,
    annualAverage,
    errors,
  };
}
