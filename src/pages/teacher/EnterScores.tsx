import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { Save, Send, Loader2 } from 'lucide-react'
import {
  calculateMidtermTotal,
  calculatePostMidtermTotal,
  calculateTermCA,
  calculateTermTotal,
  calculateGrade,
  type GradeScaleEntry,
} from '@/server/academic/calculations'

interface StudentScore {
  studentId: string
  firstName: string
  surname: string
  enrollmentId: string
  // Editable fields
  midtermNote: number | null
  midtermCa1: number | null
  midtermCa2: number | null
  postMidtermNote: number | null
  postMidtermCaTest: number | null
  examScore: number | null
  teacherComment: string | null
  // Calculated (read-only)
  midtermTotal: number | null
  postMidtermTotal: number | null
  termCA: number | null
  termTotal: number | null
  finalGrade: string | null
}

export default function TeacherEnterScores() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<any[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [students, setStudents] = useState<StudentScore[]>([])
  const [gradeScale, setGradeScale] = useState<GradeScaleEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [termType, setTermType] = useState<'FIRST' | 'SECOND' | 'THIRD'>('FIRST')

  useEffect(() => { loadAssignments() }, [])

  async function loadAssignments() {
    if (!user?.profile) return
    const { data: tp } = await supabase
      .from('teacher_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()
    if (!tp) return

    const { data } = await supabase
      .from('teacher_assignments')
      .select(`
        id, subject_id, class_level_id, class_arm_id, session_id, term_id,
        subject:subjects(name),
        class_arm:class_arms(name, class_level:class_levels(name)),
        term:terms(name, id),
        session:academic_sessions(name, id)
      `)
      .eq('teacher_id', tp.id)
    setAssignments(data || [])

    // Load grade scale
    const { data: gs } = await supabase
      .from('grade_scales')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    if (gs) {
      setGradeScale(gs.map((g) => ({ label: g.label, minScore: g.min_score, maxScore: g.max_score })))
    }
  }

  async function loadStudents() {
    if (!selectedAssignment) return
    setLoading(true)

    // Get enrolled students
    const { data: enrollments } = await supabase
      .from('student_enrollments')
      .select(`
        id, student_id,
        student:students(id, first_name, surname)
      `)
      .eq('class_arm_id', selectedAssignment.class_arm_id)
      .eq('session_id', selectedAssignment.session_id)
      .eq('status', 'ACTIVE')

    // Get existing results
    const { data: existing } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('subject_id', selectedAssignment.subject_id)
      .eq('class_arm_id', selectedAssignment.class_arm_id)
      .eq('session_id', selectedAssignment.session_id)
      .eq('term_id', selectedAssignment.term_id)

    const existingMap = new Map((existing || []).map((e: any) => [e.student_id, e]))

    const scores: StudentScore[] = (enrollments || []).map((enr: any) => {
      const existingResult = existingMap.get(enr.student_id)
      return {
        studentId: enr.student_id,
        firstName: enr.student?.first_name || '',
        surname: enr.student?.surname || '',
        enrollmentId: enr.id,
        midtermNote: existingResult?.midterm_note_attendance ?? null,
        midtermCa1: existingResult?.midterm_ca1 ?? null,
        midtermCa2: existingResult?.midterm_ca2 ?? null,
        postMidtermNote: existingResult?.post_midterm_note_assignment ?? null,
        postMidtermCaTest: existingResult?.post_midterm_ca_test ?? null,
        examScore: existingResult?.exam_score ?? null,
        teacherComment: existingResult?.teacher_comment ?? null,
        midtermTotal: existingResult?.midterm_total ?? null,
        postMidtermTotal: existingResult?.post_midterm_total ?? null,
        termCA: existingResult?.term_ca ?? null,
        termTotal: existingResult?.term_total ?? null,
        finalGrade: existingResult?.final_grade ?? null,
      }
    })

    setStudents(scores)
    setLoading(false)
  }

  function updateScore(studentIdx: number, field: keyof StudentScore, value: number | string | null) {
    setStudents((prev) => {
      const updated = [...prev]
      const student = { ...updated[studentIdx] }

      if (typeof value === 'string' && value !== '') {
        value = Number(value)
      } else if (value === '' || value === null) {
        value = null
      }

      ;(student as any)[field] = value

      // Recalculate derived fields
      if (termType !== 'THIRD') {
        student.midtermTotal = calculateMidtermTotal(student.midtermNote, student.midtermCa1, student.midtermCa2)
        student.postMidtermTotal = calculatePostMidtermTotal(student.postMidtermNote, student.postMidtermCaTest)
        student.termCA = calculateTermCA(student.midtermTotal, student.postMidtermTotal)
        student.termTotal = calculateTermTotal(student.termCA, student.examScore)
        student.finalGrade = calculateGrade(student.termTotal, gradeScale)
      }

      updated[studentIdx] = student
      return updated
    })
  }

  async function saveDraft() {
    setSaving(true)
    const userId = user?.id
    if (!userId || !selectedAssignment) { setSaving(false); return }

    for (const s of students) {
      const midtermTotal = calculateMidtermTotal(s.midtermNote, s.midtermCa1, s.midtermCa2)
      const postMidtermTotal = calculatePostMidtermTotal(s.postMidtermNote, s.postMidtermCaTest)
      const termCA = calculateTermCA(midtermTotal, postMidtermTotal)
      const termTotal = calculateTermCA !== null ? calculateTermTotal(termCA, s.examScore) : null
      const finalGrade = calculateGrade(termTotal, gradeScale)

      const upsertData: any = {
        student_id: s.studentId,
        enrollment_id: s.enrollmentId,
        session_id: selectedAssignment.session_id,
        term_id: selectedAssignment.term_id,
        subject_id: selectedAssignment.subject_id,
        class_level_id: selectedAssignment.class_level_id,
        class_arm_id: selectedAssignment.class_arm_id,
        midterm_note_attendance: s.midtermNote,
        midterm_ca1: s.midtermCa1,
        midterm_ca2: s.midtermCa2,
        midterm_total: midtermTotal,
        midterm_percentage: midtermTotal !== null ? Math.round((midtermTotal / 30) * 100 * 100) / 100 : null,
        post_midterm_note_assignment: s.postMidtermNote,
        post_midterm_ca_test: s.postMidtermCaTest,
        post_midterm_total: postMidtermTotal,
        term_ca: termCA,
        exam_score: s.examScore,
        term_total: termTotal,
        final_grade: finalGrade,
        teacher_comment: s.teacherComment,
        status: 'DRAFT',
        created_by: userId,
        updated_by: userId,
      }

      await supabase
        .from('assessment_results')
        .upsert(upsertData, {
          onConflict: 'student_id,subject_id,session_id,term_id,enrollment_id',
        })
    }
    setSaving(false)
    loadStudents()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Score Entry</h2>
        <p className="text-gray-500">Enter student scores for your assigned subjects</p>
      </div>

      {/* Assignment Selector */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedAssignment?.id || ''}
              onChange={(e) => {
                const a = assignments.find((a) => a.id === e.target.value)
                setSelectedAssignment(a || null)
                if (a) {
                  setTermType(a.term?.name || 'FIRST')
                  loadStudents()
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select assignment</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.subject?.name} — {a.class_arm?.class_level?.name} {a.class_arm?.name} ({a.term?.name})
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Score Entry Table */}
      {selectedAssignment && (
        <Card>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <CardTitle>
              {selectedAssignment.subject?.name} — {selectedAssignment.class_arm?.class_level?.name} {selectedAssignment.class_arm?.name}
            </CardTitle>
            <div className="flex gap-2">
              <button
                onClick={saveDraft}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Draft
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            </div>
          </div>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 sticky left-0 bg-gray-50 z-10 min-w-[150px]">Student</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">Note /10</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">CA1 /10</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">CA2 /10</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 bg-blue-50">Mid Total /30</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">Post Note /10</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">Post CA /20</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 bg-blue-50">Term CA /30</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">Exam /70</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 bg-green-50">Total /100</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 bg-green-50">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map((s, idx) => (
                      <tr key={s.studentId} className="hover:bg-gray-50">
                        <td className="px-3 py-1 sticky left-0 bg-white z-10">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 text-xs">{s.surname}</span>
                            <span className="text-xs text-gray-500">{s.firstName}</span>
                          </div>
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" min={0} max={10} step={0.5}
                            value={s.midtermNote ?? ''}
                            onChange={(e) => updateScore(idx, 'midtermNote', e.target.value)}
                            className="w-14 px-1 py-1 border border-gray-200 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" min={0} max={10} step={0.5}
                            value={s.midtermCa1 ?? ''}
                            onChange={(e) => updateScore(idx, 'midtermCa1', e.target.value)}
                            className="w-14 px-1 py-1 border border-gray-200 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" min={0} max={10} step={0.5}
                            value={s.midtermCa2 ?? ''}
                            onChange={(e) => updateScore(idx, 'midtermCa2', e.target.value)}
                            className="w-14 px-1 py-1 border border-gray-200 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </td>
                        <td className="px-2 py-1 bg-blue-50/50">
                          <span className="block w-14 text-center text-xs font-mono font-medium text-gray-700">
                            {s.midtermTotal ?? '—'}
                          </span>
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" min={0} max={10} step={0.5}
                            value={s.postMidtermNote ?? ''}
                            onChange={(e) => updateScore(idx, 'postMidtermNote', e.target.value)}
                            className="w-14 px-1 py-1 border border-gray-200 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" min={0} max={20} step={0.5}
                            value={s.postMidtermCaTest ?? ''}
                            onChange={(e) => updateScore(idx, 'postMidtermCaTest', e.target.value)}
                            className="w-14 px-1 py-1 border border-gray-200 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </td>
                        <td className="px-2 py-1 bg-blue-50/50">
                          <span className="block w-14 text-center text-xs font-mono font-medium text-gray-700">
                            {s.termCA ?? '—'}
                          </span>
                        </td>
                        <td className="px-2 py-1">
                          <input type="number" min={0} max={70} step={0.5}
                            value={s.examScore ?? ''}
                            onChange={(e) => updateScore(idx, 'examScore', e.target.value)}
                            className="w-14 px-1 py-1 border border-gray-200 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </td>
                        <td className="px-2 py-1 bg-green-50/50">
                          <span className="block w-14 text-center text-xs font-mono font-bold text-gray-900">
                            {s.termTotal ?? '—'}
                          </span>
                        </td>
                        <td className="px-2 py-1 bg-green-50/50">
                          <span className="block w-10 text-center text-xs font-bold text-primary">
                            {s.finalGrade || '—'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                          No students enrolled in this class.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
