import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { StatCard } from '@/components/ui/Card'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import {
  Users, GraduationCap, BookOpen, School, Calendar, Star,
  ClipboardCheck, Shield, BarChart3, FileText, ClipboardList,
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalClassArms: number
  totalSubjects: number
  currentSession: string
  currentTerm: string
  draftResults: number
  submittedResults: number
  approvedResults: number
  publishedResults: number
  pendingApplications: number
  totalUsers: number
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0, totalTeachers: 0, totalClassArms: 0, totalSubjects: 0,
    currentSession: '—', currentTerm: '—',
    draftResults: 0, submittedResults: 0, approvedResults: 0, publishedResults: 0,
    pendingApplications: 0, totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    const [
      { count: students }, { count: teachers }, { count: arms }, { count: subjects },
      { data: session }, { data: term },
      { count: draft }, { count: submitted }, { count: approved }, { count: published },
      { count: pending }, { count: users },
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
      supabase.from('admission_applications').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
      supabase.from('users').select('*', { count: 'exact', head: true }),
    ])

    setStats({
      totalStudents: students || 0, totalTeachers: teachers || 0,
      totalClassArms: arms || 0, totalSubjects: subjects || 0,
      currentSession: session?.name || '—', currentTerm: term?.name?.replace('_', ' ') || '—',
      draftResults: draft || 0, submittedResults: submitted || 0,
      approvedResults: approved || 0, publishedResults: published || 0,
      pendingApplications: pending || 0, totalUsers: users || 0,
    })
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]" /></div>
  }

  return (
    <div className="space-y-6">
      {/* Session Info */}
      <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg p-4 flex items-center gap-3">
        <Calendar className="w-5 h-5 text-[#1e3a5f]" />
        <span className="font-medium text-[#1e3a5f]">Current Session:</span>
        <span className="text-gray-900 dark:text-white">{stats.currentSession}</span>
        <span className="text-gray-400">|</span>
        <span className="font-medium text-[#1e3a5f]">Term:</span>
        <span className="text-gray-900 dark:text-white">{stats.currentTerm}</span>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats.totalStudents} icon={<GraduationCap className="w-5 h-5" />} color="blue" />
        <StatCard label="Total Teachers" value={stats.totalTeachers} icon={<Users className="w-5 h-5" />} color="green" />
        <StatCard label="Class Arms" value={stats.totalClassArms} icon={<School className="w-5 h-5" />} color="yellow" />
        <StatCard label="Subjects" value={stats.totalSubjects} icon={<BookOpen className="w-5 h-5" />} color="purple" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="System Users" value={stats.totalUsers} icon={<Shield className="w-5 h-5" />} color="gray" />
        <StatCard label="Pending Admissions" value={stats.pendingApplications} icon={<ClipboardCheck className="w-5 h-5" />} color={stats.pendingApplications > 0 ? 'yellow' : 'gray'} />
        <StatCard label="Published Results" value={stats.publishedResults} icon={<FileText className="w-5 h-5" />} color="green" />
        <StatCard label="Submitted (Review)" value={stats.submittedResults} icon={<ClipboardList className="w-5 h-5" />} color="yellow" />
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
            <Link to="/super-admin/users" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Users className="w-5 h-5 text-[#1e3a5f]" />
              <div>
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-xs text-gray-500">Create and manage accounts</p>
              </div>
            </Link>
            <Link to="/super-admin/admissions" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <ClipboardCheck className="w-5 h-5 text-[#1e3a5f]" />
              <div>
                <p className="font-medium text-gray-900">Admissions</p>
                <p className="text-xs text-gray-500">Review applications</p>
              </div>
            </Link>
            <Link to="/super-admin/sessions" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Calendar className="w-5 h-5 text-[#1e3a5f]" />
              <div>
                <p className="font-medium text-gray-900">Sessions</p>
                <p className="text-xs text-gray-500">Manage academic sessions</p>
              </div>
            </Link>
            <Link to="/super-admin/grading" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Star className="w-5 h-5 text-[#1e3a5f]" />
              <div>
                <p className="font-medium text-gray-900">Grading Scale</p>
                <p className="text-xs text-gray-500">Configure grade ranges</p>
              </div>
            </Link>
            <Link to="/super-admin/classes" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <School className="w-5 h-5 text-[#1e3a5f]" />
              <div>
                <p className="font-medium text-gray-900">Classes</p>
                <p className="text-xs text-gray-500">Class levels and arms</p>
              </div>
            </Link>
            <Link to="/super-admin/audit" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Shield className="w-5 h-5 text-[#1e3a5f]" />
              <div>
                <p className="font-medium text-gray-900">Audit Logs</p>
                <p className="text-xs text-gray-500">View system activity</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
