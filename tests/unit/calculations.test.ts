import { describe, it, expect } from 'vitest'
import {
  calculateMidtermTotal,
  calculateMidtermPercentage,
  calculatePostMidtermTotal,
  calculateTermCA,
  calculateTermTotal,
  calculateThirdTermTotal,
  calculateAnnualTotal,
  calculateAnnualAverage,
  calculateOverallAverage,
  calculateOverallAnnualAverage,
  calculateGrade,
  calculateFullResult,
  type GradeScaleEntry,
} from '@/server/academic/calculations'

const DEFAULT_GRADE_SCALE: GradeScaleEntry[] = [
  { label: 'A', minScore: 75, maxScore: 100 },
  { label: 'B', minScore: 65, maxScore: 74.99 },
  { label: 'C', minScore: 55, maxScore: 64.99 },
  { label: 'D', minScore: 45, maxScore: 54.99 },
  { label: 'E', minScore: 40, maxScore: 44.99 },
  { label: 'F', minScore: 0, maxScore: 39.99 },
]

describe('Midterm Calculations', () => {
  it('should calculate midterm total correctly', () => {
    // Spec example: Note=8, CA1=6, CA2=6 → Total=20
    expect(calculateMidtermTotal(8, 6, 6)).toBe(20)
  })

  it('should calculate midterm total with zeros', () => {
    expect(calculateMidtermTotal(0, 0, 0)).toBe(0)
  })

  it('should return null if any component is null', () => {
    expect(calculateMidtermTotal(null, 6, 6)).toBeNull()
    expect(calculateMidtermTotal(8, null, 6)).toBeNull()
    expect(calculateMidtermTotal(8, 6, null)).toBeNull()
  })

  it('should calculate midterm percentage correctly', () => {
    // 20/30 * 100 = 66.67%
    expect(calculateMidtermPercentage(20)).toBe(66.67)
  })

  it('should return null for null midterm total', () => {
    expect(calculateMidtermPercentage(null)).toBeNull()
  })
})

describe('Post-Midterm Calculations', () => {
  it('should calculate post-midterm total correctly', () => {
    // Spec example: Note=9, CA/Test=17 → Total=26
    expect(calculatePostMidtermTotal(9, 17)).toBe(26)
  })

  it('should return null if any component is null', () => {
    expect(calculatePostMidtermTotal(null, 17)).toBeNull()
    expect(calculatePostMidtermTotal(9, null)).toBeNull()
  })
})

describe('Term CA Calculation (1st/2nd Term)', () => {
  it('should calculate term CA correctly', () => {
    // Spec: midterm=20, postMidterm=26 → (20+26)/2 = 23
    expect(calculateTermCA(20, 26)).toBe(23)
  })

  it('should handle decimal case correctly', () => {
    // Spec: midterm=21, postMidterm=26 → (21+26)/2 = 23.5
    expect(calculateTermCA(21, 26)).toBe(23.5)
  })

  it('should return null if any component is null', () => {
    expect(calculateTermCA(null, 26)).toBeNull()
    expect(calculateTermCA(20, null)).toBeNull()
  })
})

describe('Term Total (1st/2nd Term)', () => {
  it('should calculate term total correctly', () => {
    // Spec: termCA=23, exam=58 → 81
    expect(calculateTermTotal(23, 58)).toBe(81)
  })

  it('should handle decimal term CA', () => {
    // termCA=23.5, exam=58 → 81.5
    expect(calculateTermTotal(23.5, 58)).toBe(81.5)
  })
})

describe('Third Term Calculations', () => {
  it('should calculate third term total correctly', () => {
    // Spec: CA=25, Exam=62 → 87
    expect(calculateThirdTermTotal(25, 62)).toBe(87)
  })
})

describe('Annual Calculations', () => {
  it('should calculate annual total correctly', () => {
    // Spec: 72 + 80 + 87 = 239
    expect(calculateAnnualTotal(72, 80, 87)).toBe(239)
  })

  it('should calculate annual average correctly', () => {
    // Spec: 239 / 3 = 79.67
    expect(calculateAnnualAverage(239)).toBe(79.67)
  })

  it('should return null if any term total is null', () => {
    expect(calculateAnnualTotal(72, null, 87)).toBeNull()
    expect(calculateAnnualAverage(null)).toBeNull()
  })
})

