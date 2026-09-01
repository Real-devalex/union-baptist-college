import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/Card'
import { ClipboardList, FileText, CheckCircle, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<any[]>([])
  const [stats, setStats] = useState({ draft: 0, submitted: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    if (!user?.profile) return

    // Get teacher profile
    const { data: tp } = await supabase
      .from('teacher_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!tp) { setLoading(false); return }

    // Get assignments
    const { data: asgn } = await supabase
      .from('teacher_assignments')
      .select(`
        id,
        subject:subjects(name),
        class_arm:class_arms(name, class_level:class_levels(name)),
        term:terms(name),
        session:academic_sessions(name)
      `)
      .eq('teacher_id', tp.id)

    setAssignments(asgn || [])

    // Get result stats
    const [draft, submitted, approved, rejected] = await Promise.all([
      supabase.from('assessment_results').select('*', { count: 'exact', head: true }).eq('created_by', user.id).eq('status', 'DRAFT'),
      supabase.from('assessment_results').select('*', { count: 'exact', head: true }).eq('created_by', user.id).eq('status', 'SUBMITTED'),
      supabase.from('assessment_results').select('*', { count: 'exact', head: true }).eq('created_by', user.id).eq('status', 'APPROVED'),
      supabase.from('assessment_results').select('*', { count: 'exact', head: true }).eq('created_by', user.id).eq('status', 'REJECTED'),
    ])

    setStats({
      draft: draft.count || 0,
      submitted: submitted.count || 0,
      approved: approved.count || 0,
      rejected: rejected.count || 0,
    })
    setLoading(false)
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
      <h2 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Draft" value={stats.draft} icon={<ClipboardList className="w-5 h-5" />} color="gray" />
        <StatCard label="Submitted" value={stats.submitted} icon={<FileText className="w-5 h-5" />} color="yellow" />
        <StatCard label="Approved" value={stats.approved} icon={<CheckCircle className="w-5 h-5" />} color="green" />
        <StatCard label="Rejected" value={stats.rejected} icon={<XCircle className="w-5 h-5" />} color="red" />
      </div>

      {/* Assignments */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <CardTitle>My Assignments</CardTitle>
        </div>
        <CardContent>
          {assignments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {assignments.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {a.subject?.name || '—'} — {a.class_arm?.class_level?.name} {a.class_arm?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {a.session?.name} • {a.term?.name} Term
                    </p>
                  </div>
                  <Link
                    to="/teacher/enter-scores"
                    className="text-sm text-primary hover:underline"
                  >
                    Enter Scores →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No assignments yet. Contact your administrator.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
