import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { ClipboardCheck, CheckCircle, XCircle, Eye, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Application {
  id: string
  applicant_name: string
  applicant_email: string | null
  applicant_phone: string | null
  student_first_name: string
  student_middle_name: string | null
  student_surname: string
  student_gender: string
  student_date_of_birth: string | null
  parent_name: string
  parent_email: string | null
  parent_phone: string
  parent_occupation: string | null
  desired_class_level: string
  previous_school: string | null
  status: string
  rejection_reason: string | null
  admission_number: string | null
  created_at: string
}

export default function SuperAdminAdmissions() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => { loadApplications() }, [])

  async function loadApplications() {
    const { data } = await supabase.from('admission_applications').select('*').order('created_at', { ascending: false })
    setApplications(data || [])
    setLoading(false)
  }

  const filtered = applications.filter((a) => {
    const matchesSearch = !search || a.applicant_name.toLowerCase().includes(search.toLowerCase()) || a.student_first_name.toLowerCase().includes(search.toLowerCase()) || a.student_surname.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter
    return matchesSearch && matchesStatus
  })

  async function approveApplication(app: Application) {
    if (!confirm(`Approve ${app.student_first_name} ${app.student_surname}?`)) return
    setProcessing(true)
    await supabase.from('admission_applications').update({
      status: 'APPROVED',
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', app.id)
    setProcessing(false)
    loadApplications()
    setSelectedApp(null)
  }

  async function rejectApplication(app: Application) {
    if (!rejectReason.trim()) { alert('Please provide a reason for rejection'); return }
    setProcessing(true)
    await supabase.from('admission_applications').update({
      status: 'REJECTED',
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
      rejection_reason: rejectReason,
    }).eq('id', app.id)
    setProcessing(false)
    setRejectReason('')
    loadApplications()
    setSelectedApp(null)
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      UNDER_REVIEW: 'bg-blue-100 text-blue-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      ENROLLED: 'bg-purple-100 text-purple-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admission Applications</h2>
        <p className="text-gray-500">Review and process admission applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map(status => (
          <Card key={status}>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-gray-900">{applications.filter(a => a.status === status).length}</p>
              <p className="text-sm text-gray-500">{status.replace('_', ' ')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search applications..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="ENROLLED">Enrolled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent/Guardian</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class Applied</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{app.student_first_name} {app.student_surname}</p>
                      <p className="text-xs text-gray-500">{app.student_gender}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.parent_name}</td>
                    <td className="px-4 py-3 text-sm font-medium">{app.desired_class_level}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>{app.status}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(app.created_at).toLocaleDateString('en-NG')}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelectedApp(app)} className="p-1 text-gray-400 hover:text-[#1e3a5f] rounded"><Eye className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No applications found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Application Details</h3>
                <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Student</p>
                <p className="font-medium">{selectedApp.student_first_name} {selectedApp.student_middle_name} {selectedApp.student_surname}</p>
                <p className="text-sm text-gray-500">{selectedApp.student_gender} | DOB: {selectedApp.student_date_of_birth ? new Date(selectedApp.student_date_of_birth).toLocaleDateString('en-NG') : '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Parent/Guardian</p>
                <p className="font-medium">{selectedApp.parent_name}</p>
                <p className="text-sm text-gray-500">Phone: {selectedApp.parent_phone} | Email: {selectedApp.parent_email || '—'}</p>
                <p className="text-sm text-gray-500">Occupation: {selectedApp.parent_occupation || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Academic</p>
                <p className="text-sm">Class Applied: <strong>{selectedApp.desired_class_level}</strong></p>
                <p className="text-sm text-gray-500">Previous School: {selectedApp.previous_school || '—'}</p>
              </div>

              {selectedApp.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button onClick={() => approveApplication(selectedApp)} disabled={processing} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <div className="flex-1 space-y-2">
                    <input type="text" placeholder="Rejection reason..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    <button onClick={() => rejectApplication(selectedApp)} disabled={processing} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              )}

              {selectedApp.status === 'APPROVED' && (
                <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Application approved. Admin needs to create student account and enroll.
                </div>
              )}

              {selectedApp.status === 'REJECTED' && selectedApp.rejection_reason && (
                <div className="p-3 bg-red-50 rounded-lg text-sm text-red-700">
                  <strong>Rejection reason:</strong> {selectedApp.rejection_reason}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
