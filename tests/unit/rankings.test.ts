import { describe, it, expect } from 'vitest'
import {
  competitionRank,
  rankSubjectPositions,
  rankOverallPositions,
  getPositionMap,
  ordinalSuffix,
} from '@/server/academic/rankings'

describe('Competition Ranking', () => {
  it('should rank unique scores correctly', () => {
    const items = [
      { studentId: 'A', score: 95 },
      { studentId: 'B', score: 90 },
      { studentId: 'C', score: 85 },
      { studentId: 'D', score: 80 },
    ]

    const result = competitionRank(items)
    const posMap = getPositionMap(result)

    expect(posMap.get('A')).toBe(1)
    expect(posMap.get('B')).toBe(2)
    expect(posMap.get('C')).toBe(3)
    expect(posMap.get('D')).toBe(4)
  })

  it('should handle tied first place (spec section 34)', () => {
    // Spec: 90, 90, 85, 80 → 1, 1, 3, 4
    const items = [
      { studentId: 'A', score: 90 },
      { studentId: 'B', score: 90 },
      { studentId: 'C', score: 85 },
      { studentId: 'D', score: 80 },
    ]

    const result = competitionRank(items)
    const posMap = getPositionMap(result)

    expect(posMap.get('A')).toBe(1)
    expect(posMap.get('B')).toBe(1)
    expect(posMap.get('C')).toBe(3)
    expect(posMap.get('D')).toBe(4)
  })

  it('should handle tied second place (spec section 35)', () => {
    // Spec: 95, 90, 90, 85 → 1, 2, 2, 4
    const items = [
      { studentId: 'A', score: 95 },
      { studentId: 'B', score: 90 },
      { studentId: 'C', score: 90 },
      { studentId: 'D', score: 85 },
    ]

    const result = competitionRank(items)
    const posMap = getPositionMap(result)

    expect(posMap.get('A')).toBe(1)
    expect(posMap.get('B')).toBe(2)
    expect(posMap.get('C')).toBe(2)
    expect(posMap.get('D')).toBe(4)
  })

  it('should handle all tied scores', () => {
    const items = [
      { studentId: 'A', score: 90 },
      { studentId: 'B', score: 90 },
      { studentId: 'C', score: 90 },
    ]

    const result = competitionRank(items)
    const posMap = getPositionMap(result)

    expect(posMap.get('A')).toBe(1)
    expect(posMap.get('B')).toBe(1)
    expect(posMap.get('C')).toBe(1)
  })

  it('should handle single student', () => {
    const items = [{ studentId: 'A', score: 85 }]
    const result = competitionRank(items)
    const posMap = getPositionMap(result)
    expect(posMap.get('A')).toBe(1)
  })

  it('should handle empty array', () => {
    const result = competitionRank([])
    expect(result).toEqual([])
  })

  it('should sort by position in output', () => {
    const items = [
      { studentId: 'C', score: 80 },
      { studentId: 'A', score: 95 },
      { studentId: 'B', score: 90 },
    ]

    const result = competitionRank(items)
    expect(result[0].position).toBe(1)
    expect(result[1].position).toBe(2)
    expect(result[2].position).toBe(3)
  })

  it('should handle three-way tie for first', () => {
    const items = [
      { studentId: 'A', score: 90 },
      { studentId: 'B', score: 90 },
      { studentId: 'C', score: 90 },
      { studentId: 'D', score: 85 },
    ]

    const result = competitionRank(items)
    const posMap = getPositionMap(result)

    expect(posMap.get('A')).toBe(1)
    expect(posMap.get('B')).toBe(1)
    expect(posMap.get('C')).toBe(1)
    expect(posMap.get('D')).toBe(4)
  })

  it('should not modify original array', () => {
    const items = [
      { studentId: 'B', score: 80 },
      { studentId: 'A', score: 90 },
    ]
    const original = [...items]
    competitionRank(items)
    expect(items).toEqual(original)
  })
})

describe('Class-Arm Isolation (Spec Section 67)', () => {
  it('should rank JSS1 A separately from JSS1 B', () => {
    // JSS1 A: 90, 70
    const jss1a = [
      { studentId: 'A1', score: 90 },
      { studentId: 'A2', score: 70 },
    ]

    // JSS1 B: 85, 60
    const jss1b = [
      { studentId: 'B1', score: 85 },
      { studentId: 'B2', score: 60 },
    ]

    const rankedA = competitionRank(jss1a)
    const rankedB = competitionRank(jss1b)

    const posMapA = getPositionMap(rankedA)
    const posMapB = getPositionMap(rankedB)

    // JSS1 A: 90=1st, 70=2nd
    expect(posMapA.get('A1')).toBe(1)
    expect(posMapA.get('A2')).toBe(2)

    // JSS1 B: 85=1st, 60=2nd
    expect(posMapB.get('B1')).toBe(1)
    expect(posMapB.get('B2')).toBe(2)
  })

  it('should NEVER mix JSS1 A and JSS1 B scores', () => {
    const jss1a = [{ studentId: 'A1', score: 90 }]
    const jss1b = [{ studentId: 'B1', score: 85 }]

    const rankedA = competitionRank(jss1a)
    const rankedB = competitionRank(jss1b)

    // Each class should have exactly 1 student at position 1
    const posA = getPositionMap(rankedA)
    const posB = getPositionMap(rankedB)

    expect(posA.size).toBe(1)
    expect(posB.size).toBe(1)
    expect(posA.get('A1')).toBe(1)
    expect(posB.get('B1')).toBe(1)
  })
})

describe('Ordinal Suffix', () => {
  it('should return correct ordinals', () => {
    expect(ordinalSuffix(1)).toBe('1st')
    expect(ordinalSuffix(2)).toBe('2nd')
    expect(ordinalSuffix(3)).toBe('3rd')
    expect(ordinalSuffix(4)).toBe('4th')
    expect(ordinalSuffix(11)).toBe('11th')
    expect(ordinalSuffix(12)).toBe('12th')
    expect(ordinalSuffix(13)).toBe('13th')
    expect(ordinalSuffix(21)).toBe('21st')
    expect(ordinalSuffix(22)).toBe('22nd')
    expect(ordinalSuffix(23)).toBe('23rd')
  })
})
