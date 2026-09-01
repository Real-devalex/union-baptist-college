import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { StatCard } from '@/components/ui/Card'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { ClipboardList, CheckCircle, XCircle, FileText, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PrincipalDashboard() {
  const [stats, setStats] = useState({
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    published: 0,
    draft: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    const [
      { count: pending },
      { count: approved },
      { count: rejected },
      { count: published },
      { count: draft },
    ] = await Promise.all([
      supabase.from('assessment_results').select('*', { count: 'exact', head: true }).eq('status', 'SUBMITTED'),
      supabase.from('assessment_results').select('*', { count: 'exact', head: true }).eq('status', 'APPROVED'),
      supabase.from('assessment_results').select('*', { count: 'exact', head: true }).eq('status', 'REJECTED'),
      supabase.from('assessment_results').select('*', { count: 'exact', head: true }).eq('status', 'PUBLISHED'),
      supabase.from('assessment_results').select('*', { count: 'exact', head: true }).eq('status', 'DRAFT'),
    ])
    setStats({
      pendingReview: pending || 0,
      approved: approved || 0,
      rejected: rejected || 0,
      published: published || 0,
      draft: draft || 0,
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
      <h2 className="text-2xl font-bold text-gray-900">Principal Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Review" value={stats.pendingReview} icon={<ClipboardList className="w-5 h-5" />} color="yellow" />
        <StatCard label="Approved" value={stats.approved} icon={<CheckCircle className="w-5 h-5" />} color="green" />
        <StatCard label="Rejected" value={stats.rejected} icon={<XCircle className="w-5 h-5" />} color="red" />
        <StatCard label="Published" value={stats.published} icon={<FileText className="w-5 h-5" />} color="blue" />
      </div>

      {/* Pending Reviews */}
      <Card>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <CardTitle>Pending Reviews</CardTitle>
          <Link to="/principal/review" className="text-sm text-primary hover:underline">
            View All →
          </Link>
        </div>
        <CardContent>
          {stats.pendingReview > 0 ? (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                You have <strong>{stats.pendingReview}</strong> result(s) awaiting your review.
              </p>
              <Link to="/principal/review" className="ml-auto text-sm font-medium text-primary hover:underline">
                Review Now
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No pending reviews at this time.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