describe('Overall Average', () => {
  it('should calculate overall average correctly', () => {
    // Math=80, English=70, Biology=90 → (80+70+90)/3 = 80
    expect(calculateOverallAverage([80, 70, 90])).toBe(80)
  })

  it('should skip null values', () => {
    // Math=80, English=null, Biology=90 → (80+90)/2 = 85
    expect(calculateOverallAverage([80, null, 90])).toBe(85)
  })

  it('should return null for all null values', () => {
    expect(calculateOverallAverage([null, null])).toBeNull()
  })
})

describe('Overall Annual Average', () => {
  it('should calculate correctly', () => {
    // 10 subjects with annual totals summing to 2390
    // 2390 / (10 * 3) = 79.67
    const totals = Array(10).fill(239)
    expect(calculateOverallAnnualAverage(totals)).toBe(79.67)
  })
})

describe('Grade Calculation', () => {
  it('should return A for score >= 75', () => {
    expect(calculateGrade(75, DEFAULT_GRADE_SCALE)).toBe('A')
    expect(calculateGrade(100, DEFAULT_GRADE_SCALE)).toBe('A')
    expect(calculateGrade(85, DEFAULT_GRADE_SCALE)).toBe('A')
  })

  it('should return B for score 65-74.99', () => {
    expect(calculateGrade(65, DEFAULT_GRADE_SCALE)).toBe('B')
    expect(calculateGrade(74.99, DEFAULT_GRADE_SCALE)).toBe('B')
  })

  it('should return F for score below 40', () => {
    expect(calculateGrade(0, DEFAULT_GRADE_SCALE)).toBe('F')
    expect(calculateGrade(39.99, DEFAULT_GRADE_SCALE)).toBe('F')
  })

  it('should return null for null score', () => {
    expect(calculateGrade(null, DEFAULT_GRADE_SCALE)).toBeNull()
  })
})

describe('Full Result Calculation (Spec Example)', () => {
  it('should calculate complete 1st term result per spec section 99', () => {
    const result = calculateFullResult({
      termName: 'FIRST',
      midtermNoteAttendance: 8,
      midtermCA1: 6,
      midtermCA2: 6,
      postMidtermNoteAssignment: 9,
      postMidtermCATest: 17,
      thirdTermCA: null,
      thirdTermExam: null,
      examScore: 58,
      firstTermTotal: null,
      secondTermTotal: null,
      gradeScale: DEFAULT_GRADE_SCALE,
    })

    // Midterm: 8+6+6 = 20
    expect(result.midtermTotal).toBe(20)
    // Midterm percentage: 20/30 * 100 = 66.67%
    expect(result.midtermPercentage).toBe(66.67)
    // Midterm grade: B (65-74.99)
    expect(result.midtermGrade).toBe('B')
    // Post-midterm: 9+17 = 26
    expect(result.postMidtermTotal).toBe(26)
    // Term CA: (20+26)/2 = 23
    expect(result.termCA).toBe(23)
    // Term total: 23+58 = 81
    expect(result.termTotal).toBe(81)
    // Final grade: A (75-100)
    expect(result.finalGrade).toBe('A')
    // No errors
    expect(result.errors).toHaveLength(0)
  })

  it('should calculate 3rd term result per spec section 100', () => {
    const result = calculateFullResult({
      termName: 'THIRD',
      midtermNoteAttendance: null,
      midtermCA1: null,
      midtermCA2: null,
      postMidtermNoteAssignment: null,
      postMidtermCATest: null,
      thirdTermCA: 25,
      thirdTermExam: 62,
      examScore: null,
      firstTermTotal: 72,
      secondTermTotal: 80,
      gradeScale: DEFAULT_GRADE_SCALE,
    })

    // 3rd term: 25+62 = 87
    expect(result.thirdTermTotal).toBe(87)
    // Final grade: A (75-100)
    expect(result.finalGrade).toBe('A')
    // Annual: 72+80+87 = 239
    expect(result.annualTotal).toBe(239)
    // Annual average: 239/3 = 79.67
    expect(result.annualAverage).toBe(79.67)
    expect(result.errors).toHaveLength(0)
  })
})
