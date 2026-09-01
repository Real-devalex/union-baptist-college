import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { StatCard } from '@/components/ui/Card'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import {
  Users,
  GraduationCap,
  BookOpen,
  School,
  ClipboardList,
  FileText,
} from 'lucide-react'

interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  totalSubjects: number
  currentSession: string
  currentTerm: string
  draftResults: number
  submittedResults: number
  approvedResults: number
  publishedResults: number
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSubjects: 0,
    currentSession: '—',
    currentTerm: '—',
    draftResults: 0,
    submittedResults: 0,
    approvedResults: 0,
    publishedResults: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const [
        { count: students },
        { count: teachers },
        { count: classes },
        { count: subjects },
        { data: session },
        { data: term },
        { count: draft },
        { count: submitted },
        { count: approved },
        { count: published },
      ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('teacher_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('class_arms').select('*', { count: 'exact', head: true }),
        supabase.from('subjects').select('*', { count: 'exact', head: true }),
        supabase.from('academic_sessions').select('name').eq('is_current', true).single(),
        supabase.from('terms').select('name').eq('is_current', true).single(),
        supabase.from('assessment_results').select('*', { count: 'exact', head: true }).eq('status', 'DRAFT'),
        supabase.from('assessment_results').select('*', { count: 'exact', head: true }).eq('status', 'SUBMITTED'),
        supabase.from('assessment_results').select('*', { count: 'exact', head: true }).eq('status', 'APPROVED'),
        supabase.from('assessment_results').select('*', { count: 'exact', head: true }).eq('status', 'PUBLISHED'),
      ])

      setStats({
        totalStudents: students || 0,
        totalTeachers: teachers || 0,
        totalClasses: classes || 0,
        totalSubjects: subjects || 0,
        currentSession: session?.name || '—',
        currentTerm: term?.name || '—',
        draftResults: draft || 0,
        submittedResults: submitted || 0,
        approvedResults: approved || 0,
        publishedResults: published || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
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
      {/* Current Session Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <School className="w-5 h-5 text-primary" />
          <span className="font-medium text-primary">Current Session:</span>
          <span className="text-gray-900">{stats.currentSession}</span>
          <span className="text-gray-400">|</span>
          <span className="font-medium text-primary">Term:</span>
          <span className="text-gray-900">{stats.currentTerm}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats.totalStudents} icon={<GraduationCap className="w-5 h-5" />} color="blue" />
        <StatCard label="Total Teachers" value={stats.totalTeachers} icon={<Users className="w-5 h-5" />} color="green" />
        <StatCard label="Class Arms" value={stats.totalClasses} icon={<School className="w-5 h-5" />} color="yellow" />
        <StatCard label="Subjects" value={stats.totalSubjects} icon={<BookOpen className="w-5 h-5" />} color="purple" />
      </div>

      {/* Results Overview */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <CardTitle>Results Overview</CardTitle>
        </div>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats.draftResults}</p>
              <p className="text-sm text-gray-500">Draft</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{stats.submittedResults}</p>
              <p className="text-sm text-gray-500">Submitted</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.approvedResults}</p>
              <p className="text-sm text-gray-500">Approved</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{stats.publishedResults}</p>
              <p className="text-sm text-gray-500">Published</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <CardTitle>Quick Actions</CardTitle>
        </div>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a href="/super-admin/users" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-xs text-gray-500">Create and manage accounts</p>
              </div>
            </a>
            <a href="/super-admin/classes" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <School className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Manage Classes</p>
                <p className="text-xs text-gray-500">Class levels and arms</p>
              </div>
            </a>
            <a href="/super-admin/subjects" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Manage Subjects</p>
                <p className="text-xs text-gray-500">Subjects and assignments</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
