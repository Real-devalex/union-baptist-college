import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { CheckCircle, XCircle, Eye, RotateCcw } from 'lucide-react'

interface SubmittedResult {
  id: string
  status: string
  created_at: string
  student: { first_name: string; surname: string; admission_number: string } | null
  subject: { name: string } | null
  class_arm: { name: string; class_level: { name: string } | null } | null
  term: { name: string } | null
  term_total: number | null
  final_grade: string | null
}

export default function PrincipalReview() {
  const [results, setResults] = useState<SubmittedResult[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => { loadResults() }, [])

  async function loadResults() {
    setLoading(true)
    const { data } = await supabase
      .from('assessment_results')
      .select(`
        id, status, created_at, term_total, final_grade,
        student:students(first_name, surname, admission_number),
        subject:subjects(name),
        class_arm:class_arms(name, class_level:class_levels(name)),
        term:terms(name)
      `)
      .in('status', ['SUBMITTED', 'UNDER_REVIEW'])
      .order('created_at', { ascending: false })
    setResults((data as unknown as SubmittedResult[]) || [])
    setLoading(false)
  }

  async function handleApprove(id: string) {
    setActionLoading(id)
    await supabase
      .from('assessment_results')
      .update({ status: 'APPROVED', approved_at: new Date().toISOString() })
      .eq('id', id)
    await loadResults()
    setActionLoading(null)
  }

  async function handleReject(id: string) {
    setActionLoading(id)
    await supabase
      .from('assessment_results')
      .update({ status: 'REJECTED' })
      .eq('id', id)
    await loadResults()
    setActionLoading(null)
  }

  async function handlePublish(id: string) {
    setActionLoading(id)
    await supabase
      .from('assessment_results')
      .update({ status: 'PUBLISHED', published_at: new Date().toISOString() })
      .eq('id', id)
    await loadResults()
    setActionLoading(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review Results</h2>
        <p className="text-gray-500">Review and approve submitted results</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {r.student ? `${r.student.first_name} ${r.student.surname}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {r.class_arm?.class_level?.name} {r.class_arm?.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.subject?.name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.term?.name || '—'}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{r.term_total ?? '—'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-primary">{r.final_grade || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleApprove(r.id)}
                        disabled={actionLoading === r.id}
                        className="p-1 text-green-500 hover:text-green-700 rounded disabled:opacity-50"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(r.id)}
                        disabled={actionLoading === r.id}
                        className="p-1 text-red-500 hover:text-red-700 rounded disabled:opacity-50"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    No results pending review.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
