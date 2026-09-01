import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/Card'
import { Award, Search, Plus, Edit, UserX, UserCheck } from 'lucide-react'

interface TeacherRow {
  id: string
  user_id: string
  employee_id: string | null
  department: string | null
  qualification: string | null
  hire_date: string | null
  users: { name: string; email: string; is_active: boolean } | null
}

export default function SuperAdminTeachers() {
  const [teachers, setTeachers] = useState<TeacherRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('teacher_profiles')
      .select('*, users:user_id(name, email, is_active)')
      .order('created_at', { ascending: false })
    setTeachers((data as TeacherRow[]) || [])
    setLoading(false)
  }

  const filtered = teachers.filter(t => {
    const name = t.users?.name || ''
    const email = t.users?.email || ''
    return name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Teachers</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage teacher accounts and assignments</p>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Search teachers..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-[#1e3a5f]">{t.users?.name?.charAt(0) || '?'}</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{t.users?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{t.users?.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{t.employee_id || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{t.department || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${t.users?.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {t.users?.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No teachers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
