import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { Star, Plus, Trash2 } from 'lucide-react'

interface GradeEntry {
  id: string
  label: string
  min_score: number
  max_score: number
  description: string
  sort_order: number
  is_active: boolean
}

export default function SuperAdminGrading() {
  const [grades, setGrades] = useState<GradeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newGrade, setNewGrade] = useState({ label: '', min_score: 0, max_score: 100, description: '' })

  useEffect(() => { loadGrades() }, [])

  async function loadGrades() {
    const { data } = await supabase.from('grade_scales').select('*').order('sort_order')
    setGrades(data || [])
    setLoading(false)
  }

  async function addGrade(e: React.FormEvent) {
    e.preventDefault()
    const maxOrder = Math.max(...grades.map(g => g.sort_order), 0)
    await supabase.from('grade_scales').insert({
      label: newGrade.label,
      min_score: newGrade.min_score,
      max_score: newGrade.max_score,
      description: newGrade.description,
      sort_order: maxOrder + 1,
    })
    setNewGrade({ label: '', min_score: 0, max_score: 100, description: '' })
    setShowAdd(false)
    loadGrades()
  }

  async function deleteGrade(id: string) {
    if (!confirm('Delete this grade?')) return
    await supabase.from('grade_scales').delete().eq('id', id)
    loadGrades()
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('grade_scales').update({ is_active: !current }).eq('id', id)
    loadGrades()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Grading Scale</h2>
          <p className="text-gray-500">Configure the global grading scale used across the school</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-md hover:bg-[#162d4a]">
          <Plus className="w-4 h-4" /> Add Grade
        </button>
      </div>

      {showAdd && (
        <Card>
          <CardContent>
            <form onSubmit={addGrade} className="grid sm:grid-cols-4 gap-4">
              <input type="text" placeholder="Label (e.g. A)" value={newGrade.label} onChange={(e) => setNewGrade({ ...newGrade, label: e.target.value })} required className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <input type="number" placeholder="Min score" value={newGrade.min_score} onChange={(e) => setNewGrade({ ...newGrade, min_score: Number(e.target.value) })} required className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <input type="number" placeholder="Max score" value={newGrade.max_score} onChange={(e) => setNewGrade({ ...newGrade, max_score: Number(e.target.value) })} required className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <input type="text" placeholder="Description" value={newGrade.description} onChange={(e) => setNewGrade({ ...newGrade, description: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <div className="sm:col-span-4 flex gap-2">
                <button type="submit" className="px-4 py-2 bg-[#1e3a5f] text-white rounded-md text-sm">Save</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm">Cancel</button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {grades.map((g) => (
                  <tr key={g.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-lg text-gray-900">{g.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{g.min_score}</td>
                    <td className="px-4 py-3 text-sm">{g.max_score}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{g.description}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(g.id, g.is_active)} className={`px-2 py-1 rounded-full text-xs font-medium ${g.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {g.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteGrade(g.id)} className="p-1 text-gray-400 hover:text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
