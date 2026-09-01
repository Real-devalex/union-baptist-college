// ============================================================
// COMPETITION RANKING ENGINE
//
// Uses "competition ranking" (1224 ranking):
// - Tied scores get the same position
// - The next position after a tie skips ranks
//
// Example: 90, 90, 85, 80 → positions: 1, 1, 3, 4
// Example: 95, 90, 90, 85 → positions: 1, 2, 2, 4
//
// CRITICAL: Positions are always scoped to prevent cross-class mixing.
// Subject positions: session + term + classLevel + classArm + subject
// Overall positions: session + term + classLevel + classArm
// ============================================================

export interface RankedStudent {
  studentId: string;
  score: number;
}

export interface RankedResult {
  studentId: string;
  score: number;
  position: number;
}

/**
 * Competition ranking algorithm.
 * Sorts by score descending, assigns positions with tie handling.
 *
 * Algorithm:
 * - Start at position 1
 * - If current score < previous score, position = index + 1
 * - If current score == previous score, position = same as previous
 *
 * @param items - Array of { studentId, score }
 * @returns Array of { studentId, score, position } sorted by position
 */
export function competitionRank(items: RankedStudent[]): RankedResult[] {
  if (items.length === 0) return [];

  // Sort descending by score
  const sorted = [...items].sort((a, b) => b.score - a.score);

  const results: RankedResult[] = [];
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].score < sorted[i - 1].score) {
      currentRank = i + 1;
    }
    results.push({
      studentId: sorted[i].studentId,
      score: sorted[i].score,
      position: currentRank,
    });
  }

  return results;
}

/**
 * Rank students for a specific subject within a class arm.
 * Scope: session + term + classLevel + classArm + subject
 *
 * CRITICAL: This MUST be called with the correct scope to prevent
 * cross-class position contamination. JSS1 A scores must never
 * be mixed with JSS1 B scores.
 */
export function rankSubjectPositions(
  items: RankedStudent[]
): RankedResult[] {
  return competitionRank(items);
}

/**
 * Rank students for overall position within a class arm.
 * Uses the student's overall average (sum of termTotals / numSubjects).
 * Scope: session + term + classLevel + classArm
 *
 * CRITICAL: Same isolation rule as subject positions.
 */
export function rankOverallPositions(
  items: RankedStudent[]
): RankedResult[] {
  return competitionRank(items);
}

/**
 * Calculate a student's overall average across all subjects in a term.
 * Used for overall position ranking.
 *
 * @param termTotals - Array of term total scores for each subject
 * @returns The average, or null if no valid scores
 */
export function calculateStudentOverallAverage(
  termTotals: (number | null)[]
): number | null {
  const valid = termTotals.filter((t): t is number => t !== null);
  if (valid.length === 0) return null;
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 100) / 100;
}

/**
 * Extract position map from ranked results for easy lookup.
 */
export function getPositionMap(ranked: RankedResult[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const r of ranked) {
    map.set(r.studentId, r.position);
  }
  return map;
}

/**
 * Get the ordinal representation of a position (e.g., 1 → "1st", 2 → "2nd").
 */
export function ordinalSuffix(position: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = position % 100;
  return position + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}
