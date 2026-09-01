import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/Card'
import { GraduationCap, Plus, Search, Edit, Eye } from 'lucide-react'

interface StudentRow {
  id: string
  admission_number: string
  first_name: string
  middle_name: string | null
  surname: string
  gender: 'MALE' | 'FEMALE'
  is_active: boolean
  created_at: string
}

export default function SuperAdminStudents() {
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { loadStudents() }, [])

  async function loadStudents() {
    setLoading(true)
    const { data } = await supabase
      .from('students')
      .select('*')
      .order('admission_number', { ascending: true })
    setStudents(data || [])
    setLoading(false)
  }

  const filtered = students.filter((s) => {
    const fullName = `${s.first_name} ${s.middle_name || ''} ${s.surname}`.toLowerCase()
    return fullName.includes(search.toLowerCase()) ||
      s.admission_number.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
          <p className="text-gray-500">Manage student records and enrollment</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      <Card>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or admission number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adm. No.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{s.admission_number}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{s.first_name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {s.first_name} {s.middle_name || ''} {s.surname}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.gender}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 text-gray-400 hover:text-primary rounded" title="View"><Eye className="w-4 h-4" /></button>
                        <button className="p-1 text-gray-400 hover:text-primary rounded" title="Edit"><Edit className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No students found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
