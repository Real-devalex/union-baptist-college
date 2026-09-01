import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react'

interface SubjectRow {
  id: string
  name: string
  code: string | null
  sort_order: number
  is_active: boolean
}

export default function SuperAdminSubjects() {
  const [subjects, setSubjects] = useState<SubjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newCode, setNewCode] = useState('')

  useEffect(() => { loadSubjects() }, [])

  async function loadSubjects() {
    setLoading(true)
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .order('sort_order')
    setSubjects(data || [])
    setLoading(false)
  }

  async function addSubject() {
    if (!newName.trim()) return
    const { error } = await supabase.from('subjects').insert({
      name: newName.trim(),
      code: newCode.trim() || null,
      sort_order: subjects.length + 1,
    })
    if (!error) {
      setNewName('')
      setNewCode('')
      loadSubjects()
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Subject Management</h2>
        <p className="text-gray-500">Manage subjects offered in the school</p>
      </div>

      {/* Add Subject */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <CardTitle>Add Subject</CardTitle>
        </div>
        <CardContent>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Subject name (e.g., Mathematics)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Code (optional)"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={addSubject}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Subjects List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjects.map((s, idx) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="font-medium text-gray-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{s.code || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-gray-400 hover:text-primary rounded" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button className="p-1 text-gray-400 hover:text-red-500 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No subjects yet. Add one above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
